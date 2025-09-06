import { useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useAdminNotifications } from '@/hooks/useAdminNotifications';
import { useSalesNotifications } from '@/hooks/useSalesNotifications';
import { useClientNotifications } from '@/hooks/useClientNotifications';

export const NotificationInitializer = () => {
  const { user } = useAuth();
  
  // Initialize notifications based on user role
  useAdminNotifications();
  useSalesNotifications();
  useClientNotifications();

  return null; // This component doesn't render anything
};