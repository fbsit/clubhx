import { Body, Controller, HttpCode, HttpStatus, Post, Res } from '@nestjs/common';
import { Response } from 'express';
import { ClubApiService } from '../shared/club-api.service';

@Controller('api/v1/auth')
export class AuthPasswordResetController {
  constructor(private readonly api: ClubApiService) {}

  @Post('password-reset')
  @HttpCode(HttpStatus.OK)
  async passwordReset(@Body() body: { email: string }, @Res() res: Response) {
    const params = new URLSearchParams();
    if (body?.email) params.append('email', body.email);

    const upstream = await this.api.request('post', '/accounts/password_reset/', {
      body: params.toString(),
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      useAuthHeader: false,
    });
    return res.status(upstream.status).send(upstream.data);
  }
}



