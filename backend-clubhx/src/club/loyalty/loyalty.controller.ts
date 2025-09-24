import { Controller, Get, Headers, HttpCode, HttpStatus, Query } from '@nestjs/common';
import { LoyaltyModuleService } from './loyalty.service';

@Controller('api/v1/loyalty')
export class LoyaltyController {
  constructor(private readonly loyalty: LoyaltyModuleService) {}

  // Returns total available points for the current user
  @Get('points')
  @HttpCode(HttpStatus.OK)
  async getMyPoints(@Headers('authorization') authorization?: string) {
    // For now, derive a deterministic customer id from the auth header
    // In the future, this should come from the authenticated user context
    const customerId = authorization ? authorization.slice(-16) : 'anonymous';
    const points = await this.loyalty.getPoints(customerId);
    return { points };
  }

  // Upcoming expirations over next N months (default 6)
  @Get('points-expiring')
  @HttpCode(HttpStatus.OK)
  async getMyPointsExpiring(
    @Headers('authorization') authorization?: string,
    @Query('months') months?: string,
  ) {
    const customerId = authorization ? authorization.slice(-16) : 'anonymous';
    const monthsAhead = Math.max(1, Math.min(24, Number(months || 6)));
    const expirations = await this.loyalty.getUpcomingExpirations(customerId, monthsAhead);
    return { months: monthsAhead, expirations };
  }
}


