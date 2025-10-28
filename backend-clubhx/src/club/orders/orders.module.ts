import { Module } from '@nestjs/common';
import { OrdersController } from './orders.controller';
import { OrdersCreateController } from './orders.create.controller';
import { OrdersSubmitController } from './orders.submit.controller';
import { ShippingTypesController } from './shipping-types.controller';
import { PaymentMethodsController } from './payment-methods.controller';
import { ClubSharedModule } from '../shared/club-shared.module';

@Module({
  imports: [ClubSharedModule],
  controllers: [
    OrdersController,
    OrdersCreateController,
    OrdersSubmitController,
    ShippingTypesController,
    PaymentMethodsController,
  ],
})
export class OrdersModule {}


