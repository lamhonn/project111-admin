interface AuthorizationResult {
  success: boolean;
  error?: string;
}

interface AuthorizationHook {
  authorizeWithPin: (pin: string) => AuthorizationResult;
}

export const useAuthorization = (): AuthorizationHook => {
  const authorizeWithPin = (pin: string): AuthorizationResult => {
    if (/^\d{8}$/.test(pin)) {
      return { success: true };
    }

    return {
      success: false,
      error: 'Invalid PIN',
    };
  };

  return {
    authorizeWithPin,
  };
};
