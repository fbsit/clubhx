
import { useState } from "react";
import { User } from "@/types/auth";

/**
 * Hook to manage authentication state
 */
export const useAuthState = () => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isInitialized, setIsInitialized] = useState(false);

  return {
    user,
    setUser,
    isLoading,
    setIsLoading,
    isInitialized,
    setIsInitialized
  };
};
