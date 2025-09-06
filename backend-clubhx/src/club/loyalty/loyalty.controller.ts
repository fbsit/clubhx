import { Controller, Get, Headers, HttpCode, HttpStatus } from '@nestjs/common';
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
}


