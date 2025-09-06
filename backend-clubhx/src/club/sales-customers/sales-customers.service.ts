import { Injectable } from '@nestjs/common';

@Injectable()
export class SalesCustomersService {
  
  private mockCustomers = [
    {
      id: '1',
      name: 'Salon Belleza Profesional',
      contact: 'María González',
      email: 'maria@salonbelleza.cl',
      phone: '+56 9 1234 5678',
      rut: '12.345.678-9',
      city: 'Santiago',
      address: 'Av. Providencia 1234',
      status: 'active',
      totalSales: 680000,
      lastOrder: new Date(Date.now() - 86400000).toISOString(),
      assignedTo: 'sales-user-123',
      collections: {
        pendingAmount: 0,
        overdueAmount: 0,
        overdueDocuments: []
      }
    },
    {
      id: '2',
      name: 'Hair Style Studio',
      contact: 'Carlos Rodríguez',
      email: 'carlos@hairstyle.cl',
      phone: '+56 9 2345 6789',
      rut: '23.456.789-0',
      city: 'Valparaíso',
      address: 'Calle Prat 567',
      status: 'active',
      totalSales: 520000,
      lastOrder: new Date(Date.now() - 172800000).toISOString(),
      assignedTo: 'sales-user-123',
      collections: {
        pendingAmount: 45000,
        overdueAmount: 0,
        overdueDocuments: ['Factura #1234']
      }
    },
    {
      id: '3',
      name: 'Beauty Center',
      contact: 'Ana Silva',
      email: 'ana@beautycenter.cl',
      phone: '+56 9 3456 7890',
      rut: '34.567.890-1',
      city: 'Concepción',
      address: 'Av. O\'Higgins 890',
      status: 'active',
      totalSales: 450000,
      lastOrder: new Date(Date.now() - 259200000).toISOString(),
      assignedTo: 'sales-user-123',
      collections: {
        pendingAmount: 0,
        overdueAmount: 0,
        overdueDocuments: []
      }
    },
    {
      id: '4',
      name: 'Estética Moderna',
      contact: 'Roberto Pérez',
      email: 'roberto@esteticamoderna.cl',
      phone: '+56 9 4567 8901',
      rut: '45.678.901-2',
      city: 'La Serena',
      address: 'Calle Balmaceda 234',
      status: 'active',
      totalSales: 380000,
      lastOrder: new Date(Date.now() - 345600000).toISOString(),
      assignedTo: 'sales-user-123',
      collections: {
        pendingAmount: 0,
        overdueAmount: 0,
        overdueDocuments: []
      }
    },
    {
      id: '5',
      name: 'Arte y Belleza Spa',
      contact: 'Patricia López',
      email: 'patricia@arteybelleza.cl',
      phone: '+56 9 5678 9012',
      rut: '56.789.012-3',
      city: 'Antofagasta',
      address: 'Av. Argentina 456',
      status: 'active',
      totalSales: 320000,
      lastOrder: new Date(Date.now() - 432000000).toISOString(),
      assignedTo: 'sales-user-123',
      collections: {
        pendingAmount: 0,
        overdueAmount: 0,
        overdueDocuments: []
      }
    },
    {
      id: '6',
      name: 'Nuevo Cliente Potencial',
      contact: 'Fernando Morales',
      email: 'fernando@nuevocliente.cl',
      phone: '+56 9 6789 0123',
      rut: '67.890.123-4',
      city: 'Viña del Mar',
      address: 'Av. Libertad 789',
      status: 'prospect',
      totalSales: 0,
      lastOrder: null,
      assignedTo: 'sales-user-123',
      collections: {
        pendingAmount: 0,
        overdueAmount: 0,
        overdueDocuments: []
      }
    }
  ];

