import { gql } from '@apollo/client';
import { useMutation } from '@apollo/client/react';
import { getDefaultStore } from 'jotai';
import { useCallback, useEffect, useMemo, useState } from 'react';
import i18n from '../../i18n';
import {
  clearStoredAuth,
  getAuthExpiration,
  getValidStoredToken,
  persistAuthToken,
} from '../auth/tokenStorage';
import { UserRole, type UserRoleName } from '../types/enums';
import {
  billsAtom,
  clearDashboardOrdersAtom,
  deliveryStatsAtom,
  inProcessOrdersAtom,
  incomingOrdersAtom,
  orderOptionsDialogOpenAtom,
  orderStatsAtom,
  restaurantOpenAtom,
  selectedMenuAtom,
  selectedOrderAtom,
} from '../../context/dashboardStore';
import { menuEditorStateAtom } from '../../context/menuEditorStore';
import { resetSettingsAtom } from '../../context/settingsStore';

const AUTH_STATE_CHANGED_EVENT = 'auth-state-changed';
const jotaiStore = getDefaultStore();
let authExpirationTimerId: number | null = null;

const resetAppState = () => {
  jotaiStore.set(selectedMenuAtom, i18n.t('dashboard.menu.dashboard'));
  jotaiStore.set(incomingOrdersAtom, []);
  jotaiStore.set(inProcessOrdersAtom, []);
  jotaiStore.set(billsAtom, []);
  jotaiStore.set(deliveryStatsAtom, {
    delivered: 0,
    onTheWay: 0,
    cancelled: 0,
  });
  jotaiStore.set(orderStatsAtom, {
    today: 0,
    yesterday: 0,
    lastMonth: 0,
  });
  jotaiStore.set(restaurantOpenAtom, true);
  jotaiStore.set(clearDashboardOrdersAtom);
  jotaiStore.set(selectedOrderAtom, null);
  jotaiStore.set(orderOptionsDialogOpenAtom, false);
  jotaiStore.set(menuEditorStateAtom, {
    categories: [],
    productsByCategoryId: {},
  });
  jotaiStore.set(resetSettingsAtom);
};

const LOGIN_MUTATION = gql`
  mutation Login($input: LoginInput!) {
    login(input: $input) {
      success
      message
      token
    }
  }
`;

interface LoginMutationData {
  login?: {
    success: boolean;
    message?: string | null;
    token?: string | null;
  } | null;
}

interface LoginMutationVariables {
  input: {
    loginOrEmail: string;
    password: string;
  };
}

interface AuthorizationResult {
  success: boolean;
  error?: string;
}

interface AuthorizationHook {
  isAuthorized: boolean;
  isAuthorizing: boolean;
  authExpiresAt: number | null;
  authorizeWithCredentials: (loginOrEmail: string, password: string) => Promise<AuthorizationResult>;
  logout: () => void;
  getToken: () => string | null;
  getCurrentRole: () => UserRoleName | null;
}

interface JwtPayload {
  exp?: number;
  role?: unknown;
}

const ROLE_BY_VALUE: Record<number, UserRoleName> = {
  [UserRole.User]: 'User',
  [UserRole.RestaurantUser]: 'RestaurantUser',
  [UserRole.RestaurantAdmin]: 'RestaurantAdmin',
  [UserRole.RestaurantManager]: 'RestaurantManager',
  [UserRole.Superuser]: 'Superuser',
};

const normalizeRoleName = (role: unknown): UserRoleName | null => {
  if (typeof role === 'number') {
    return ROLE_BY_VALUE[role] ?? null;
  }

  if (typeof role !== 'string') {
    return null;
  }

  const trimmedRole = role.trim();
  if (!trimmedRole) {
    return null;
  }

  const numericRole = Number.parseInt(trimmedRole, 10);
  if (!Number.isNaN(numericRole)) {
    return ROLE_BY_VALUE[numericRole] ?? null;
  }

  const normalized = trimmedRole.toLowerCase();
  if (normalized === 'user') return 'User';
  if (normalized === 'restaurantuser') return 'RestaurantUser';
  if (normalized === 'restaurantadmin') return 'RestaurantAdmin';
  if (normalized === 'restaurantmanager') return 'RestaurantManager';
  if (normalized === 'superuser') return 'Superuser';

  return null;
};

