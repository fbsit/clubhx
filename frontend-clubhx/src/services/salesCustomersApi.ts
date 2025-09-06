import { fetchJson } from '@/lib/api';

export interface SalesCustomer {
  id: string;
  name: string;
  contact: string;
  email: string;
  phone: string;
  rut: string;
  city: string;
  address: string;
  status: 'active' | 'prospect' | 'inactive';
  totalSales: number;
  lastOrder: string | null;
  assignedTo: string;
  collections: {
    pendingAmount: number;
    overdueAmount: number;
    overdueDocuments: string[];
  };
}

export interface CustomerOrders {
  orders: Array<{
    id: string;
    date: string;
    amount: number;
    status: string;
    items: number;
  }>;
  total: number;
}

export interface CustomerVisits {
  visits: Array<{
    id: string;
    date: string;
    type: string;
    status: string;
    notes: string;
  }>;
  total: number;
}

export interface CustomerWishlist {
  items: Array<{
    id: string;
    product: {
      id: string;
      name: string;
      sku: string;
      price: number;
    };
    addedAt: string;
  }>;
  total: number;
}

export interface CustomersListResponse {
  customers: SalesCustomer[];
  total: number;
  active: number;
  prospects: number;
  withCollections: number;
}

export const salesCustomersApi = {
  async listCustomers(filters?: { status?: string; search?: string }): Promise<CustomersListResponse> {
    const params = new URLSearchParams();
    if (filters?.status) params.append('status', filters.status);
    if (filters?.search) params.append('search', filters.search);
    
    const queryString = params.toString();
    const url = queryString ? `/api/v1/sales/customers?${queryString}` : '/api/v1/sales/customers';
    return fetchJson(url);
  },

  async getActiveCustomers(): Promise<{ customers: SalesCustomer[]; total: number }> {
    return fetchJson('/api/v1/sales/customers/active');
  },

  async getProspects(): Promise<{ customers: SalesCustomer[]; total: number }> {
    return fetchJson('/api/v1/sales/customers/prospects');
  },

  async getCollectionsCustomers(): Promise<{ customers: SalesCustomer[]; total: number }> {
    return fetchJson('/api/v1/sales/customers/collections');
  },

  async getCustomer(id: string): Promise<SalesCustomer> {
    return fetchJson(`/api/v1/sales/customers/${id}`);
  },

  async createCustomer(customerData: Partial<SalesCustomer>): Promise<SalesCustomer> {
    return fetchJson('/api/v1/sales/customers', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(customerData),
    });
  },

  async updateCustomer(id: string, customerData: Partial<SalesCustomer>): Promise<SalesCustomer> {
    return fetchJson(`/api/v1/sales/customers/${id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(customerData),
    });
  },

  async getCustomerOrders(id: string): Promise<CustomerOrders> {
    return fetchJson(`/api/v1/sales/customers/${id}/orders`);
  },

  async getCustomerVisits(id: string): Promise<CustomerVisits> {
    return fetchJson(`/api/v1/sales/customers/${id}/visits`);
  },

  async getCustomerWishlist(id: string): Promise<CustomerWishlist> {
    return fetchJson(`/api/v1/sales/customers/${id}/wishlist`);
  }
};
