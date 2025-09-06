import { useEffect } from 'react';
import { useNotifications } from '@/contexts/NotificationContext';
const mockOrders: any[] = [];
const mockEvents: any[] = [];

export const useClientNotifications = () => {
  const { updateNotification, clearNotification } = useNotifications();

  useEffect(() => {
    // Pedidos en proceso
    const ordersInProgress = mockOrders.filter(order => 
      ['processing', 'shipped'].includes(order.status)
    ).length;

    if (ordersInProgress > 0) {
      updateNotification('/main/orders', {
        count: ordersInProgress,
        type: 'info',
        route: '/main/orders',
      });
    }

    // Eventos disponibles para inscribirse
    const availableEvents = mockEvents.filter(event => {
      const eventDate = new Date(event.date);
      const today = new Date();
      return eventDate > today; // Events don't have status property consistently
    }).length;

    if (availableEvents > 0) {
      updateNotification('/main/events', {
        count: availableEvents,
        type: 'info',
        route: '/main/events',
      });
    }

    // Productos deseados disponibles (simulado)
    const wishlistItemsAvailable = 2; // Simulado
    if (wishlistItemsAvailable > 0) {
      updateNotification('/main/wishlist', {
        count: wishlistItemsAvailable,
        type: 'info',
        route: '/main/wishlist',
      });
    }

    // Puntos de lealtad pendientes (simulado)
    const pendingLoyaltyPoints = 1; // Simulado  
    if (pendingLoyaltyPoints > 0) {
      updateNotification('/main/loyalty', {
        count: pendingLoyaltyPoints,
        type: 'info',
        route: '/main/loyalty',
      });
    }

  }, [updateNotification]);

  return { clearNotification };
};