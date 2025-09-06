import { Controller, Get, HttpCode, HttpStatus, Query, Headers } from '@nestjs/common';
import { DashboardService } from './dashboard.service';

@Controller('api/v1/dashboard')
export class DashboardController {
  constructor(private readonly dashboardService: DashboardService) {}

  @Get('metrics')
  @HttpCode(HttpStatus.OK)
  async getMetrics(
    @Query('period') period?: 'month' | 'week' | 'day',
    @Headers('authorization') authorization?: string,
  ) {
    return this.dashboardService.getMetrics({ period: period ?? 'month' }, authorization);
  }
}


