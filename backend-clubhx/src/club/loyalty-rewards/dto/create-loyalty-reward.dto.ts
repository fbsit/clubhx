import { IsString, IsOptional, IsNumber, IsBoolean, IsArray, IsEnum, IsDateString, Min, MaxLength } from 'class-validator';

export enum LoyaltyRewardStatus {
  ACTIVE = 'active',
  INACTIVE = 'inactive',
  OUT_OF_STOCK = 'out_of_stock',
  DISCONTINUED = 'discontinued'
}

export class CreateLoyaltyRewardDto {
  @IsString()
  @MaxLength(255)
  name: string;

  @IsOptional()
  @IsString()
  description?: string;

  @IsOptional()
  @IsString()
  @MaxLength(100)
  category?: string;

  @IsOptional()
  @IsEnum(LoyaltyRewardStatus)
  status?: LoyaltyRewardStatus = LoyaltyRewardStatus.ACTIVE;

  @IsNumber()
  @Min(1)
  points_required: number;

  @IsOptional()
  @IsNumber()
  @Min(0)
  original_price?: number;

  @IsOptional()
  @IsString()
  @MaxLength(3)
  currency?: string = 'USD';

  @IsOptional()
  @IsNumber()
  @Min(0)
  stock_quantity?: number = 0;

  @IsOptional()
  @IsNumber()
  @Min(1)
  max_redemptions_per_user?: number = 1;

  @IsOptional()
  @IsString()
  @MaxLength(255)
  image_url?: string;

  @IsOptional()
  @IsString()
  @MaxLength(255)
  banner_url?: string;

  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  tags?: string[];

  @IsOptional()
  @IsBoolean()
  is_featured?: boolean = false;

  @IsOptional()
  @IsBoolean()
  is_public?: boolean = true;

  @IsOptional()
  @IsDateString()
  valid_from?: string;

  @IsOptional()
  @IsDateString()
  valid_until?: string;

  @IsOptional()
  @IsString()
  redemption_instructions?: string;

  @IsOptional()
  @IsString()
  terms_conditions?: string;
}

