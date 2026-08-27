import { atom } from "jotai";
import { atomWithStorage } from "jotai/utils";
import { SettingsViewModel } from "../types/viewModels/settingsViewModel";
import { OrganizationService } from "../api/services/organizationService";
import { organizationIdAtom } from "./authStore";
import { organizationAtom } from "./organizationStore";
import { Organization } from "../types/models";

export const loadingAtom = atom<boolean>(false);

export const errorAtom = atom<string | null>(null);

export const languageAtom = atomWithStorage<string>("systemLanguage", "en");

export const lockedAtom = atom<boolean>(false);

export const settingsAtom = atom<SettingsViewModel>(
    {
        OrganizationName: 'Restaurant',
        Language: 'en' // language code, e.g.'en'
    }  
);

export const initSettingsAtom = atom(
    null,
    async (get, set) => {
        const language = get(languageAtom);

        const organizationId = get(organizationIdAtom);

        const organization = organizationId ? await OrganizationService.getById(organizationId) : null;

        const settings: SettingsViewModel = {
            OrganizationName: organization?.Name || 'Restaurant',
            Language: language,
        };

        set(settingsAtom, settings);
    }
);

export const updateSettingsAtom = atom(
    null,
    async (get, set, data: SettingsViewModel) => {
        set(loadingAtom, true);
        set(errorAtom, null);
        
        try {
            set(languageAtom, data.Language);

            const organization = get(organizationAtom);
            if (organization) {
                const updatedOrganization: Organization = 
                {
                    ...organization,
                    Name: data.OrganizationName,
                }
        
                set(organizationAtom, updatedOrganization);
    
                await OrganizationService.update({ ...updatedOrganization });
            }
        }
        catch {
            set(errorAtom, "Failed to update settings");
        }
        finally {
            set(loadingAtom, false)
        }
    }
);