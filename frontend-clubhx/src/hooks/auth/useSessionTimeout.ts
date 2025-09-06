
import { useCallback, useRef, useEffect } from "react";
import { toast } from "sonner";
import { 
  SESSION_TIMEOUT_KEY, 
  isSessionExpired, 
  setSessionTimeout, 
  clearSession 
} from "@/utils/sessionUtils";
import { handleError } from "@/utils/errorUtils";

/**
 * Hook to manage session timeout functionality with improved stability
 */
export const useSessionTimeout = (user: any, logout: () => void) => {
  const timeoutIdRef = useRef<number | null>(null);
  const activityTimeoutRef = useRef<number | null>(null);
  const warningTimeoutRef = useRef<number | null>(null);
  const sessionWarningShown = useRef(false);
  
  // Set session timeout and clear previous timeout if any
  const setupSessionTimeout = useCallback(() => {
    try {
      // Clear existing timeouts
      if (timeoutIdRef.current !== null) {
        window.clearTimeout(timeoutIdRef.current);
      }
      
      if (warningTimeoutRef.current !== null) {
        window.clearTimeout(warningTimeoutRef.current);
      }
      
      // Reset warning flag
      sessionWarningShown.current = false;
      
      // Get expiration time
      const expirationTime = setSessionTimeout();
      const currentTime = Date.now();
      const timeUntilExpiration = expirationTime - currentTime;
      
      // Set warning timeout (5 minutes before expiration)
      const warningTime = Math.max(timeUntilExpiration - 5 * 60 * 1000, 0);
      
      warningTimeoutRef.current = window.setTimeout(() => {
        if (!sessionWarningShown.current && user) {
          toast.warning("Su sesión expirará pronto", {
            description: "Por favor continúe navegando para mantener su sesión activa",
            duration: 10000,
          });
          sessionWarningShown.current = true;
        }
      }, warningTime);

      // Set timeout for session expiration check
      timeoutIdRef.current = window.setTimeout(() => {
        if (isSessionExpired()) {
          logout();
        }
      }, timeUntilExpiration);
      
      return expirationTime;
    } catch (error) {
      handleError(error, "setupSessionTimeout");
      // Fallback: force refresh session in case of error
      return setSessionTimeout();
    }
  }, [logout, user]);

  // Refresh session on activity - ensures it returns a Promise
  const refreshSession = useCallback((): Promise<void> => {
    return new Promise<void>((resolve) => {
      if (user) {
        try {
          // Debounce activity tracking
          if (activityTimeoutRef.current !== null) {
            window.clearTimeout(activityTimeoutRef.current);
          }
          
          activityTimeoutRef.current = window.setTimeout(() => {
            setupSessionTimeout();
            resolve();
          }, 1000); // Wait 1 second before refreshing the session
        } catch (error) {
          // Silent recovery
          handleError(error, "refreshSession");
          setSessionTimeout(); // Force session refresh
          resolve();
        }
      } else {
        resolve(); // Resolve immediately if no user
      }
    });
  }, [user, setupSessionTimeout]);

  // Clean up timeouts
  const cleanupTimeouts = useCallback(() => {
    if (timeoutIdRef.current !== null) {
      window.clearTimeout(timeoutIdRef.current);
      timeoutIdRef.current = null;
    }
    
    if (activityTimeoutRef.current !== null) {
      window.clearTimeout(activityTimeoutRef.current);
      activityTimeoutRef.current = null;
    }
    
    if (warningTimeoutRef.current !== null) {
      window.clearTimeout(warningTimeoutRef.current);
      warningTimeoutRef.current = null;
    }
  }, []);

  // Clean up on unmount
  useEffect(() => {
    return cleanupTimeouts;
  }, [cleanupTimeouts]);

  return {
    setupSessionTimeout,
    refreshSession,
    cleanupTimeouts,
    timeoutIdRef,
    activityTimeoutRef
  };
};
