import { fetchJson } from "@/lib/api";

export interface DashboardMetrics {
  period: 'month' | 'week' | 'day';
  totalOrders: number;
  totalSales: number;
  pendingPayments: number;
  upcomingEvents: number;
  test?: boolean;
}

export async function getDashboardMetrics(period: 'month' | 'week' | 'day' = 'month') {
  return fetchJson<DashboardMetrics>(`/api/v1/dashboard/metrics?period=${period}`);
}


