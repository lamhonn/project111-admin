import { atom } from 'jotai';
import i18n from '../i18n';

/**
 * Settings Store - Global state management for application settings
 * Using Jotai for state management
 */

export interface Settings {
  restaurantName: string;
  accentColor: string;
  backgroundColor: string;
  dialogColor: string;
  textColor: string;
  actionBarColor: string;
  username: string;
  email: string;
  systemLanguage: string;
}

export const DEFAULT_SETTINGS: Settings = {
  restaurantName: '',
  accentColor: '#1976d2',
  backgroundColor: '#ffffff',
  dialogColor: '#ffffff',
  textColor: '#000000',
  actionBarColor: '#f5f5f5',
  username: '',
  email: '',
  systemLanguage: i18n.language,
};

export const settingsAtom = atom<Settings>(DEFAULT_SETTINGS);

// Atom to reset settings to defaults
export const resetSettingsAtom = atom(
  null,
  (_, set) => {
    set(settingsAtom, {
      ...DEFAULT_SETTINGS,
      systemLanguage: i18n.language,
    });
  }
);

// Write-only atom to apply all settings (including language change)
export const applySettingsAtom = atom(
  null,
  (get) => {
    const settings = get(settingsAtom);
    const selectedLanguage = settings.systemLanguage;
    
    // Apply language change at atom level
    if (selectedLanguage !== i18n.language) {
      i18n.changeLanguage(selectedLanguage);
    }

    // TODO: Implement backend persistence
    // Collect all current settings
    const settingsToSave = settings;

    console.log('Save settings:', settingsToSave);
  }
);
