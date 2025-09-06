import { Module } from '@nestjs/common';
import { ClubSharedModule } from '../shared/club-shared.module';
import { DashboardController } from './dashboard.controller';
import { DashboardService } from './dashboard.service';
import { EventsModule } from '../events/events.module';

@Module({
  imports: [ClubSharedModule, EventsModule],
  controllers: [DashboardController],
  providers: [DashboardService],
})
export class DashboardModule {}


