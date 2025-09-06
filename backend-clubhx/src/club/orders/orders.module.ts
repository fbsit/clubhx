import { Module } from '@nestjs/common';
import { OrdersController } from './orders.controller';
import { OrdersCreateController } from './orders.create.controller';
import { ClubSharedModule } from '../shared/club-shared.module';

@Module({
  imports: [ClubSharedModule],
  controllers: [OrdersController, OrdersCreateController],
})
export class OrdersModule {}


