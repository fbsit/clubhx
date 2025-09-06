import { PartialType } from '@nestjs/mapped-types';
import { CreateLoyaltyRewardDto } from './create-loyalty-reward.dto';

export class UpdateLoyaltyRewardDto extends PartialType(CreateLoyaltyRewardDto) {}

