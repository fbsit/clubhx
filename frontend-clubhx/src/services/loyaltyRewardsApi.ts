import { fetchJson } from "@/lib/api";

// Types based on backend DTOs
export interface LoyaltyRewardDto {
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

export interface CreateLoyaltyRewardDto {
  name: string;
  description?: string;
  category?: string;
  status?: LoyaltyRewardStatus;
  points_required: number;
  original_price?: number;
  currency?: string;
  stock_quantity?: number;
  max_redemptions_per_user?: number;
  image_url?: string;
  banner_url?: string;
  tags?: string[];
  is_featured?: boolean;
  is_public?: boolean;
  valid_from?: string;
  valid_until?: string;
  redemption_instructions?: string;
  terms_conditions?: string;
}

export interface UpdateLoyaltyRewardDto extends Partial<CreateLoyaltyRewardDto> {}

export interface PaginatedLoyaltyRewardListDto {
  count: number;
  next?: string | null;
  previous?: string | null;
  results: LoyaltyRewardDto[];
}

export interface LoyaltyRewardQueryParams {
  page?: number;
  limit?: number;
  search?: string;
  category?: string;
  status?: LoyaltyRewardStatus;
  minPoints?: number;
  maxPoints?: number;
  isFeatured?: boolean;
  isPublic?: boolean;
  availableOnly?: boolean;
}

export enum LoyaltyRewardStatus {
  ACTIVE = 'active',
  INACTIVE = 'inactive',
  OUT_OF_STOCK = 'out_of_stock',
  DISCONTINUED = 'discontinued'
}

export interface RewardAvailability {
  available: boolean;
  canAfford: boolean;
  inStock: boolean;
  validPeriod: boolean;
  message?: string;
}

export interface RewardStats {
  total: number;
  active: number;
  outOfStock: number;
  discontinued: number;
  totalRedemptions: number;
}

export interface LoyaltyRedemptionDto {
	id: string;
	reward_id: string;
	customer_id: string;
	points_spent: number;
	status: 'pending' | 'delivered';
	created_at: string;
	updated_at: string;
	delivered_at?: string | null;
}

export class LoyaltyRewardsApiService {
  private baseUrl = "/api/v1/loyalty-rewards";

  // === CRUD Operations ===
  async getRewards(params: LoyaltyRewardQueryParams = {}): Promise<PaginatedLoyaltyRewardListDto> {
    const queryParams = new URLSearchParams();
    
    Object.entries(params).forEach(([key, value]) => {
      if (value !== undefined && value !== null) {
        queryParams.append(key, value.toString());
      }
    });

    const url = queryParams.toString() ? `${this.baseUrl}?${queryParams.toString()}` : this.baseUrl;
    return fetchJson<PaginatedLoyaltyRewardListDto>(url);
  }

  async getReward(id: string): Promise<LoyaltyRewardDto> {
    return fetchJson<LoyaltyRewardDto>(`${this.baseUrl}/${id}`);
  }

  async createReward(rewardData: CreateLoyaltyRewardDto): Promise<LoyaltyRewardDto> {
    return fetchJson<LoyaltyRewardDto>(this.baseUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(rewardData),
    });
  }

