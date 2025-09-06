import { useState, useEffect } from 'react';
import { salesCustomersApi, type SalesCustomer, type CustomerOrders, type CustomerVisits, type CustomerWishlist } from '@/services/salesCustomersApi';
import { toast } from 'sonner';

export function useSalesCustomers() {
  const [customers, setCustomers] = useState<SalesCustomer[]>([]);
  const [stats, setStats] = useState({
    total: 0,
    active: 0,
    prospects: 0,
    withCollections: 0
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchCustomers = async (filters?: { status?: string; search?: string }) => {
    try {
      setLoading(true);
      setError(null);
      
      const response = await salesCustomersApi.listCustomers(filters);
      setCustomers(response.customers);
      setStats({
        total: response.total,
        active: response.active,
        prospects: response.prospects,
        withCollections: response.withCollections
      });
    } catch (err: any) {
      setError(err?.message || 'Error cargando clientes');
      toast.error('Error cargando clientes', { description: err?.message });
    } finally {
      setLoading(false);
    }
  };

  const getCustomer = async (id: string): Promise<SalesCustomer | null> => {
    try {
      return await salesCustomersApi.getCustomer(id);
    } catch (err: any) {
      toast.error('Error cargando cliente', { description: err?.message });
      return null;
    }
  };

  const createCustomer = async (customerData: Partial<SalesCustomer>): Promise<SalesCustomer | null> => {
    try {
      const newCustomer = await salesCustomersApi.createCustomer(customerData);
      toast.success('Cliente creado exitosamente');
      // Refresh the list
      await fetchCustomers();
      return newCustomer;
    } catch (err: any) {
      toast.error('Error creando cliente', { description: err?.message });
      return null;
    }
  };

  const updateCustomer = async (id: string, customerData: Partial<SalesCustomer>): Promise<SalesCustomer | null> => {
    try {
      const updatedCustomer = await salesCustomersApi.updateCustomer(id, customerData);
      toast.success('Cliente actualizado exitosamente');
      // Refresh the list
      await fetchCustomers();
      return updatedCustomer;
    } catch (err: any) {
      toast.error('Error actualizando cliente', { description: err?.message });
      return null;
    }
  };

  const getCustomerOrders = async (id: string): Promise<CustomerOrders | null> => {
    try {
      return await salesCustomersApi.getCustomerOrders(id);
    } catch (err: any) {
      toast.error('Error cargando pedidos', { description: err?.message });
      return null;
    }
  };

  const getCustomerVisits = async (id: string): Promise<CustomerVisits | null> => {
    try {
      return await salesCustomersApi.getCustomerVisits(id);
    } catch (err: any) {
      toast.error('Error cargando visitas', { description: err?.message });
      return null;
    }
  };

  const getCustomerWishlist = async (id: string): Promise<CustomerWishlist | null> => {
    try {
      return await salesCustomersApi.getCustomerWishlist(id);
    } catch (err: any) {
      toast.error('Error cargando wishlist', { description: err?.message });
      return null;
    }
  };

  const refreshData = (filters?: { status?: string; search?: string }) => {
    fetchCustomers(filters);
  };

  useEffect(() => {
    fetchCustomers();
  }, []);

  return {
    customers,
    stats,
    loading,
    error,
    fetchCustomers,
    getCustomer,
    createCustomer,
    updateCustomer,
    getCustomerOrders,
    getCustomerVisits,
    getCustomerWishlist,
    refreshData
  };
}
