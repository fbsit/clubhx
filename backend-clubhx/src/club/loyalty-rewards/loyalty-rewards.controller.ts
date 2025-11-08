import {
  Controller,
  Get,
  Post,
  Put,
  Patch,
  Delete,
  Body,
  Param,
  Query,
  Request,
  Headers,
} from '@nestjs/common';
import { LoyaltyRewardsService } from './loyalty-rewards.service';
import { LoyaltyModuleService } from '../loyalty/loyalty.service';
import { CreateLoyaltyRewardDto, LoyaltyRewardStatus } from './dto/create-loyalty-reward.dto';
import { UpdateLoyaltyRewardDto } from './dto/update-loyalty-reward.dto';
import { LoyaltyRewardDto, PaginatedLoyaltyRewardListDto } from './dto/loyalty-reward.dto';

@Controller('api/v1/loyalty-rewards')
export class LoyaltyRewardsController {
  constructor(
    private readonly loyaltyRewardsService: LoyaltyRewardsService,
    private readonly loyaltyService: LoyaltyModuleService,
  ) {}

  // === CRUD Endpoints ===

  @Post()
  async create(@Body() createLoyaltyRewardDto: CreateLoyaltyRewardDto, @Request() req: any): Promise<LoyaltyRewardDto> {
    const userId = req.user?.id;
    return this.loyaltyRewardsService.create(createLoyaltyRewardDto, userId);
  }

