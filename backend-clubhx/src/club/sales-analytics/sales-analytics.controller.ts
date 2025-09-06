import { Controller, Get, Query, Headers } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { SalesAnalyticsService } from './sales-analytics.service';

@ApiTags('Sales Analytics')
@ApiBearerAuth('Bearer')
@Controller('api/v1/sales/analytics')
export class SalesAnalyticsController {
  constructor(private readonly service: SalesAnalyticsService) {}

  @Get('dashboard')
  @ApiOperation({ summary: 'Obtener métricas del dashboard de ventas', description: 'Devuelve KPIs y métricas específicas del vendedor autenticado' })
  async getDashboard(@Headers('authorization') auth?: string) {
    console.log('Dashboard endpoint called with auth:', auth);
    const userId = this.getUserIdFromAuth(auth);
    console.log('Extracted userId:', userId);
    const result = await this.service.getDashboard(userId);
    console.log('Dashboard result:', result);
    return result;
  }

  @Get('monthly-sales')
  @ApiOperation({ summary: 'Obtener ventas mensuales', description: 'Devuelve ventas mensuales del vendedor con comparación de metas' })
  async getMonthlySales(@Query('year') year?: string, @Headers('authorization') auth?: string) {
    return this.service.getMonthlySales(this.getUserIdFromAuth(auth), year);
  }

  @Get('category-sales')
  @ApiOperation({ summary: 'Obtener ventas por categoría', description: 'Devuelve ventas desglosadas por categoría de producto' })
  async getCategorySales(@Query('period') period?: string, @Headers('authorization') auth?: string) {
    return this.service.getCategorySales(this.getUserIdFromAuth(auth), period);
  }

  @Get('top-customers')
  @ApiOperation({ summary: 'Obtener top clientes', description: 'Devuelve los mejores clientes del vendedor por volumen de ventas' })
  async getTopCustomers(@Query('limit') limit?: string, @Headers('authorization') auth?: string) {
    return this.service.getTopCustomers(this.getUserIdFromAuth(auth), parseInt(limit || '10'));
  }

  @Get('performance-metrics')
  @ApiOperation({ summary: 'Obtener métricas de rendimiento', description: 'Devuelve métricas de rendimiento personal del vendedor' })
  async getPerformanceMetrics(@Headers('authorization') auth?: string) {
    return this.service.getPerformanceMetrics(this.getUserIdFromAuth(auth));
  }

  @Get('test')
  @ApiOperation({ summary: 'Endpoint de prueba', description: 'Endpoint simple para verificar conectividad' })
  async test() {
    return { message: 'Sales analytics endpoint working!', timestamp: new Date().toISOString() };
  }

  private getUserIdFromAuth(auth?: string): string {
    // Extract user ID from JWT token
    // This is a simplified version - in production you'd decode the JWT
    if (!auth) return 'default-user';
    return auth.includes('sales@clubhx.com') ? 'sales-user-123' : 'default-user';
  }
}
