
import { useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { User } from "@/types/auth";
import { USER_KEY, isSessionExpired, clearSession } from "@/utils/sessionUtils";

/**
 * Hook to initialize user from localStorage
 */
export const useUserInitialization = (
  setUser: (user: User | null) => void,
  setIsLoading: (isLoading: boolean) => void,
  setIsInitialized: (isInitialized: boolean) => void,
  setupSessionTimeout: () => void
) => {
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    const initializeUser = () => {
      try {
        const storedUser = localStorage.getItem(USER_KEY);
        
        if (storedUser && !isSessionExpired()) {
          try {
            const parsedUser = JSON.parse(storedUser);
            setUser(parsedUser);
            // Ejecutar una sola vez al inicio; evitar loops por cambios de identidad
            try { setupSessionTimeout(); } catch {}
          } catch (error) {
            console.error("Error parsing user from localStorage:", error);
            clearSession();
            setUser(null);
          }
        } else if (storedUser && isSessionExpired()) {
          clearSession();
          setUser(null);
          
          if (location.pathname !== "/login" && location.pathname !== "/") {
            toast.info("Su sesión ha expirado. Por favor, inicie sesión nuevamente.");
            navigate("/login");
          }
        }
      } catch (error) {
        console.error("Error initializing user:", error);
        clearSession();
        setUser(null);
      } finally {
        setIsLoading(false);
        setIsInitialized(true);
      }
    };
    
    // Initialize immediately to prevent render delays
    initializeUser();
    // Run only once on mount to avoid identity change loops
  }, []);
};
