import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { LoyaltyReward } from './entity/loyalty-reward';
import { LoyaltyRedemption } from './entity/loyalty-redemption';
import { LoyaltyRewardsService } from './loyalty-rewards.service';
import { LoyaltyModule } from '../loyalty/loyalty.module';
import { LoyaltyRewardsController } from './loyalty-rewards.controller';

@Module({
  imports: [TypeOrmModule.forFeature([LoyaltyReward, LoyaltyRedemption]), LoyaltyModule],
  controllers: [LoyaltyRewardsController],
  providers: [LoyaltyRewardsService],
  exports: [LoyaltyRewardsService],
})
export class LoyaltyRewardsModule {}
