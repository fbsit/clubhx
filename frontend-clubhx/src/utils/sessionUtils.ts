
// Session timeout management utilities

// Session timeout in milliseconds (30 minutes)
export const SESSION_TIMEOUT = 30 * 60 * 1000;

// Key for storing session timeout in localStorage
export const SESSION_TIMEOUT_KEY = "clubhx-session-timeout";
export const USER_KEY = "clubhx-user";
export const TOKEN_KEY = "clubhx-token";
export const TOKEN_TYPE_KEY = "clubhx-token-type"; // 'bearer' | 'client'

/**
 * Check if the current session is expired
 */
export const isSessionExpired = (): boolean => {
  const timeoutTimestamp = localStorage.getItem(SESSION_TIMEOUT_KEY);
  if (!timeoutTimestamp) return true;

  return Date.now() > parseInt(timeoutTimestamp, 10);
};

/**
 * Set a new session timeout
 */
export const setSessionTimeout = (): number => {
  // Set timeout expiration time
  const expirationTime = Date.now() + SESSION_TIMEOUT;
  localStorage.setItem(SESSION_TIMEOUT_KEY, expirationTime.toString());
  return expirationTime;
};

/**
 * Clear session data from localStorage
 */
export const clearSession = (): void => {
  localStorage.removeItem(USER_KEY);
  localStorage.removeItem(SESSION_TIMEOUT_KEY);
  localStorage.removeItem(TOKEN_KEY);
  localStorage.removeItem(TOKEN_TYPE_KEY);
};

export const setAuthToken = (token: string, type: 'bearer' | 'client' = 'bearer'): void => {
  localStorage.setItem(TOKEN_KEY, token);
  localStorage.setItem(TOKEN_TYPE_KEY, type);
};

export const getAuthToken = (): string | null => {
  return localStorage.getItem(TOKEN_KEY);
};

export const getAuthTokenType = (): 'bearer' | 'client' => {
  const t = localStorage.getItem(TOKEN_TYPE_KEY);
  return (t === 'client' ? 'client' : 'bearer');
};
