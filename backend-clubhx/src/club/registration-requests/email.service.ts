import { Injectable, Logger } from '@nestjs/common';

type ResendClient = {
  emails: { send: (args: { from: string; to: string[]; subject: string; text?: string; html?: string }) => Promise<void> };
};

@Injectable()
export class RegistrationEmailService {
  private readonly logger = new Logger(RegistrationEmailService.name);
  private client: ResendClient | null = null;

  private getClient(): ResendClient {
    if (this.client) return this.client;
    // Lazy require to avoid build-time dependency if not installed
    const apiKey = process.env.RESEND_API_KEY || 're_7FPeVGJA_2ZuupXBsJaj5qDdVYgPSM4nU';
    // eslint-disable-next-line @typescript-eslint/no-var-requires
    const { Resend } = require('resend');
    this.client = new Resend(apiKey);
    return this.client as unknown as ResendClient;
  }

  async sendVerificationCode(email: string, code: string): Promise<void> {
    try {
      const from = process.env.RESEND_FROM_EMAIL || 'Club HX <no-reply@clubhx.cl>';
      await this.getClient().emails.send({
        from,
        to: [email],
        subject: 'Código de verificación - CLUB HX',
        text: `Tu código de verificación es: ${code}`,
      });
    } catch (e) {
      this.logger.error(`Failed to send verification email to ${email}`, e as any);
      throw e;
    }
  }
}


