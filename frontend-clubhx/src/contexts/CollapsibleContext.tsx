
import React, { createContext, Dispatch, SetStateAction, useContext, useState, useEffect } from 'react';
import { CollapsibleState } from '@/components/dashboard/dashboardTypes';

type CollapsibleContextType = {
  sidebarState: CollapsibleState;
  setSidebarState: Dispatch<SetStateAction<CollapsibleState>>;
  toggleSidebar: () => void;
};

const SIDEBAR_STATE_KEY = 'club-hx-sidebar-state';

export const CollapsibleContext = createContext<CollapsibleContextType>({
  sidebarState: "expanded",
  setSidebarState: () => {},
  toggleSidebar: () => {},
});

export const CollapsibleProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // Initialize from localStorage if available, otherwise default to expanded
  const [sidebarState, setSidebarState] = useState<CollapsibleState>(() => {
    if (typeof window !== 'undefined') {
      const savedState = localStorage.getItem(SIDEBAR_STATE_KEY);
      // Ensure we only use valid states
      return (savedState === 'expanded' || savedState === 'collapsed') 
        ? (savedState as CollapsibleState) 
        : 'expanded';
    }
    return 'expanded';
  });

  // Simple toggle function that immediately switches between expanded and collapsed
  const toggleSidebar = () => {
    setSidebarState(prevState => prevState === 'expanded' ? 'collapsed' : 'expanded');
  };

  // Save sidebar state to localStorage whenever it changes
  useEffect(() => {
    localStorage.setItem(SIDEBAR_STATE_KEY, sidebarState);
  }, [sidebarState]);

  // Add keyboard shortcut (Ctrl+B) to toggle sidebar
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Check for Ctrl+B or Cmd+B
      if ((e.ctrlKey || e.metaKey) && e.key === 'b') {
        e.preventDefault(); // Prevent default browser behavior
        toggleSidebar();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, []);

  return (
    <CollapsibleContext.Provider value={{ sidebarState, setSidebarState, toggleSidebar }}>
      {children}
    </CollapsibleContext.Provider>
  );
};

export const useCollapsible = () => useContext(CollapsibleContext);
