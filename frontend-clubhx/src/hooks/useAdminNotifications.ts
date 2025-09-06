import { useEffect } from 'react';
import { useNotifications } from '@/contexts/NotificationContext';
const mockRegistrationRequests: any[] = [];
const mockCreditRequests: any[] = [];
const mockOrders: any[] = [];
const mockWishlistAnalyticsData: any = { lowStockHighDemand: [] };

export const useAdminNotifications = () => {
  const { updateNotification, clearNotification } = useNotifications();

  useEffect(() => {
    // Solicitudes de registro pendientes
    const pendingRegistrations = mockRegistrationRequests.filter(req => req.status === 'pending').length;
    if (pendingRegistrations > 0) {
      updateNotification('/main/admin/registration-requests', {
        count: pendingRegistrations,
        type: 'warning',
        route: '/main/admin/registration-requests',
      });
    }

    // Solicitudes de crédito pendientes  
    const pendingCreditRequests = mockCreditRequests.filter(req => req.status === 'pending').length;
    if (pendingCreditRequests > 0) {
      updateNotification('/main/admin/credit-requests', {
        count: pendingCreditRequests,
        type: 'urgent',
        route: '/main/admin/credit-requests',
      });
    }

    // Pedidos pendientes de aprobación
    const pendingOrders = mockOrders.filter(order => ['pending', 'quotation'].includes(order.status)).length;
    if (pendingOrders > 0) {
      updateNotification('/main/orders', {
        count: pendingOrders,
        type: 'warning', 
        route: '/main/orders',
      });
    }

    // Productos críticos (baja disponibilidad, alta demanda)
    const criticalProducts = mockWishlistAnalyticsData.lowStockHighDemand.length;
    if (criticalProducts > 0) {
      updateNotification('/main/admin/wishlist-analytics', {
        count: criticalProducts,
        type: 'urgent',
        route: '/main/admin/wishlist-analytics',
      });
    }

  }, [updateNotification]);

  return { clearNotification };
};