const parseJwtPayload = (token: string): JwtPayload | null => {
  try {
    const payloadSegment = token.split('.')[1];
    if (!payloadSegment) {
      return null;
    }

    const base64 = payloadSegment.replace(/-/g, '+').replace(/_/g, '/');
    const normalized = base64.padEnd(Math.ceil(base64.length / 4) * 4, '=');
    return JSON.parse(atob(normalized)) as JwtPayload;
  } catch {
    return null;
  }
};

const getStoredToken = (): string | null => {
  return getValidStoredToken();
};

const notifyAuthStateChange = () => {
  window.dispatchEvent(new Event(AUTH_STATE_CHANGED_EVENT));
};

export const useAuthorization = (): AuthorizationHook => {
  const [isAuthorized, setIsAuthorized] = useState<boolean>(() => Boolean(getStoredToken()));
  const [authExpiresAt, setAuthExpiresAt] = useState<number | null>(() => getAuthExpiration());

  const [loginMutation, { loading }] = useMutation<LoginMutationData, LoginMutationVariables>(LOGIN_MUTATION);

  const logoutInternal = useCallback(() => {
    resetAppState();
    clearStoredAuth();
    if (authExpirationTimerId !== null) {
      window.clearTimeout(authExpirationTimerId);
      authExpirationTimerId = null;
    }
    setIsAuthorized(false);
    setAuthExpiresAt(null);
    notifyAuthStateChange();
  }, []);

  const scheduleAutomaticLogout = useCallback((expiresAt: number | null) => {
    if (authExpirationTimerId !== null) {
      window.clearTimeout(authExpirationTimerId);
      authExpirationTimerId = null;
    }

    if (!expiresAt) {
      return;
    }

    const delay = expiresAt - Date.now();
    if (delay <= 0) {
      logoutInternal();
      return;
    }

    authExpirationTimerId = window.setTimeout(() => {
      logoutInternal();
    }, delay);
  }, [logoutInternal]);

  const syncAuthorizationState = useCallback(() => {
    const token = getStoredToken();
    const expiration = token ? getAuthExpiration() : null;
    setIsAuthorized(Boolean(token));
    setAuthExpiresAt(expiration);
    scheduleAutomaticLogout(expiration);
  }, [scheduleAutomaticLogout]);

  useEffect(() => {
    window.addEventListener(AUTH_STATE_CHANGED_EVENT, syncAuthorizationState);
    window.addEventListener('storage', syncAuthorizationState);

    return () => {
      window.removeEventListener(AUTH_STATE_CHANGED_EVENT, syncAuthorizationState);
      window.removeEventListener('storage', syncAuthorizationState);
    };
  }, [syncAuthorizationState]);

  useEffect(() => {
    syncAuthorizationState();
  }, [syncAuthorizationState]);

  const authorizeWithCredentials = useCallback(async (loginOrEmail: string, password: string): Promise<AuthorizationResult> => {
    try {
      const { data } = await loginMutation({
        variables: {
          input: {
            loginOrEmail,
            password,
          },
        },
      });

      const response = data?.login;
      if (!response?.success || !response.token) {
        return {
          success: false,
          error: response?.message ?? 'Invalid credentials',
        };
      }

      const expiresAt = persistAuthToken(response.token);
      setIsAuthorized(true);
      setAuthExpiresAt(expiresAt);
      scheduleAutomaticLogout(expiresAt);
      notifyAuthStateChange();

      return { success: true };
    } catch (error) {
      return {
        success: false,
        error: (error as Error).message || 'Login failed',
      };
    }
  }, [loginMutation]);

  const logout = useCallback(() => {
    logoutInternal();
  }, [logoutInternal]);

  const getToken = useCallback(() => getStoredToken(), []);
  const getCurrentRole = useCallback((): UserRoleName | null => {
    const token = getStoredToken();
    if (!token) {
      return null;
    }

    return normalizeRoleName(parseJwtPayload(token)?.role);
  }, []);

  return useMemo(() => ({
    isAuthorized,
    isAuthorizing: loading,
    authExpiresAt,
    authorizeWithCredentials,
    logout,
    getToken,
    getCurrentRole,
  }), [authExpiresAt, authorizeWithCredentials, getCurrentRole, getToken, isAuthorized, loading, logout]);
};
