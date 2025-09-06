import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, FindOptionsWhere, Like, Between, IsNull, LessThanOrEqual, MoreThanOrEqual } from 'typeorm';
import { LoyaltyReward } from './entity/loyalty-reward';
import { LoyaltyRedemption, RedemptionStatus } from './entity/loyalty-redemption';
import { CreateLoyaltyRewardDto, LoyaltyRewardStatus } from './dto/create-loyalty-reward.dto';
import { UpdateLoyaltyRewardDto } from './dto/update-loyalty-reward.dto';
import { LoyaltyRewardDto, PaginatedLoyaltyRewardListDto } from './dto/loyalty-reward.dto';

@Injectable()
export class LoyaltyRewardsService {
  constructor(
    @InjectRepository(LoyaltyReward)
    private readonly loyaltyRewardRepository: Repository<LoyaltyReward>,
    @InjectRepository(LoyaltyRedemption)
    private readonly redemptionRepo: Repository<LoyaltyRedemption>,
  ) {}

  // === CRUD Operations ===

  async create(createLoyaltyRewardDto: CreateLoyaltyRewardDto, userId?: string): Promise<LoyaltyRewardDto> {
    const { valid_from, valid_until, ...restDto } = createLoyaltyRewardDto;
    
    const loyaltyReward = this.loyaltyRewardRepository.create({
      ...restDto,
      valid_from: valid_from ? new Date(valid_from) : null,
      valid_until: valid_until ? new Date(valid_until) : null,
      created_by: userId,
      updated_by: userId,
    } as any);

    const savedReward = await this.loyaltyRewardRepository.save(loyaltyReward);
    return this.mapToDto(savedReward as unknown as LoyaltyReward);
  }

  async findAll(query: {
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
  }): Promise<PaginatedLoyaltyRewardListDto> {
    const {
      page = 1,
      limit = 10,
      search,
      category,
      status,
      minPoints,
      maxPoints,
      isFeatured,
      isPublic,
      availableOnly,
    } = query;

    const skip = (page - 1) * limit;
    const whereConditions: FindOptionsWhere<LoyaltyReward> = {
      deleted_at: IsNull(),
    };

    // Search by name or description
    if (search) {
      whereConditions.name = Like(`%${search}%`);
    }

    // Filter by category
    if (category) {
      whereConditions.category = category;
    }

    // Filter by status
    if (status) {
      whereConditions.status = status;
    }

    // Filter by points range
    if (minPoints !== undefined) {
      whereConditions.points_required = MoreThanOrEqual(minPoints);
    }
    if (maxPoints !== undefined) {
      whereConditions.points_required = LessThanOrEqual(maxPoints);
    }

    // Filter by featured
    if (isFeatured !== undefined) {
      whereConditions.is_featured = isFeatured;
    }

    // Filter by public
    if (isPublic !== undefined) {
      whereConditions.is_public = isPublic;
    }

    // Filter by availability
    if (availableOnly) {
      whereConditions.status = LoyaltyRewardStatus.ACTIVE;
      whereConditions.stock_quantity = MoreThanOrEqual(1);
    }

    const [rewards, total] = await this.loyaltyRewardRepository.findAndCount({
      where: whereConditions,
      order: { points_required: 'ASC' },
      skip,
      take: limit,
    });

    const results = rewards.map(reward => this.mapToDto(reward));
    const totalPages = Math.ceil(total / limit);

    return {
      count: total,
      next: page < totalPages ? `?page=${page + 1}&limit=${limit}` : null,
      previous: page > 1 ? `?page=${page - 1}&limit=${limit}` : null,
      results,
    };
  }

  async findOne(id: string): Promise<LoyaltyRewardDto> {
    const reward = await this.loyaltyRewardRepository.findOne({
      where: { id, deleted_at: IsNull() },
    });

    if (!reward) {
      throw new NotFoundException(`Loyalty reward with ID ${id} not found`);
    }

    return this.mapToDto(reward);
  }

  async update(id: string, updateLoyaltyRewardDto: UpdateLoyaltyRewardDto, userId?: string): Promise<LoyaltyRewardDto> {
    const reward = await this.loyaltyRewardRepository.findOne({
      where: { id, deleted_at: IsNull() },
    });

    if (!reward) {
      throw new NotFoundException(`Loyalty reward with ID ${id} not found`);
    }

    // Convert date strings to Date objects if provided
    const updateData: any = { ...updateLoyaltyRewardDto };
    if (updateLoyaltyRewardDto.valid_from) {
      updateData.valid_from = new Date(updateLoyaltyRewardDto.valid_from);
    }
    if (updateLoyaltyRewardDto.valid_until) {
      updateData.valid_until = new Date(updateLoyaltyRewardDto.valid_until);
    }
    updateData.updated_by = userId;

    await this.loyaltyRewardRepository.update(id, updateData);
    const updatedReward = await this.loyaltyRewardRepository.findOne({ where: { id } });
    
    if (!updatedReward) {
      throw new NotFoundException(`Loyalty reward with ID ${id} not found after update`);
    }
    
    return this.mapToDto(updatedReward);
  }

