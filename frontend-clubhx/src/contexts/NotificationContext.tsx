import React, { createContext, useContext, useState, useEffect } from 'react';

export interface NotificationBadge {
  id: string;
  count: number;
  type: 'info' | 'warning' | 'urgent';
  route: string;
  timestamp: Date;
}

interface NotificationState {
  [route: string]: NotificationBadge;
}

interface NotificationContextType {
  notifications: NotificationState;
  updateNotification: (route: string, badge: Omit<NotificationBadge, 'id' | 'timestamp'>) => void;
  clearNotification: (route: string) => void;
  getNotificationForRoute: (route: string) => NotificationBadge | null;
}

const NotificationContext = createContext<NotificationContextType | undefined>(undefined);

export const useNotifications = () => {
  const context = useContext(NotificationContext);
  if (!context) {
    throw new Error('useNotifications must be used within a NotificationProvider');
  }
  return context;
};

export const NotificationProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [notifications, setNotifications] = useState<NotificationState>({});

  const updateNotification = (route: string, badge: Omit<NotificationBadge, 'id' | 'timestamp'>) => {
    setNotifications(prev => ({
      ...prev,
      [route]: {
        ...badge,
        id: `${route}-${Date.now()}`,
        timestamp: new Date(),
      }
    }));
  };

  const clearNotification = (route: string) => {
    setNotifications(prev => {
      const { [route]: _, ...rest } = prev;
      return rest;
    });
  };

  const getNotificationForRoute = (route: string): NotificationBadge | null => {
    return notifications[route] || null;
  };

  return (
    <NotificationContext.Provider value={{
      notifications,
      updateNotification,
      clearNotification,
      getNotificationForRoute,
    }}>
      {children}
    </NotificationContext.Provider>
  );
};