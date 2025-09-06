import { Module } from '@nestjs/common';
import { ProductsController } from './products.controller';
import { ClubSharedModule } from '../shared/club-shared.module';

@Module({
  imports: [ClubSharedModule],
  controllers: [ProductsController],
})
export class ProductsModule {}


