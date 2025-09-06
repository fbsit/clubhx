import { LoyaltyRewardStatus } from './create-loyalty-reward.dto';

export class LoyaltyRewardDto {
  id: string;
  name: string;
  description?: string;
  category?: string;
  status: LoyaltyRewardStatus;
  points_required: number;
  original_price?: number;
  currency: string;
  stock_quantity: number;
  redeemed_quantity: number;
  max_redemptions_per_user: number;
  image_url?: string;
  banner_url?: string;
  tags?: string[];
  is_featured: boolean;
  is_public: boolean;
  valid_from?: Date;
  valid_until?: Date;
  redemption_instructions?: string;
  terms_conditions?: string;
  created_by?: string;
  updated_by?: string;
  created_at: Date;
  updated_at: Date;
  deleted_at?: Date;
}

export class PaginatedLoyaltyRewardListDto {
  count: number;
  next?: string | null;
  previous?: string | null;
  results: LoyaltyRewardDto[];
}

