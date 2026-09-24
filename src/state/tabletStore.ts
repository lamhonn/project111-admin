import { atom } from "jotai";
import { TabletService } from "../api/services/tabletService";
import { TabletDto } from "../types/dtos/tabletDto";
import { Tablet } from "../types/models";
import { userIdAtom } from "./authStore";
import { PairingService } from "../api/services/pairingService";
import { PairingSession } from "../types/models/pairingSession";

export const errorAtom = atom<string | null>(null);

export const loadingAtom = atom<boolean>(false);

export const tabletsAtom = atom<Tablet[]>([]);

export const getTabletsAtom = atom(
    (get) => get(tabletsAtom),
    async (get, set) => {
        set(loadingAtom, true);
        set(errorAtom, null);

        try {
            const userId = get(userIdAtom);

            if (!userId) return;

            const response = await TabletService.getByUserId(userId);
            
            set(tabletsAtom, response);
        }
        catch {
            set(errorAtom, "Failed to fetch tablets");
        }
        finally {
            set(loadingAtom, false);
        }
    }
);

export const selectedTabletIdAtom = atom<string | null>(null);

export const selectedTabletAtom = atom(
    (get) => {
        const selectedTabletId = get(selectedTabletIdAtom);
        const tablets = get(tabletsAtom);
        
        return tablets.find(tablet => tablet.id === selectedTabletId);
    }
);

export const tabletPairingPinAtom = atom<string | null>(null);
export const tabletPairingIdAtom = atom<string | null>(null);
export const tabletPairingPinExpiresAtom = atom<Date | null>(null);

export const startTabletPairingAtom = atom(
    null,
    async (get, set) => {
        set(loadingAtom, true);
        set(errorAtom, null);

        set(tabletPairingPinAtom, null);
        set(tabletPairingPinExpiresAtom, null);

        try {
            const response: PairingSession = await PairingService.startPairing();

            if (!response) throw new Error;

            set(tabletPairingPinAtom, response.pin);
            set(tabletPairingIdAtom, response.id);
            set(tabletPairingPinExpiresAtom, response.expires);
        }
        catch {
            set(tabletPairingPinAtom, "ERROR");
            set(errorAtom, "Failed to start pairing");
        }
        finally {
            set(loadingAtom, false);
        }
    }
);

export const stopTabletPairingAtom = atom(
    null,
    async (get, set) => {
        const pairingSessionId = get(tabletPairingIdAtom);

        if (!pairingSessionId) return;
        
        try {
            await PairingService.stopPairing(pairingSessionId);
            
            set(tabletPairingPinAtom, null);
            set(tabletPairingIdAtom, null);
            set(tabletPairingPinExpiresAtom, null);
        }
        catch {
            set(errorAtom, "Failed to stop pairing");
        }
    }
);

export const editTabletAtom = atom(
    null,
    async (get, set, tablet: Tablet) => {
        set(errorAtom, null);

        try {
            const tabletDto: TabletDto = {
                id: tablet.id,
                tableNumber: tablet.tableNumber,
                userId: tablet.userId,
            };

            await TabletService.update(tabletDto);

            const tablets = get(tabletsAtom);
            const updatedTablets = tablets.map(t =>
                t.id === tablet.id ? { ...t, ...tablet } : t
            );
    
            set(tabletsAtom, updatedTablets);
        }
        catch {
            set(errorAtom, "Updating tablet failed");
        }
    }
);

export const deleteTabletAtom = atom(
    null,
    async (get, set, tabletId?: string) => {
        set(errorAtom, null);

        try {
            const id = tabletId ? tabletId : get(selectedTabletIdAtom);
            
            if (!id) return;

            await TabletService.delete(id);

            const tablets = get(tabletsAtom);
            const updatedTablets = tablets.filter(tablet => tablet.id !== id);
    
            set(tabletsAtom, updatedTablets);
        }
        catch {
            set(errorAtom, "Deleting tablet failed");
        }
    }
);