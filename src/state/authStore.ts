import { atom } from 'jotai';
import { parseUserRole } from '../utils/userRoleUtils';
import { LoginDto } from '../types/dtos/loginDto';

export const tokenAtom = atom<string | null>('demo-token');

export const expirationAtom = atom(
    () => 4102444800
);

export const tabletIdAtom = atom(
    () => 'demo-tablet-1'
);

export const organizationIdAtom = atom(
    () => 'demo-organization'
);

export const userIdAtom = atom(
    () => 'demo-user'
);

export const roleAtom = atom(
    () => parseUserRole('RESTAURANT_MANAGERSTAFF')
);

export const isAuthorizedAtom = atom(() => true);
export const isAuthenticatedAtom = isAuthorizedAtom;

export const tokenPayloadAtom = atom(() => ({
    exp: 4102444800,
    sub: 'demo-tablet-1',
    organizationId: 'demo-organization',
    userId: 'demo-user',
    role: 'RESTAURANT_MANAGERSTAFF',
}));

export const currentPinAtom = atom<string>('');

export const errorAtom = atom<string | null>(null);

export const loadingAtom = atom<boolean>(false);

export const loginAtom = atom(
    null,
    async (_get, set, _login: LoginDto) => {
        set(tokenAtom, 'demo-token');
        set(errorAtom, null);
        set(loadingAtom, false);
    }
);

export const logoutAtom = atom(
    null,
    async (_get, set) => {
        set(tokenAtom, 'demo-token');
        set(currentPinAtom, '');
    }
);