  async remove(id: string, userId?: string): Promise<void> {
    const reward = await this.loyaltyRewardRepository.findOne({
      where: { id, deleted_at: IsNull() },
    });

    if (!reward) {
      throw new NotFoundException(`Loyalty reward with ID ${id} not found`);
    }

    // Soft delete
    await this.loyaltyRewardRepository.update(id, {
      deleted_at: new Date(),
      updated_by: userId,
    });
  }

  // === Business Logic Methods ===

  async findAvailableRewards(customerPoints: number, limit: number = 10): Promise<LoyaltyRewardDto[]> {
    const rewards = await this.loyaltyRewardRepository.find({
      where: {
        status: LoyaltyRewardStatus.ACTIVE,
        is_public: true,
        points_required: LessThanOrEqual(customerPoints),
        stock_quantity: MoreThanOrEqual(1),
        deleted_at: IsNull(),
        valid_from: IsNull(),
        valid_until: IsNull(),
      },
      order: { points_required: 'ASC' },
      take: limit,
    });

    return rewards.map(reward => this.mapToDto(reward));
  }

  async findFeaturedRewards(): Promise<LoyaltyRewardDto[]> {
    const rewards = await this.loyaltyRewardRepository.find({
      where: {
        is_featured: true,
        status: LoyaltyRewardStatus.ACTIVE,
        is_public: true,
        deleted_at: IsNull(),
      },
      order: { points_required: 'ASC' },
    });

    return rewards.map(reward => this.mapToDto(reward));
  }

  async findRewardsByCategory(category: string, limit: number = 10): Promise<LoyaltyRewardDto[]> {
    const rewards = await this.loyaltyRewardRepository.find({
      where: {
        category,
        status: LoyaltyRewardStatus.ACTIVE,
        is_public: true,
        deleted_at: IsNull(),
      },
      order: { points_required: 'ASC' },
      take: limit,
    });

    return rewards.map(reward => this.mapToDto(reward));
  }

  async findRewardsByPointsRange(minPoints: number, maxPoints: number): Promise<LoyaltyRewardDto[]> {
    const rewards = await this.loyaltyRewardRepository.find({
      where: {
        points_required: Between(minPoints, maxPoints),
        status: LoyaltyRewardStatus.ACTIVE,
        is_public: true,
        deleted_at: IsNull(),
      },
      order: { points_required: 'ASC' },
    });

    return rewards.map(reward => this.mapToDto(reward));
  }

  async incrementRedemptions(id: string): Promise<void> {
    const reward = await this.loyaltyRewardRepository.findOne({
      where: { id, deleted_at: IsNull() },
    });

    if (!reward) {
      throw new NotFoundException(`Loyalty reward with ID ${id} not found`);
    }

    if (reward.stock_quantity > 0 && reward.redeemed_quantity >= reward.stock_quantity) {
      throw new BadRequestException('Reward is out of stock');
    }

    await this.loyaltyRewardRepository.increment({ id }, 'redeemed_quantity', 1);
  }

  async createRedemption(rewardId: string, customerId: string, pointsSpent: number): Promise<LoyaltyRedemption> {
    const redemption = this.redemptionRepo.create({
      reward_id: rewardId,
      customer_id: customerId,
      points_spent: pointsSpent,
      status: 'pending',
      delivered_at: null,
    });
    return this.redemptionRepo.save(redemption);
  }

  async listMyRedemptions(customerId: string, status?: RedemptionStatus): Promise<LoyaltyRedemption[]> {
    const where: any = { customer_id: customerId };
    if (status) where.status = status;
    return this.redemptionRepo.find({ where, order: { created_at: 'DESC' } });
  }

  async decrementRedemptions(id: string): Promise<void> {
    const reward = await this.loyaltyRewardRepository.findOne({
      where: { id, deleted_at: IsNull() },
    });

    if (!reward) {
      throw new NotFoundException(`Loyalty reward with ID ${id} not found`);
    }

    if (reward.redeemed_quantity > 0) {
      await this.loyaltyRewardRepository.decrement({ id }, 'redeemed_quantity', 1);
    }
  }

  async toggleFeatured(id: string, userId?: string): Promise<LoyaltyRewardDto> {
    const reward = await this.loyaltyRewardRepository.findOne({
      where: { id, deleted_at: IsNull() },
    });

    if (!reward) {
      throw new NotFoundException(`Loyalty reward with ID ${id} not found`);
    }

    await this.loyaltyRewardRepository.update(id, {
      is_featured: !reward.is_featured,
      updated_by: userId,
    });

    const updatedReward = await this.loyaltyRewardRepository.findOne({ where: { id } });
    
    if (!updatedReward) {
      throw new NotFoundException(`Loyalty reward with ID ${id} not found after update`);
    }
    
    return this.mapToDto(updatedReward);
  }