  async updateReward(id: string, rewardData: UpdateLoyaltyRewardDto): Promise<LoyaltyRewardDto> {
    return fetchJson<LoyaltyRewardDto>(`${this.baseUrl}/${id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(rewardData),
    });
  }

  async deleteReward(id: string): Promise<void> {
    return fetchJson<void>(`${this.baseUrl}/${id}`, {
      method: 'DELETE',
    });
  }

  // === Business Logic Operations ===
  async getAvailableRewards(customerPoints: number, limit?: number): Promise<LoyaltyRewardDto[]> {
    const url = limit ? `${this.baseUrl}/available/${customerPoints}?limit=${limit}` : `${this.baseUrl}/available/${customerPoints}`;
    return fetchJson<LoyaltyRewardDto[]>(url);
  }

  async getFeaturedRewards(): Promise<LoyaltyRewardDto[]> {
    return fetchJson<LoyaltyRewardDto[]>(`${this.baseUrl}/featured/rewards`);
  }

  async getRewardsByCategory(category: string, limit?: number): Promise<LoyaltyRewardDto[]> {
    const url = limit ? `${this.baseUrl}/category/${category}?limit=${limit}` : `${this.baseUrl}/category/${category}`;
    return fetchJson<LoyaltyRewardDto[]>(url);
  }

  async getRewardsByPointsRange(minPoints: number, maxPoints: number): Promise<LoyaltyRewardDto[]> {
    return fetchJson<LoyaltyRewardDto[]>(`${this.baseUrl}/points-range/${minPoints}/${maxPoints}`);
  }

  async redeemReward(id: string): Promise<void> {
    return fetchJson<void>(`${this.baseUrl}/${id}/redeem`, {
      method: 'POST',
    });
  }

  async cancelRedemption(id: string): Promise<void> {
    return fetchJson<void>(`${this.baseUrl}/${id}/cancel-redemption`, {
      method: 'POST',
    });
  }

  async toggleFeatured(id: string): Promise<LoyaltyRewardDto> {
    return fetchJson<LoyaltyRewardDto>(`${this.baseUrl}/${id}/toggle-featured`, {
      method: 'PATCH',
    });
  }

  async changeStatus(id: string, status: LoyaltyRewardStatus): Promise<LoyaltyRewardDto> {
    return fetchJson<LoyaltyRewardDto>(`${this.baseUrl}/${id}/status`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ status }),
    });
  }

  async updateStock(id: string, stockQuantity: number): Promise<LoyaltyRewardDto> {
    return fetchJson<LoyaltyRewardDto>(`${this.baseUrl}/${id}/stock`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ stockQuantity }),
    });
  }

  async getRewardStats(): Promise<RewardStats> {
    return fetchJson<RewardStats>(`${this.baseUrl}/stats/overview`);
  }

  async checkAvailability(id: string, customerPoints: number): Promise<RewardAvailability> {
    return fetchJson<RewardAvailability>(`${this.baseUrl}/${id}/availability/${customerPoints}`);
  }

  // === Public Endpoints ===
  async getPublicAvailableRewards(customerPoints: number, limit?: number): Promise<LoyaltyRewardDto[]> {
    const url = limit ? `${this.baseUrl}/public/available/${customerPoints}?limit=${limit}` : `${this.baseUrl}/public/available/${customerPoints}`;
    return fetchJson<LoyaltyRewardDto[]>(url);
  }

  async getPublicFeaturedRewards(): Promise<LoyaltyRewardDto[]> {
    return fetchJson<LoyaltyRewardDto[]>(`${this.baseUrl}/public/featured`);
  }

  async getPublicRewardsByCategory(category: string, limit?: number): Promise<LoyaltyRewardDto[]> {
    const url = limit ? `${this.baseUrl}/public/category/${category}?limit=${limit}` : `${this.baseUrl}/public/category/${category}`;
    return fetchJson<LoyaltyRewardDto[]>(url);
  }

  async getPublicRewardsByPointsRange(minPoints: number, maxPoints: number): Promise<LoyaltyRewardDto[]> {
    return fetchJson<LoyaltyRewardDto[]>(`${this.baseUrl}/public/points-range/${minPoints}/${maxPoints}`);
  }

  async getPublicReward(id: string): Promise<LoyaltyRewardDto> {
    return fetchJson<LoyaltyRewardDto>(`${this.baseUrl}/public/${id}`);
  }

  async getPublicAvailability(id: string, customerPoints: number): Promise<RewardAvailability> {
    return fetchJson<RewardAvailability>(`${this.baseUrl}/public/${id}/availability/${customerPoints}`);
  }
}

export const loyaltyRewardsApi = new LoyaltyRewardsApiService();

export async function redeemLoyaltyReward(id: string, clientId?: string): Promise<{ success: boolean; points?: number }> {
  const url = clientId
    ? `/api/v1/loyalty-rewards/${id}/redeem?client=${encodeURIComponent(clientId)}`
    : `/api/v1/loyalty-rewards/${id}/redeem`;
	return fetchJson<{ success: boolean; points?: number }>(url, { method: "POST" });
}

export async function getMyRedemptions(status?: 'pending' | 'delivered') {
	const qs = status ? `?status=${status}` : '';
	return fetchJson<LoyaltyRedemptionDto[]>(`/api/v1/loyalty-rewards/public/my-redemptions${qs}`);
}
