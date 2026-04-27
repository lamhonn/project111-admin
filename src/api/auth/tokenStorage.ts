const AUTH_TOKEN_STORAGE_KEY = 'authToken';
const AUTH_EXPIRATION_STORAGE_KEY = 'authTokenExpiresAt';

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

const getTokenExpirationTimestamp = (token: string): number | null => {
  const exp = parseJwtPayload(token)?.exp;
  if (!exp) {
    return null;
  }

  return exp * 1000;
};

const removeStoredAuth = () => {
  localStorage.removeItem(AUTH_TOKEN_STORAGE_KEY);
  localStorage.removeItem(AUTH_EXPIRATION_STORAGE_KEY);
};

const getStoredExpiration = (): number | null => {
  const value = localStorage.getItem(AUTH_EXPIRATION_STORAGE_KEY);
  if (!value) {
    return null;
  }

  const parsed = Number.parseInt(value, 10);
  return Number.isNaN(parsed) ? null : parsed;
};

const isExpirationValid = (expiration: number | null): boolean => {
  if (!expiration) {
    return true;
  }

  return expiration > Date.now();
};

const getStoredToken = (): string | null => localStorage.getItem(AUTH_TOKEN_STORAGE_KEY);

export const getValidStoredToken = (): string | null => {
  const token = getStoredToken();
  if (!token) {
    return null;
  }

  const tokenExpiration = getTokenExpirationTimestamp(token);
  const storedExpiration = getStoredExpiration();
  const effectiveExpiration = tokenExpiration ?? storedExpiration;

  if (!isExpirationValid(effectiveExpiration)) {
    removeStoredAuth();
    return null;
  }

  if (tokenExpiration && storedExpiration !== tokenExpiration) {
    localStorage.setItem(AUTH_EXPIRATION_STORAGE_KEY, String(tokenExpiration));
  }

  return token;
};

export const persistAuthToken = (token: string) => {
  const expiration = getTokenExpirationTimestamp(token);

  localStorage.setItem(AUTH_TOKEN_STORAGE_KEY, token);
  if (expiration) {
    localStorage.setItem(AUTH_EXPIRATION_STORAGE_KEY, String(expiration));
  } else {
    localStorage.removeItem(AUTH_EXPIRATION_STORAGE_KEY);
  }

  return expiration;
};

export const clearStoredAuth = () => {
  removeStoredAuth();
};

export const getAuthExpiration = (): number | null => {
  const token = getStoredToken();
  if (!token) {
    return null;
  }

  return getTokenExpirationTimestamp(token) ?? getStoredExpiration();
};

export const getAuthStorageKeys = () => ({
  token: AUTH_TOKEN_STORAGE_KEY,
  expiration: AUTH_EXPIRATION_STORAGE_KEY,
});
