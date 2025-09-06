import { Module } from '@nestjs/common';
import { CreditRequestsController } from './credit-requests.controller';

@Module({
  controllers: [CreditRequestsController],
})
export class CreditRequestsModule {}


