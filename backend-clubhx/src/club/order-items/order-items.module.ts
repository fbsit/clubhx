import { Module } from '@nestjs/common';
import { OrderItemsController } from './order-items.controller';
import { ClubSharedModule } from '../shared/club-shared.module';

@Module({
  imports: [ClubSharedModule],
  controllers: [OrderItemsController],
})
export class OrderItemsModule {}


