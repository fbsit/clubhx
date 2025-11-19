import { Body, Controller, HttpCode, HttpStatus, Post, Res, BadRequestException } from '@nestjs/common';
import type { Response } from 'express';
import { ClubApiService } from '../shared/club-api.service';
import { EmailVerificationService } from '../registration-requests/email-verification.service';

@Controller()
export class AuthClientRegisterController {
  constructor(
    private readonly api: ClubApiService,
    private readonly emailVerification: EmailVerificationService,
  ) {}

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
      verificationCode?: string;
    },
    @Res() res: Response,
  ) {
    if (!body.email) {
      throw new BadRequestException('Email es requerido para el registro');
    }

    // Validar que el email haya sido verificado recientemente
    await this.emailVerification.ensureEmailVerified(body.email);

    const upstream = await this.api.request<any>('post', '/api/client-register/', {
      body,
      headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
      useAuthHeader: false,
    });
    return res.status(upstream.status).send(upstream.data);
  }
}


