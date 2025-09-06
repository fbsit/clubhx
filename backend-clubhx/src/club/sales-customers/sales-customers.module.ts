import { Module } from '@nestjs/common';
import { SalesCustomersController } from './sales-customers.controller';
import { SalesCustomersService } from './sales-customers.service';

@Module({
  controllers: [SalesCustomersController],
  providers: [SalesCustomersService],
  exports: [SalesCustomersService],
})
export class SalesCustomersModule {}
