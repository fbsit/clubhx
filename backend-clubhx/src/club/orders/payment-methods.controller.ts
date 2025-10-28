import { Controller, Get, Headers, Res } from '@nestjs/common';
import { Response } from 'express';
import { ClubApiService } from '../shared/club-api.service';

@Controller('api/v1/paymentmethod')
export class PaymentMethodsController {
  constructor(private readonly api: ClubApiService) {}

  @Get('/')
  async list(@Res() res: Response, @Headers('authorization') authorization?: string) {
    const authHeader = authorization
      ? (authorization.startsWith('Bearer ') ? `Token ${authorization.slice(7)}` : authorization)
      : undefined;
    const upstream = await this.api.request('get', '/api/v1/paymentmethod/', {
      headers: authHeader ? { Authorization: authHeader } : undefined,
      useAuthHeader: authHeader ? false : undefined,
    });
    return res.status(upstream.status).send(upstream.data);
  }
}


