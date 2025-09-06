import { useState, useEffect } from 'react';
import { salesAnalyticsApi, type SalesDashboardData, type MonthlySalesData, type CategorySalesData, type TopCustomer, type PerformanceMetrics } from '@/services/salesAnalyticsApi';
import { toast } from 'sonner';

export function useSalesAnalytics() {
  const [dashboardData, setDashboardData] = useState<SalesDashboardData | null>(null);
  const [monthlyData, setMonthlyData] = useState<MonthlySalesData | null>(null);
  const [categoryData, setCategoryData] = useState<CategorySalesData | null>(null);
  const [topCustomers, setTopCustomers] = useState<TopCustomer[]>([]);
  const [performanceMetrics, setPerformanceMetrics] = useState<PerformanceMetrics | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchAllData = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const [dashboard, monthly, category, customers, performance] = await Promise.all([
        salesAnalyticsApi.getDashboard(),
        salesAnalyticsApi.getMonthlySales(),
        salesAnalyticsApi.getCategorySales(),
        salesAnalyticsApi.getTopCustomers(10),
        salesAnalyticsApi.getPerformanceMetrics()
      ]);

      setDashboardData(dashboard);
      setMonthlyData(monthly);
      setCategoryData(category);
      setTopCustomers(customers.customers);
      setPerformanceMetrics(performance);
    } catch (err: any) {
      setError(err?.message || 'Error cargando datos de analytics');
      toast.error('Error cargando analytics', { description: err?.message });
    } finally {
      setLoading(false);
    }
  };

  const refreshData = () => {
    fetchAllData();
  };

  useEffect(() => {
    fetchAllData();
  }, []);

  return {
    dashboardData,
    monthlyData,
    categoryData,
    topCustomers,
    performanceMetrics,
    loading,
    error,
    refreshData
  };
}
