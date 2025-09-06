// src/loyalty/loyalty.module.ts
import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { LoyaltyPoint } from "./entity/loyalty-point";
import { LoyaltyTransaction } from "./entity/loyalty-transaction";
import { LoyaltyModuleService } from "./loyalty.service";
import { LoyaltyController } from "./loyalty.controller";

@Module({
  imports: [TypeOrmModule.forFeature([LoyaltyPoint, LoyaltyTransaction])],
  controllers: [LoyaltyController],
  providers: [LoyaltyModuleService],
  exports: [LoyaltyModuleService],
})
export class LoyaltyModule {}
