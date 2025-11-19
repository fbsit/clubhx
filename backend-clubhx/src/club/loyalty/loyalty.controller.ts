import { Controller, Get, Headers, HttpCode, HttpStatus, Query } from '@nestjs/common';
import { LoyaltyModuleService } from './loyalty.service';

@Controller('api/v1/loyalty')
export class LoyaltyController {
  constructor(private readonly loyalty: LoyaltyModuleService) {}

  // Returns total available points for the current user
  @Get('points')
  @HttpCode(HttpStatus.OK)
  async getMyPoints(@Headers('authorization') authorization?: string, @Query('client') client?: string) {
    const customerId = client || (authorization ? authorization.slice(-16) : 'anonymous');
    const points = await this.loyalty.getPoints(customerId);
    return { points };
  }

  // Upcoming expirations over next N months (default 6)
  @Get('points-expiring')
  @HttpCode(HttpStatus.OK)
  async getMyPointsExpiring(
    @Headers('authorization') authorization?: string,
    @Query('months') months?: string,
    @Query('client') client?: string,
  ) {
    const customerId = client || (authorization ? authorization.slice(-16) : 'anonymous');
    const monthsAhead = Math.max(1, Math.min(24, Number(months || 6)));
    const expirations = await this.loyalty.getUpcomingExpirations(customerId, monthsAhead);
    return { months: monthsAhead, expirations };
  }

  @Get('points-earned')
  @HttpCode(HttpStatus.OK)
  async getPointsEarned(
    @Headers('authorization') authorization?: string,
    @Query('months') months?: string,
    @Query('client') client?: string,
  ) {
    const customerId = client || (authorization ? authorization.slice(-16) : 'anonymous');
    const monthsInt = Math.max(1, Math.min(24, Number(months || 12)));
    const earned = await this.loyalty.getPointsEarnedLastMonths(customerId, monthsInt);
    return { months: monthsInt, earned };
  }
}


