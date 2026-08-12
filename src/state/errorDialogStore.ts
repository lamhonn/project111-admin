import { atom } from 'jotai';

export const errorDialogOpenAtom = atom(false);
export const errorDialogMessageAtom = atom('');

// Write-only atom: call this from anywhere to pop the dialog with a message
export const showErrorDialogAtom = atom(
  null,
  (get, set, message: string) => {
    set(errorDialogMessageAtom, message);
    set(errorDialogOpenAtom, true);
  }
);

// Write-only atom: closes the dialog (keeps last message around briefly for exit animation)
export const closeErrorDialogAtom = atom(
    null, 
    (get, set) => {
        set(errorDialogOpenAtom, false);
    }
);