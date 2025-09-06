import { Module } from '@nestjs/common';
import { SalesAnalyticsController } from './sales-analytics.controller';
import { SalesAnalyticsService } from './sales-analytics.service';

@Module({
  controllers: [SalesAnalyticsController],
  providers: [SalesAnalyticsService],
  exports: [SalesAnalyticsService],
})
export class SalesAnalyticsModule {}
