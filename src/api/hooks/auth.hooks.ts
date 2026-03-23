import { gql } from '@apollo/client';
import { useMutation } from '@apollo/client/react';
import { getDefaultStore } from 'jotai';
import { useCallback, useEffect, useMemo, useState } from 'react';
import i18n from '../../i18n';
import {
  billsAtom,
  deliveryStatsAtom,
  inProcessOrdersAtom,
  incomingOrdersAtom,
  orderListSectionsAtom,
  orderOptionsDialogOpenAtom,
  orderStatsAtom,
  restaurantOpenAtom,
  selectedMenuAtom,
  selectedOrderAtom,
} from '../../context/dashboardStore';
import { menuEditorStateAtom } from '../../context/menuEditorStore';
import { resetSettingsAtom } from '../../context/settingsStore';

const AUTH_TOKEN_STORAGE_KEY = 'authToken';
const AUTH_STATE_CHANGED_EVENT = 'auth-state-changed';
const jotaiStore = getDefaultStore();

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
  jotaiStore.set(orderListSectionsAtom, []);
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
  authorizeWithCredentials: (loginOrEmail: string, password: string) => Promise<AuthorizationResult>;
  logout: () => void;
  getToken: () => string | null;
}

interface JwtPayload {
  exp?: number;
}

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

const isTokenValid = (token: string | null): boolean => {
  if (!token) {
    return false;
  }

  const payload = parseJwtPayload(token);
  if (!payload?.exp) {
    return true;
  }

  return payload.exp * 1000 > Date.now();
};

const getStoredToken = (): string | null => {
  const token = localStorage.getItem(AUTH_TOKEN_STORAGE_KEY);
  if (!isTokenValid(token)) {
    localStorage.removeItem(AUTH_TOKEN_STORAGE_KEY);
    return null;
  }

  return token;
};

const notifyAuthStateChange = () => {
  window.dispatchEvent(new Event(AUTH_STATE_CHANGED_EVENT));
};

export const useAuthorization = (): AuthorizationHook => {
  const [isAuthorized, setIsAuthorized] = useState<boolean>(() => Boolean(getStoredToken()));

  const [loginMutation, { loading }] = useMutation<LoginMutationData, LoginMutationVariables>(LOGIN_MUTATION);

  const syncAuthorizationState = useCallback(() => {
    setIsAuthorized(Boolean(getStoredToken()));
  }, []);

  useEffect(() => {
    window.addEventListener(AUTH_STATE_CHANGED_EVENT, syncAuthorizationState);
    window.addEventListener('storage', syncAuthorizationState);

    return () => {
      window.removeEventListener(AUTH_STATE_CHANGED_EVENT, syncAuthorizationState);
      window.removeEventListener('storage', syncAuthorizationState);
    };
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

      localStorage.setItem(AUTH_TOKEN_STORAGE_KEY, response.token);
      setIsAuthorized(true);
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
    resetAppState();
    localStorage.removeItem(AUTH_TOKEN_STORAGE_KEY);
    setIsAuthorized(false);
    notifyAuthStateChange();
  }, []);

  const getToken = useCallback(() => getStoredToken(), []);

  return useMemo(() => ({
    isAuthorized,
    isAuthorizing: loading,
    authorizeWithCredentials,
    logout,
    getToken,
  }), [authorizeWithCredentials, getToken, isAuthorized, loading, logout]);
};
