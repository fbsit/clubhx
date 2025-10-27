import { Body, Controller, HttpCode, HttpStatus, Post, Res } from '@nestjs/common';
import type { Response } from 'express';
import { ClubApiService } from '../shared/club-api.service';

@Controller()
export class AuthClientRegisterController {
  constructor(private readonly api: ClubApiService) {}

  // Public endpoint to proxy client registration upstream
  @Post('/api/client-register/')
  @HttpCode(HttpStatus.OK)
  async clientRegister(
    @Body()
    body: {
      rut: string;
      name: string;
      email: string;
      phone: string;
      password: string;
    },
    @Res() res: Response,
  ) {
    const upstream = await this.api.request<any>('post', '/api/client-register/', {
      body,
      headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
      useAuthHeader: false,
    });
    return res.status(upstream.status).send(upstream.data);
  }
}


