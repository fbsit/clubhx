import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { ClubApiService } from '../shared/club-api.service';

interface MetricsQuery {
  period: 'month' | 'week' | 'day';
}

@Injectable()
export class DashboardService {
  constructor(private readonly api: ClubApiService) {}

  async getMetrics({ period }: MetricsQuery, authorization?: string) {
    try {
      const authHeader = authorization
        ? authorization.startsWith('Bearer ')
          ? `Token ${authorization.slice(7)}`
          : authorization
        : undefined;

      // Intentar obtener pedidos reales para métricas básicas
      const ordersResp = await this.api.request<any>('get', '/api/v1/order/', {
        headers: authHeader ? { Authorization: authHeader } : undefined,
        useAuthHeader: authHeader ? false : undefined,
        query: { limit: 20, offset: 0 },
      });

      const orders = (ordersResp.data?.results ?? []) as any[];
      const totalOrders = orders.length;
      const totalSales = orders.reduce((acc, o) => acc + (o.total ?? 0), 0);
      const pendingPayments = orders.filter(o => ['payment_pending', 'invoiced'].includes(o.status)).length;

      return {
        period,
        totalOrders,
        totalSales,
        pendingPayments,
        upcomingEvents: 0,
      };
    } catch {
      // Datos de prueba si no hay permisos/entidades
      return {
        period,
        totalOrders: 0,
        totalSales: 0,
        pendingPayments: 0,
        upcomingEvents: 0,
        test: true,
      };
    }
  }
}


