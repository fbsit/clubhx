import { Injectable } from '@nestjs/common';

@Injectable()
export class SalesAnalyticsService {
  
  async getDashboard(userId: string) {
    // Mock data for sales dashboard
    return {
      currentMonthSales: 5438250,
      monthlyGoal: 4500000,
      goalCompletion: 121,
      activeCustomers: 45,
      newCustomersThisMonth: 3,
      averageTicket: 120850,
      salesGrowth: 21,
      topCategories: [
        { name: 'Color', sales: 1800000, percentage: 33 },
        { name: 'Cuidado', sales: 1500000, percentage: 28 },
        { name: 'Styling', sales: 1200000, percentage: 22 },
        { name: 'Técnico', sales: 938250, percentage: 17 }
      ],
      recentActivity: [
        { type: 'sale', amount: 125000, customer: 'Salon Belleza Profesional', date: new Date().toISOString() },
        { type: 'visit', customer: 'Hair Style Studio', date: new Date(Date.now() - 86400000).toISOString() },
        { type: 'sale', amount: 89000, customer: 'Beauty Center', date: new Date(Date.now() - 172800000).toISOString() }
      ]
    };
  }

  async getMonthlySales(userId: string, year?: string) {
    const currentYear = year || new Date().getFullYear().toString();
    
    return {
      year: currentYear,
      monthlyData: [
        { month: 'Ene', sales: 3200000, goal: 3500000, customers: 32, growth: 8 },
        { month: 'Feb', sales: 3800000, goal: 3500000, customers: 38, growth: 19 },
        { month: 'Mar', sales: 4200000, goal: 4000000, customers: 42, growth: 11 },
        { month: 'Abr', sales: 3900000, goal: 4000000, customers: 39, growth: -7 },
        { month: 'May', sales: 5438250, goal: 4500000, customers: 45, growth: 39 },
        { month: 'Jun', sales: 0, goal: 4500000, customers: 0, growth: 0 },
        { month: 'Jul', sales: 0, goal: 4500000, customers: 0, growth: 0 },
        { month: 'Ago', sales: 0, goal: 4500000, customers: 0, growth: 0 },
        { month: 'Sep', sales: 0, goal: 4500000, customers: 0, growth: 0 },
        { month: 'Oct', sales: 0, goal: 4500000, customers: 0, growth: 0 },
        { month: 'Nov', sales: 0, goal: 4500000, customers: 0, growth: 0 },
        { month: 'Dic', sales: 0, goal: 4500000, customers: 0, growth: 0 }
      ],
      totalSales: 20538250,
      totalGoal: 48000000,
      averageGrowth: 14
    };
  }

  async getCategorySales(userId: string, period?: string) {
    return {
      period: period || 'current-month',
      categories: [
        { name: 'Color', sales: 1800000, percentage: 33, growth: 15, goal: 1500000 },
        { name: 'Cuidado', sales: 1500000, percentage: 28, growth: 22, goal: 1200000 },
        { name: 'Styling', sales: 1200000, percentage: 22, growth: 8, goal: 1000000 },
        { name: 'Técnico', sales: 938250, percentage: 17, growth: 35, goal: 800000 }
      ],
      totalSales: 5438250,
      totalGoal: 4500000
    };
  }

  async getTopCustomers(userId: string, limit: number = 10) {
    return {
      customers: [
        {
          id: '1',
          name: 'Salon Belleza Profesional',
          sales: 680000,
          orders: 8,
          growth: 15,
          lastOrder: new Date(Date.now() - 86400000).toISOString(),
          status: 'active'
        },
        {
          id: '2',
          name: 'Hair Style Studio',
          sales: 520000,
          orders: 6,
          growth: 22,
          lastOrder: new Date(Date.now() - 172800000).toISOString(),
          status: 'active'
        },
        {
          id: '3',
          name: 'Beauty Center',
          sales: 450000,
          orders: 7,
          growth: -5,
          lastOrder: new Date(Date.now() - 259200000).toISOString(),
          status: 'active'
        },
        {
          id: '4',
          name: 'Estética Moderna',
          sales: 380000,
          orders: 5,
          growth: 8,
          lastOrder: new Date(Date.now() - 345600000).toISOString(),
          status: 'active'
        },
        {
          id: '5',
          name: 'Arte y Belleza Spa',
          sales: 320000,
          orders: 4,
          growth: 12,
          lastOrder: new Date(Date.now() - 432000000).toISOString(),
          status: 'active'
        }
      ].slice(0, limit)
    };
  }

  async getPerformanceMetrics(userId: string) {
    return {
      currentPeriod: {
        sales: 5438250,
        goal: 4500000,
        completion: 121,
        customers: 45,
        visits: 28,
        conversionRate: 85,
        averageTicket: 120850
      },
      previousPeriod: {
        sales: 3900000,
        goal: 4000000,
        completion: 98,
        customers: 39,
        visits: 25,
        conversionRate: 78,
        averageTicket: 100000
      },
      trends: {
        salesGrowth: 39,
        customerGrowth: 15,
        visitGrowth: 12,
        conversionGrowth: 9,
        ticketGrowth: 21
      },
      achievements: [
        { type: 'sales_goal', achieved: true, value: 'Meta superada en 21%' },
        { type: 'new_customers', achieved: true, value: '3 nuevos clientes' },
        { type: 'conversion_rate', achieved: true, value: '85% de conversión' }
      ]
    };
  }
}