  async listCustomers(userId: string, filters?: { status?: string; search?: string }) {
    let customers = this.mockCustomers.filter(c => c.assignedTo === userId);

    if (filters?.status) {
      customers = customers.filter(c => c.status === filters.status);
    }

    if (filters?.search) {
      const searchLower = filters.search.toLowerCase();
      customers = customers.filter(c => 
        c.name.toLowerCase().includes(searchLower) ||
        c.contact.toLowerCase().includes(searchLower) ||
        c.email.toLowerCase().includes(searchLower) ||
        c.city.toLowerCase().includes(searchLower) ||
        c.rut.toLowerCase().includes(searchLower)
      );
    }

    return {
      customers,
      total: customers.length,
      active: customers.filter(c => c.status === 'active').length,
      prospects: customers.filter(c => c.status === 'prospect').length,
      withCollections: customers.filter(c => c.collections.pendingAmount > 0 || c.collections.overdueAmount > 0).length
    };
  }

  async getActiveCustomers(userId: string) {
    const customers = this.mockCustomers.filter(c => 
      c.assignedTo === userId && c.status === 'active'
    );
    return { customers, total: customers.length };
  }

  async getProspects(userId: string) {
    const customers = this.mockCustomers.filter(c => 
      c.assignedTo === userId && c.status === 'prospect'
    );
    return { customers, total: customers.length };
  }

  async getCollectionsCustomers(userId: string) {
    const customers = this.mockCustomers.filter(c => 
      c.assignedTo === userId && 
      (c.collections.pendingAmount > 0 || c.collections.overdueAmount > 0)
    );
    return { customers, total: customers.length };
  }

  async getCustomer(userId: string, customerId: string) {
    const customer = this.mockCustomers.find(c => 
      c.assignedTo === userId && c.id === customerId
    );
    
    if (!customer) {
      throw new Error('Cliente no encontrado');
    }

    return customer;
  }

  async createCustomer(userId: string, customerData: any) {
    const newCustomer = {
      id: Date.now().toString(),
      ...customerData,
      assignedTo: userId,
      status: 'prospect',
      totalSales: 0,
      lastOrder: null,
      collections: {
        pendingAmount: 0,
        overdueAmount: 0,
        overdueDocuments: []
      }
    };

    this.mockCustomers.push(newCustomer);
    return newCustomer;
  }

  async updateCustomer(userId: string, customerId: string, customerData: any) {
    const index = this.mockCustomers.findIndex(c => 
      c.assignedTo === userId && c.id === customerId
    );

    if (index === -1) {
      throw new Error('Cliente no encontrado');
    }

    this.mockCustomers[index] = { ...this.mockCustomers[index], ...customerData };
    return this.mockCustomers[index];
  }

  async getCustomerOrders(userId: string, customerId: string) {
    // Mock orders for the customer
    return {
      orders: [
        {
          id: '1',
          date: new Date(Date.now() - 86400000).toISOString(),
          amount: 125000,
          status: 'completed',
          items: 3
        },
        {
          id: '2',
          date: new Date(Date.now() - 172800000).toISOString(),
          amount: 89000,
          status: 'completed',
          items: 2
        }
      ],
      total: 2
    };
  }

  async getCustomerVisits(userId: string, customerId: string) {
    // Mock visits for the customer
    return {
      visits: [
        {
          id: '1',
          date: new Date(Date.now() - 86400000).toISOString(),
          type: 'presentation',
          status: 'completed',
          notes: 'Presentación de nuevos productos'
        },
        {
          id: '2',
          date: new Date(Date.now() - 172800000).toISOString(),
          type: 'follow-up',
          status: 'completed',
          notes: 'Seguimiento de pedido anterior'
        }
      ],
      total: 2
    };
  }

  async getCustomerWishlist(userId: string, customerId: string) {
    // Mock wishlist for the customer
    return {
      items: [
        {
          id: '1',
          product: {
            id: '1',
            name: 'Laptop HP Pavilion',
            sku: 'LAP-001',
            price: 899.99
          },
          addedAt: new Date(Date.now() - 86400000).toISOString()
        },
        {
          id: '2',
          product: {
            id: '2',
            name: 'Mouse Inalámbrico Logitech',
            sku: 'MOU-002',
            price: 19.99
          },
          addedAt: new Date(Date.now() - 172800000).toISOString()
        }
      ],
      total: 2
    };
  }
}
