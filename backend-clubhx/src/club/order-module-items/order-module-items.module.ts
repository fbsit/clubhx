import { Module } from '@nestjs/common';
import { OrderModuleItemsController } from './order-module-items.controller';
import { ClubSharedModule } from '../shared/club-shared.module';

@Module({
  imports: [ClubSharedModule],
  controllers: [OrderModuleItemsController],
})
export class OrderModuleItemsModule {}


