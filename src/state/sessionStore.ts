import { atom } from "jotai";
import { atomFamily } from 'jotai-family'

import { SessionService } from "../api/services/sessionService";
import { Session } from "../types/models";
import { BillService } from "../api/services/billService";
import { Bill } from "../types/models/bill";
import { BillStatus } from "../types/enums/billStatus";
import { BillDto } from "../types/dtos/billDto";
import { OrderProductDto } from "../types/dtos/orderProductDto";
import { productsAtom } from "./productStore";
import { userIdAtom } from "./authStore";

// TODO: investigate atomFamily for independent resources (e.g. tabletSessions), so that we don't have to fetch every single session again

export const loadingAtom = atom(false); 

export const errorAtom = atom<string | null>(null);

export const sessionsAtom = atom<Session[]>([]);

export const getAllSessionsAtom = atom(
    (get) => get(sessionsAtom),
    async (get, set) => {
        set(loadingAtom, true);
        set(errorAtom, null);
        
        try {
            const userId = get(userIdAtom);
            if (!userId) return;

            const sessions = await SessionService.getByUserId(userId);
            set(sessionsAtom, sessions);
        }
        catch {
            set(errorAtom, "Error fetching sessions");
        }
        finally {
            set(loadingAtom, false);
        }
    }
);

export const currentSessionsAtom = atom<Session[]>([]);

export const getLatestSessionsAtom = atom(
    (get) => get(currentSessionsAtom),
    async (get, set) => {
        set(loadingAtom, true);
        set(errorAtom, null);

        try {
            const userId = get(userIdAtom);
            if (!userId) return;

            const sessions = await SessionService.getByUserId(userId, { GetLatest: true });
            set(currentSessionsAtom, sessions);
        }
        catch {
            set(errorAtom, "Error fetching sessions");
        }
        finally {
            set(loadingAtom, false);
        }
    }
);

export const getTabletSessionAtom = atomFamily((tabletId: string) =>
  atom((get) => {
    const sessions = get(currentSessionsAtom);

    return sessions.find(session => session.tabletId === tabletId)
  })
);

export const setEndSessionAtom = atom(
    null,
    async (get, set, id: string) => {
        try {
            const sessions = get(currentSessionsAtom);
            const currentSession = sessions.find(session => session.id === id);
    
            if (currentSession) {
                const updatedSessions = sessions.map(session => 
                    session.id === id ? 
                    { ...session, EndSessionTime: new Date() }
                    : session
                );
                set(currentSessionsAtom, updatedSessions);
                await SessionService.endSession(currentSession);
            }
        }
        catch (error) {
            console.error("Error setting end session:", error);
        }
    }
);

export const billsAtom = atom<Bill[]>([]);

// Not to be confused with getSessionBillsAtom
export const getBillsBySessionIdAtom = atom(
    (get) => get(billsAtom),
    async (get, set, sessionId: string) => {
        set(loadingAtom, true);
        set(errorAtom, null);

        try {
            const bills = await BillService.getNewBySessionId(sessionId);

            const currentBills = get(billsAtom);

            const updatedBills: Bill[] = bills.map(bill => {
                if (currentBills.find(prev => bill.id === prev.id)) { 
                    const currentBill = currentBills.find(prev => prev.id === bill.id);
                    return { 
                        ...currentBill,
                        ...bill
                    }
                }
                else {
                    return bill;
                }
            });

            set(billsAtom, updatedBills);
        }
        catch {
            set(errorAtom, "Error fetching bills");
        }
        finally {
            set(loadingAtom, false)
        }
    }
);

export const getSessionBillsAtom = atomFamily((sessionId: string) => 
    atom((get) => {
        return get(billsAtom).filter(bill => bill.sessionId === sessionId);
    })
);

export const confirmBillAtom = atom(
    null,
    async (get, set, billId: string) => {
        set(loadingAtom, true);
        set(errorAtom, null);

        try {
            const currentBills = get(billsAtom);
            const selectedBill = currentBills.find(prev => prev.id === billId);

            if (!selectedBill) return;

            const products = get(productsAtom);

            const updatedBill: BillDto = { 
                ...selectedBill, 
                status: BillStatus.COMPLETED,
                orderProducts: selectedBill.orderProducts.map(orderProduct => {
                    const product = products.find(product => product.id === orderProduct.productId);

                    return <OrderProductDto>{ 
                        ...orderProduct,
                        name: product?.name ?? '',
                        price: product?.price ?? 0
                    }
                })
            };

            const updatedBills: Bill[] = currentBills.map(bill => 
                bill.id === billId ? { ...bill, status: BillStatus.COMPLETED } : bill
            );

            set(billsAtom, updatedBills);

            await BillService.updateBillStatus(updatedBill);
        }
        catch {
            set(errorAtom, "Error updating bill status");
        }
        finally {
            set(loadingAtom, false);
        }
    }
);