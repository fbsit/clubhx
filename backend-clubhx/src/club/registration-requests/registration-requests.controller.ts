import { Body, Controller, Get, Param, Post } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { RegistrationRequestsService } from './registration-requests.service';
import { RegistrationEmailService } from './email.service';

@ApiTags('Registration')
@ApiBearerAuth('Bearer')
@Controller('api/v1/registration')
export class RegistrationRequestsController {
  constructor(
    private readonly service: RegistrationRequestsService,
    private readonly email: RegistrationEmailService,
  ) {}

  @Post('submit')
  @ApiOperation({ summary: 'Enviar solicitud de registro' })
  submit(@Body() body: any) {
    return this.service.create(body);
  }

  @Get('requests')
  @ApiOperation({ summary: 'Listar solicitudes de registro' })
  list() {
    return this.service.list();
  }

  @Post('requests/:id/approve')
  @ApiOperation({ summary: 'Aprobar solicitud de registro' })
  approve(@Param('id') id: string, @Body('comments') comments?: string) {
    return this.service.approve(id, comments);
  }

  @Post('requests/:id/reject')
  @ApiOperation({ summary: 'Rechazar solicitud de registro' })
  reject(@Param('id') id: string, @Body('comments') comments?: string) {
    return this.service.reject(id, comments);
  }

  @Post('send-code')
  @ApiOperation({ summary: 'Enviar código de verificación por email (Resend)' })
  async sendVerificationCode(@Body('email') email: string) {
    // Generate a pseudo-random 6-digit code
    const code = Math.floor(100000 + Math.random() * 900000).toString();
    await this.email.sendVerificationCode(email, code);
    // In a real app, persist the code with TTL. For now, return it so frontend can verify.
    return { sent: true, code };
  }
}


