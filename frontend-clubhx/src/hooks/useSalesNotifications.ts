import { useEffect } from 'react';
import { useNotifications } from '@/contexts/NotificationContext';
const mockSalesVisits: any[] = [];
const mockOrders: any[] = [];

export const useSalesNotifications = () => {
  const { updateNotification, clearNotification } = useNotifications();

  useEffect(() => {
    // Visitas pendientes para hoy/mañana
    const today = new Date();
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);

    const upcomingVisits = mockSalesVisits.filter(visit => {
      const visitDate = new Date(visit.date);
      return visitDate >= today && visitDate <= tomorrow && visit.status === 'confirmed';
    }).length;

    if (upcomingVisits > 0) {
      updateNotification('/main/sales/calendar', {
        count: upcomingVisits,
        type: 'warning',
        route: '/main/sales/calendar',
      });
    }

    // Pedidos de mis clientes pendientes
    const myPendingOrders = mockOrders.filter(order => 
      ['pending', 'processing'].includes(order.status)
    ).length;

    if (myPendingOrders > 0) {
      updateNotification('/main/orders', {
        count: myPendingOrders,
        type: 'info',
        route: '/main/orders',
      });
    }

    // Clientes con wishlist actualizada (simulado)
    const clientsWithUpdatedWishlist = 3; // Simulado
    if (clientsWithUpdatedWishlist > 0) {
      updateNotification('/main/sales/wishlists', {
        count: clientsWithUpdatedWishlist,
        type: 'info',
        route: '/main/sales/wishlists',
      });
    }

  }, [updateNotification]);

  return { clearNotification };
};