  @Get()
  async findAll(@Query() query: {
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
    return this.loyaltyRewardsService.findAll(query);
  }

  @Get(':id')
  async findOne(@Param('id') id: string): Promise<LoyaltyRewardDto> {
    return this.loyaltyRewardsService.findOne(id);
  }

  @Put(':id')
  async update(
    @Param('id') id: string,
    @Body() updateLoyaltyRewardDto: UpdateLoyaltyRewardDto,
    @Request() req: any,
  ): Promise<LoyaltyRewardDto> {
    const userId = req.user?.id;
    return this.loyaltyRewardsService.update(id, updateLoyaltyRewardDto, userId);
  }

  @Patch(':id')
  async partialUpdate(
    @Param('id') id: string,
    @Body() updateLoyaltyRewardDto: UpdateLoyaltyRewardDto,
    @Request() req: any,
  ): Promise<LoyaltyRewardDto> {
    const userId = req.user?.id;
    return this.loyaltyRewardsService.update(id, updateLoyaltyRewardDto, userId);
  }

  @Delete(':id')
  async remove(@Param('id') id: string, @Request() req: any): Promise<void> {
    const userId = req.user?.id;
    return this.loyaltyRewardsService.remove(id, userId);
  }

  // === Business Logic Endpoints ===

  @Get('available/:customerPoints')
  async findAvailableRewards(
    @Param('customerPoints') customerPoints: number,
    @Query('limit') limit?: number,
  ): Promise<LoyaltyRewardDto[]> {
    return this.loyaltyRewardsService.findAvailableRewards(customerPoints, limit);
  }

  @Get('featured/rewards')
  async findFeaturedRewards(): Promise<LoyaltyRewardDto[]> {
    return this.loyaltyRewardsService.findFeaturedRewards();
  }

  @Get('category/:category')
  async findRewardsByCategory(
    @Param('category') category: string,
    @Query('limit') limit?: number,
  ): Promise<LoyaltyRewardDto[]> {
    return this.loyaltyRewardsService.findRewardsByCategory(category, limit);
  }

  @Get('points-range/:minPoints/:maxPoints')
  async findRewardsByPointsRange(
    @Param('minPoints') minPoints: number,
    @Param('maxPoints') maxPoints: number,
  ): Promise<LoyaltyRewardDto[]> {
    return this.loyaltyRewardsService.findRewardsByPointsRange(minPoints, maxPoints);
  }

  @Post(':id/redeem')
  async redeemReward(
    @Param('id') id: string,
    @Headers('authorization') authorization?: string,
    @Query('client') client?: string,
  ): Promise<{ success: boolean; points: number }> {
    // Resolve customer identity: prefer explicit client query, fallback to auth-derived placeholder
    const customerId = client && String(client).trim().length > 0
      ? String(client).trim()
      : (authorization ? authorization.slice(-16) : 'anonymous');
    const reward = await this.loyaltyRewardsService.findOne(id);
    // Check stock and increment
    await this.loyaltyRewardsService.incrementRedemptions(id);
    // Deduct points
    await this.loyaltyService.deductPoints(customerId, reward.points_required);
    const points = await this.loyaltyService.getPoints(customerId);
    // Create redemption record
    await this.loyaltyRewardsService.createRedemption(id, customerId, reward.points_required);
    return { success: true, points };
  }

  @Get('public/my-redemptions')
  async getMyRedemptions(@Headers('authorization') authorization?: string, @Query('status') status?: 'pending' | 'delivered') {
    const customerId = authorization ? authorization.slice(-16) : 'anonymous';
    return this.loyaltyRewardsService.listMyRedemptions(customerId, status as any);
  }

  @Post(':id/cancel-redemption')
  async cancelRedemption(@Param('id') id: string): Promise<void> {
    return this.loyaltyRewardsService.decrementRedemptions(id);
  }

  @Patch(':id/toggle-featured')
  async toggleFeatured(@Param('id') id: string, @Request() req: any): Promise<LoyaltyRewardDto> {
    const userId = req.user?.id;
    return this.loyaltyRewardsService.toggleFeatured(id, userId);
  }

  @Patch(':id/status')
  async changeStatus(
    @Param('id') id: string,
    @Body('status') status: LoyaltyRewardStatus,
    @Request() req: any,
  ): Promise<LoyaltyRewardDto> {
    const userId = req.user?.id;
    return this.loyaltyRewardsService.changeStatus(id, status, userId);
  }

  @Patch(':id/stock')
  async updateStock(
    @Param('id') id: string,
    @Body('stockQuantity') stockQuantity: number,
    @Request() req: any,
  ): Promise<LoyaltyRewardDto> {
    const userId = req.user?.id;
    return this.loyaltyRewardsService.updateStock(id, stockQuantity, userId);
  }

  @Get('stats/overview')
  async getRewardStats(): Promise<{
    total: number;
    active: number;
    outOfStock: number;
    discontinued: number;
    totalRedemptions: number;
  }> {
    return this.loyaltyRewardsService.getRewardStats();
  }

  @Get(':id/availability/:customerPoints')
  async checkAvailability(
    @Param('id') id: string,
    @Param('customerPoints') customerPoints: number,
  ): Promise<{
    available: boolean;
    canAfford: boolean;
    inStock: boolean;
    validPeriod: boolean;
    message?: string;
  }> {
    return this.loyaltyRewardsService.checkAvailability(id, customerPoints);
  }

  // === Public Endpoints (for client-side) ===

  @Get('public/available/:customerPoints')
  async getPublicAvailableRewards(
    @Param('customerPoints') customerPoints: number,
    @Query('limit') limit?: number,
  ): Promise<LoyaltyRewardDto[]> {
    return this.loyaltyRewardsService.findAvailableRewards(customerPoints, limit);
  }

  @Get('public/featured')
  async getPublicFeaturedRewards(): Promise<LoyaltyRewardDto[]> {
    return this.loyaltyRewardsService.findFeaturedRewards();
  }

  @Get('public/category/:category')
  async getPublicRewardsByCategory(
    @Param('category') category: string,
    @Query('limit') limit?: number,
  ): Promise<LoyaltyRewardDto[]> {
    return this.loyaltyRewardsService.findRewardsByCategory(category, limit);
  }

  @Get('public/points-range/:minPoints/:maxPoints')
  async getPublicRewardsByPointsRange(
    @Param('minPoints') minPoints: number,
    @Param('maxPoints') maxPoints: number,
  ): Promise<LoyaltyRewardDto[]> {
    return this.loyaltyRewardsService.findRewardsByPointsRange(minPoints, maxPoints);
  }

  @Get('public/:id')
  async getPublicReward(@Param('id') id: string): Promise<LoyaltyRewardDto> {
    return this.loyaltyRewardsService.findOne(id);
  }

  @Get('public/:id/availability/:customerPoints')
  async getPublicAvailability(
    @Param('id') id: string,
    @Param('customerPoints') customerPoints: number,
  ): Promise<{
    available: boolean;
    canAfford: boolean;
    inStock: boolean;
    validPeriod: boolean;
    message?: string;
  }> {
    return this.loyaltyRewardsService.checkAvailability(id, customerPoints);
  }
}

