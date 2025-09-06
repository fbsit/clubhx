import { Module } from '@nestjs/common';
import { SalesEventsController } from './sales-events.controller';
import { SalesEventsService } from './sales-events.service';

@Module({
  controllers: [SalesEventsController],
  providers: [SalesEventsService],
  exports: [SalesEventsService],
})
export class SalesEventsModule {}
