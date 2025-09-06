
import { useCallback, useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import { User } from "@/types/auth";
import { USER_KEY } from "@/utils/sessionUtils";
import { useAuthState } from "./auth/useAuthState";
import { useSessionTimeout } from "./auth/useSessionTimeout";
import { useAuthMethods } from "./auth/useAuthMethods";
import { useUserInitialization } from "./auth/useUserInitialization";
import { useActivityTracking } from "./auth/useActivityTracking";

export const useAuthProvider = () => {
  const location = useLocation();
  
  // Authentication state
  const {
    user,
    setUser,
    isLoading,
    setIsLoading,
    isInitialized,
    setIsInitialized
  } = useAuthState();

  // Handle storage changes for cross-tab synchronization
  const handleStorageChange = useCallback((e: StorageEvent) => {
    if (e.key === USER_KEY && e.newValue === null) {
      setUser(null);
    } else if (e.key === USER_KEY && e.newValue) {
      try {
        const parsedUser = JSON.parse(e.newValue);
        setUser(parsedUser);
      } catch (error) {
        console.error("Error parsing user from localStorage:", error);
      }
    }
  }, [setUser]);

  // State for error handling
  const [error, setError] = useState<string | null>(null);
  const clearError = useCallback(() => setError(null), []);

  // Session timeout management
  const { 
    setupSessionTimeout, 
    refreshSession, 
    cleanupTimeouts 
  } = useSessionTimeout(
    user,
    () => {
      if (location.pathname !== "/login" && location.pathname !== "/") {
        setUser(null);
      }
    }
  );

  // Authentication methods
  const { 
    login, 
    logout, 
    updateUserProfile, 
    register, 
    registerClient, 
    verifyEmail, 
    sendPasswordReset, 
    resetPassword 
  } = useAuthMethods(
    setUser,
    setIsLoading,
    setupSessionTimeout,
    cleanupTimeouts,
    { current: 0 }
  );

  // Initialize user from localStorage
  useUserInitialization(
    setUser,
    setIsLoading,
    setIsInitialized,
    setupSessionTimeout
  );

  // Track user activity
  useActivityTracking(
    !!user,
    refreshSession,
    handleStorageChange
  );

  const authValue = {
    user,
    isAuthenticated: !!user,
    isLoading,
    isInitialized,
    login,
    logout,
    register,
    registerClient,
    verifyEmail,
    sendPasswordReset,
    resetPassword,
    updateUserProfile,
    refreshSession,
    error,
    clearError
  };

  return authValue;
};
