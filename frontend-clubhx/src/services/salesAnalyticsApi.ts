import { fetchJson } from '@/lib/api';

export interface SalesDashboardData {
  currentMonthSales: number;
  monthlyGoal: number;
  goalCompletion: number;
  activeCustomers: number;
  newCustomersThisMonth: number;
  averageTicket: number;
  salesGrowth: number;
  topCategories: Array<{
    name: string;
    sales: number;
    percentage: number;
  }>;
  recentActivity: Array<{
    type: string;
    amount?: number;
    customer: string;
    date: string;
  }>;
}

export interface MonthlySalesData {
  year: string;
  monthlyData: Array<{
    month: string;
    sales: number;
    goal: number;
    customers: number;
    growth: number;
  }>;
  totalSales: number;
  totalGoal: number;
  averageGrowth: number;
}

export interface CategorySalesData {
  period: string;
  categories: Array<{
    name: string;
    sales: number;
    percentage: number;
    growth: number;
    goal: number;
  }>;
  totalSales: number;
  totalGoal: number;
}

export interface TopCustomer {
  id: string;
  name: string;
  sales: number;
  orders: number;
  growth: number;
  lastOrder: string;
  status: string;
}

export interface PerformanceMetrics {
  currentPeriod: {
    sales: number;
    goal: number;
    completion: number;
    customers: number;
    visits: number;
    conversionRate: number;
    averageTicket: number;
  };
  previousPeriod: {
    sales: number;
    goal: number;
    completion: number;
    customers: number;
    visits: number;
    conversionRate: number;
    averageTicket: number;
  };
  trends: {
    salesGrowth: number;
    customerGrowth: number;
    visitGrowth: number;
    conversionGrowth: number;
    ticketGrowth: number;
  };
  achievements: Array<{
    type: string;
    achieved: boolean;
    value: string;
  }>;
}

export const salesAnalyticsApi = {
  async test(): Promise<any> {
    console.log('Testing sales analytics API connectivity...');
    try {
      const result = await fetchJson('/api/v1/sales/analytics/test');
      console.log('Test API result:', result);
      return result;
    } catch (error) {
      console.error('Error testing API:', error);
      throw error;
    }
  },

  async getDashboard(): Promise<SalesDashboardData> {
    console.log('Calling sales analytics dashboard API...');
    try {
      const result = await fetchJson('/api/v1/sales/analytics/dashboard');
      console.log('Dashboard API result:', result);
      return result;
    } catch (error) {
      console.error('Error calling dashboard API:', error);
      throw error;
    }
  },

  async getMonthlySales(year?: string): Promise<MonthlySalesData> {
    const params = year ? `?year=${year}` : '';
    return fetchJson(`/api/v1/sales/analytics/monthly-sales${params}`);
  },

  async getCategorySales(period?: string): Promise<CategorySalesData> {
    const params = period ? `?period=${period}` : '';
    return fetchJson(`/api/v1/sales/analytics/category-sales${params}`);
  },

  async getTopCustomers(limit?: number): Promise<{ customers: TopCustomer[] }> {
    const params = limit ? `?limit=${limit}` : '';
    return fetchJson(`/api/v1/sales/analytics/top-customers${params}`);
  },

  async getPerformanceMetrics(): Promise<PerformanceMetrics> {
    return fetchJson('/api/v1/sales/analytics/performance-metrics');
  }
};
