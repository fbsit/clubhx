import { Body, Controller, Post, Put, Res, Headers } from '@nestjs/common';
import { Response } from 'express';
import { ClubApiService } from '../shared/club-api.service';

@Controller()
export class OrdersCreateController {
  constructor(private readonly api: ClubApiService) {}

  @Post('/api/v1/order-create/')
  async create(@Body() body: any, @Res() res: Response, @Headers('authorization') authorization?: string) {
    const authHeader = authorization
      ? (authorization.startsWith('Bearer ') ? `Token ${authorization.slice(7)}` : authorization)
      : undefined;
    const upstream = await this.api.request('post', '/api/v1/order-create/', { 
      body,
      headers: authHeader ? { Authorization: authHeader } : undefined,
      useAuthHeader: authHeader ? false : undefined,
    });
    return res.status(upstream.status).send(upstream.data);
  }

  @Post('/api/v1/order-create-no-store/')
  async createNoStore(@Body() body: any, @Res() res: Response, @Headers('authorization') authorization?: string) {
    const authHeader = authorization
      ? (authorization.startsWith('Bearer ') ? `Token ${authorization.slice(7)}` : authorization)
      : undefined;
    const upstream = await this.api.request('post', '/api/v1/order-create-no-store/', { 
      body,
      headers: authHeader ? { Authorization: authHeader } : undefined,
      useAuthHeader: authHeader ? false : undefined,
    });
    return res.status(upstream.status).send(upstream.data);
  }

  @Put('/api/v1/order-create-no-store/')
  async updateNoStore(@Body() body: any, @Res() res: Response, @Headers('authorization') authorization?: string) {
    const authHeader = authorization
      ? (authorization.startsWith('Bearer ') ? `Token ${authorization.slice(7)}` : authorization)
      : undefined;
    const upstream = await this.api.request('put', '/api/v1/order-create-no-store/', { 
      body,
      headers: authHeader ? { Authorization: authHeader } : undefined,
      useAuthHeader: authHeader ? false : undefined,
    });
    return res.status(upstream.status).send(upstream.data);
  }
}


