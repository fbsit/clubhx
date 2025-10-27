import { Body, Controller, HttpCode, HttpStatus, Post, Res } from '@nestjs/common';
import type { Response } from 'express';
import { ClubApiService } from '../shared/club-api.service';

@Controller()
export class AuthClientLoginController {
  constructor(private readonly api: ClubApiService) {}

  // Public endpoint to proxy client login upstream
  @Post('/api/client-login/')
  @HttpCode(HttpStatus.OK)
  async clientLogin(
    @Body()
    body: {
      identification: string;
      secret: string;
    },
    @Res() res: Response,
  ) {
    const upstream = await this.api.request<any>('post', '/api/client-login/', {
      body,
      headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
      useAuthHeader: false,
    });
    return res.status(upstream.status).send(upstream.data);
  }
}