  async changeStatus(id: string, status: LoyaltyRewardStatus, userId?: string): Promise<LoyaltyRewardDto> {
    const reward = await this.loyaltyRewardRepository.findOne({
      where: { id, deleted_at: IsNull() },
    });

    if (!reward) {
      throw new NotFoundException(`Loyalty reward with ID ${id} not found`);
    }

    await this.loyaltyRewardRepository.update(id, {
      status,
      updated_by: userId,
    });

    const updatedReward = await this.loyaltyRewardRepository.findOne({ where: { id } });
    
    if (!updatedReward) {
      throw new NotFoundException(`Loyalty reward with ID ${id} not found after update`);
    }
    
    return this.mapToDto(updatedReward);
  }

  async updateStock(id: string, newStockQuantity: number, userId?: string): Promise<LoyaltyRewardDto> {
    const reward = await this.loyaltyRewardRepository.findOne({
      where: { id, deleted_at: IsNull() },
    });

    if (!reward) {
      throw new NotFoundException(`Loyalty reward with ID ${id} not found`);
    }

    if (newStockQuantity < 0) {
      throw new BadRequestException('Stock quantity cannot be negative');
    }

    await this.loyaltyRewardRepository.update(id, {
      stock_quantity: newStockQuantity,
      updated_by: userId,
    });

    const updatedReward = await this.loyaltyRewardRepository.findOne({ where: { id } });
    
    if (!updatedReward) {
      throw new NotFoundException(`Loyalty reward with ID ${id} not found after update`);
    }
    
    return this.mapToDto(updatedReward);
  }

  async getRewardStats(): Promise<{
    total: number;
    active: number;
    outOfStock: number;
    discontinued: number;
    totalRedemptions: number;
  }> {
    const [total, active, outOfStock, discontinued] = await Promise.all([
      this.loyaltyRewardRepository.count({ where: { deleted_at: IsNull() } }),
      this.loyaltyRewardRepository.count({ where: { status: LoyaltyRewardStatus.ACTIVE, deleted_at: IsNull() } }),
      this.loyaltyRewardRepository.count({ where: { status: LoyaltyRewardStatus.OUT_OF_STOCK, deleted_at: IsNull() } }),
      this.loyaltyRewardRepository.count({ where: { status: LoyaltyRewardStatus.DISCONTINUED, deleted_at: IsNull() } }),
    ]);

    const totalRedemptionsResult = await this.loyaltyRewardRepository
      .createQueryBuilder('reward')
      .select('SUM(reward.redeemed_quantity)', 'total')
      .where('reward.deleted_at IS NULL')
      .getRawOne();

    const totalRedemptions = parseInt(totalRedemptionsResult?.total || '0');

    return { total, active, outOfStock, discontinued, totalRedemptions };
  }

  async checkAvailability(id: string, customerPoints: number): Promise<{
    available: boolean;
    canAfford: boolean;
    inStock: boolean;
    validPeriod: boolean;
    message?: string;
  }> {
    const reward = await this.loyaltyRewardRepository.findOne({
      where: { id, deleted_at: IsNull() },
    });

    if (!reward) {
      return {
        available: false,
        canAfford: false,
        inStock: false,
        validPeriod: false,
        message: 'Reward not found',
      };
    }

    const canAfford = customerPoints >= reward.points_required;
    const inStock = reward.stock_quantity === 0 || reward.redeemed_quantity < reward.stock_quantity;
    const validPeriod = this.isWithinValidPeriod(reward);

    const available = canAfford && inStock && validPeriod && reward.status === LoyaltyRewardStatus.ACTIVE;

    let message: string | undefined;
    if (!available) {
      if (!canAfford) {
        message = `Insufficient points. Required: ${reward.points_required}, Available: ${customerPoints}`;
      } else if (!inStock) {
        message = 'Reward is out of stock';
      } else if (!validPeriod) {
        message = 'Reward is not available during this period';
      } else if (reward.status !== LoyaltyRewardStatus.ACTIVE) {
        message = 'Reward is not active';
      }
    }

    return {
      available,
      canAfford,
      inStock,
      validPeriod,
      message,
    };
  }

  // === Helper Methods ===

  private isWithinValidPeriod(reward: LoyaltyReward): boolean {
    const now = new Date();
    
    if (reward.valid_from && now < reward.valid_from) {
      return false;
    }
    
    if (reward.valid_until && now > reward.valid_until) {
      return false;
    }
    
    return true;
  }

  private mapToDto(reward: LoyaltyReward): LoyaltyRewardDto {
    return {
      id: reward.id,
      name: reward.name,
      description: reward.description,
      category: reward.category,
      status: reward.status as LoyaltyRewardStatus,
      points_required: reward.points_required,
      original_price: reward.original_price,
      currency: reward.currency,
      stock_quantity: reward.stock_quantity,
      redeemed_quantity: reward.redeemed_quantity,
      max_redemptions_per_user: reward.max_redemptions_per_user,
      image_url: reward.image_url,
      banner_url: reward.banner_url,
      tags: reward.tags,
      is_featured: reward.is_featured,
      is_public: reward.is_public,
      valid_from: reward.valid_from,
      valid_until: reward.valid_until,
      redemption_instructions: reward.redemption_instructions,
      terms_conditions: reward.terms_conditions,
      created_by: reward.created_by,
      updated_by: reward.updated_by,
      created_at: reward.created_at,
      updated_at: reward.updated_at,
      deleted_at: reward.deleted_at,
    };
  }
}

