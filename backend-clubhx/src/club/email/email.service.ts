import { Injectable, Logger } from '@nestjs/common';
import { Resend } from 'resend';

export interface SendEmailParams {
  to: string | string[];
  subject: string;
  html?: string;
  text?: string;
  from?: string;
  replyTo?: string | string[];
}

@Injectable()
export class EmailService {
  private readonly logger = new Logger(EmailService.name);
  private readonly resend: Resend | null;
  private readonly defaultFrom: string;

  constructor() {
    const apiKey = process.env.RESEND_API_KEY || '';
    this.defaultFrom = process.env.RESEND_FROM_EMAIL || 'no-reply@example.com';

    if (!apiKey) {
      this.logger.warn('RESEND_API_KEY is not set. Email sending is disabled.');
      this.resend = null;
    } else {
      this.resend = new Resend(apiKey);
    }
  }

  async sendEmail(params: SendEmailParams): Promise<{ id?: string }> {
    if (!this.resend) {
      this.logger.warn('Attempted to send email but Resend is not configured.');
      return {};
    }

    const { to, subject, html, text, from, replyTo } = params;
    const payload = {
      from: from || this.defaultFrom,
      to,
      subject,
      html,
      text,
      reply_to: replyTo,
    } as any;

    try {
      const result = await this.resend.emails.send(payload);
      if (result?.error) {
        this.logger.error(`Resend error: ${result.error.message}`, result.error.name);
        throw new Error(result.error.message);
      }
      return { id: (result as any)?.data?.id || (result as any)?.id };
    } catch (err: any) {
      const message = err?.message || 'Unknown error sending email';
      this.logger.error(`Failed to send email: ${message}`);
      throw err;
    }
  }
}


