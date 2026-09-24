import { atom } from "jotai";
import { Organization } from "../types/models";

export const organizationAtom = atom<Organization | null>(null);

export const getOrganizationAtom = atom(
    (get) => get(organizationAtom),
    async (get, set) => {
        // TODO:
    }
);