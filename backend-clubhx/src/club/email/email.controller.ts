import { Body, Controller, HttpCode, HttpStatus, Post } from '@nestjs/common';
import { EmailService } from './email.service';

@Controller('api/v1/email')
export class EmailController {
  constructor(private readonly email: EmailService) {}

  @Post('send')
  @HttpCode(HttpStatus.OK)
  async send(
    @Body()
    body: {
      to: string | string[];
      subject: string;
      html?: string;
      text?: string;
      from?: string;
      replyTo?: string | string[];
    },
  ) {
    const result = await this.email.sendEmail(body);
    return { ok: true, id: result.id };
  }
}


