
import { useEffect } from "react";

/**
 * Hook to track user activity and refresh session
 */
export const useActivityTracking = (
  isAuthenticated: boolean, 
  refreshSession: () => Promise<void>, // Updated to Promise<void>
  handleStorageChange: (e: StorageEvent) => void
) => {
  useEffect(() => {
    if (!isAuthenticated) return;
    
    // Set up activity tracking
    const events = ['mousedown', 'keydown', 'scroll', 'touchstart', 'mousemove'];
    
    const handleUserActivity = () => {
      refreshSession().catch(error => {
        console.error("Failed to refresh session:", error);
      });
    };
    
    events.forEach((event) => {
      window.addEventListener(event, handleUserActivity);
    });
    
    // Listen for storage events to sync between tabs
    window.addEventListener('storage', handleStorageChange);
    
    // Listen for visibility changes to refresh session
    const handleVisibilityChange = () => {
      if (document.visibilityState === 'visible' && isAuthenticated) {
        refreshSession().catch(error => {
          console.error("Failed to refresh session:", error);
        });
      }
    };
    
    document.addEventListener('visibilitychange', handleVisibilityChange);
    
    return () => {
      // Clean up event listeners
      events.forEach((event) => {
        window.removeEventListener(event, handleUserActivity);
      });
      window.removeEventListener('storage', handleStorageChange);
      document.removeEventListener('visibilitychange', handleVisibilityChange);
    };
  }, [isAuthenticated, refreshSession, handleStorageChange]);
};
