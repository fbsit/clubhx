import { LoyaltyRewardDto, CreateLoyaltyRewardDto, UpdateLoyaltyRewardDto, LoyaltyRewardStatus } from '@/services/loyaltyRewardsApi';

// Frontend interface (existing structure)
export interface LoyaltyProduct {
  id: string;
  name: string;
  category: string;
  description: string;
  pointsCost: number;
  image: string;
  available: number | null;
  featured: boolean;
  date?: string;
  location?: string;
  status?: string;
  originalPrice?: number;
  currency?: string;
  stockQuantity?: number;
  redeemedQuantity?: number;
  maxRedemptionsPerUser?: number;
  bannerUrl?: string;
  tags?: string[];
  isPublic?: boolean;
  validFrom?: string;
  validUntil?: string;
  redemptionInstructions?: string;
  termsConditions?: string;
}

export function adaptLoyaltyRewardFromDto(dto: LoyaltyRewardDto): LoyaltyProduct {
  return {
    id: dto.id,
    name: dto.name,
    category: dto.category || 'product',
    description: dto.description || '',
    pointsCost: dto.points_required,
    image: dto.image_url || '',
    available: dto.stock_quantity > 0 ? dto.stock_quantity : null,
    featured: dto.is_featured,
    status: dto.status,
    originalPrice: dto.original_price,
    currency: dto.currency,
    stockQuantity: dto.stock_quantity,
    redeemedQuantity: dto.redeemed_quantity,
    maxRedemptionsPerUser: dto.max_redemptions_per_user,
    bannerUrl: dto.banner_url,
    tags: dto.tags,
    isPublic: dto.is_public,
    validFrom: dto.valid_from ? new Date(dto.valid_from).toISOString().split('T')[0] : undefined,
    validUntil: dto.valid_until ? new Date(dto.valid_until).toISOString().split('T')[0] : undefined,
    redemptionInstructions: dto.redemption_instructions,
    termsConditions: dto.terms_conditions,
  };
}

export function adaptLoyaltyRewardToCreateDto(product: LoyaltyProduct): CreateLoyaltyRewardDto {
  return {
    name: product.name,
    description: product.description,
    category: product.category,
    status: (product.status as LoyaltyRewardStatus) || LoyaltyRewardStatus.ACTIVE,
    points_required: product.pointsCost,
    original_price: product.originalPrice,
    currency: product.currency || 'USD',
    stock_quantity: product.stockQuantity || 0,
    max_redemptions_per_user: product.maxRedemptionsPerUser || 1,
    image_url: product.image,
    banner_url: product.bannerUrl,
    tags: product.tags,
    is_featured: product.featured,
    is_public: product.isPublic !== false, // Default to true
    valid_from: product.validFrom,
    valid_until: product.validUntil,
    redemption_instructions: product.redemptionInstructions,
    terms_conditions: product.termsConditions,
  };
}

export function adaptLoyaltyRewardToUpdateDto(product: LoyaltyProduct): UpdateLoyaltyRewardDto {
  return {
    name: product.name,
    description: product.description,
    category: product.category,
    status: (product.status as LoyaltyRewardStatus) || LoyaltyRewardStatus.ACTIVE,
    points_required: product.pointsCost,
    original_price: product.originalPrice,
    currency: product.currency || 'USD',
    stock_quantity: product.stockQuantity || 0,
    max_redemptions_per_user: product.maxRedemptionsPerUser || 1,
    image_url: product.image,
    banner_url: product.bannerUrl,
    tags: product.tags,
    is_featured: product.featured,
    is_public: product.isPublic !== false,
    valid_from: product.validFrom,
    valid_until: product.validUntil,
    redemption_instructions: product.redemptionInstructions,
    terms_conditions: product.termsConditions,
  };
}

export function adaptLoyaltyRewardsFromDto(dtos: LoyaltyRewardDto[]): LoyaltyProduct[] {
  return dtos.map(adaptLoyaltyRewardFromDto);
}

export function createEmptyLoyaltyProduct(): LoyaltyProduct {
  return {
    id: '',
    name: '',
    category: 'product',
    description: '',
    pointsCost: 1000,
    image: '',
    available: null,
    featured: false,
    status: LoyaltyRewardStatus.ACTIVE,
    originalPrice: 0,
    currency: 'USD',
    stockQuantity: 0,
    redeemedQuantity: 0,
    maxRedemptionsPerUser: 1,
    isPublic: true,
  };
}
