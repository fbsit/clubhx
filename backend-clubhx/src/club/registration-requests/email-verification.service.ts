import { Injectable, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, LessThan } from 'typeorm';
import { EmailVerificationEntity } from './entity/email-verification';
import { RegistrationEmailService } from './email.service';

const CODE_TTL_SECONDS = 5 * 60; // 5 minutos
const MAX_ATTEMPTS = 5;

@Injectable()
export class EmailVerificationService {
  constructor(
    @InjectRepository(EmailVerificationEntity)
    private readonly repo: Repository<EmailVerificationEntity>,
    private readonly emailService: RegistrationEmailService,
  ) {}

  private generateCode(): string {
    return Math.floor(100000 + Math.random() * 900000).toString();
  }

  async sendCode(email: string): Promise<void> {
    const normalizedEmail = email.trim().toLowerCase();
    const code = this.generateCode();
    const now = new Date();
    const expiresAt = new Date(now.getTime() + CODE_TTL_SECONDS * 1000);

    // Limpiar registros expirados para este email
    await this.repo.delete({ email: normalizedEmail, expiresAt: LessThan(now) });

    let record = await this.repo.findOne({ where: { email: normalizedEmail } });
    if (!record) {
      record = this.repo.create({
        email: normalizedEmail,
        code,
        expiresAt,
        attempts: 0,
        verified: false,
      });
    } else {
      record.code = code;
      record.expiresAt = expiresAt;
      record.attempts = 0;
      record.verified = false;
    }
    await this.repo.save(record);

    await this.emailService.sendVerificationCode(normalizedEmail, code);
  }

  async verifyCode(email: string, code: string): Promise<boolean> {
    const normalizedEmail = email.trim().toLowerCase();
    const now = new Date();
    const record = await this.repo.findOne({ where: { email: normalizedEmail } });
    if (!record) return false;
    if (record.expiresAt < now) return false;
    if (record.attempts >= MAX_ATTEMPTS) return false;

    const isValid = record.code === code;
    record.attempts += 1;
    if (isValid) {
      record.verified = true;
    }
    await this.repo.save(record);
    return isValid;
  }

  async ensureEmailVerified(email: string): Promise<void> {
    const normalizedEmail = email.trim().toLowerCase();
    const record = await this.repo.findOne({
      where: { email: normalizedEmail },
      order: { updatedAt: 'DESC' },
    });
    // Una vez verificado, lo consideramos válido aunque haya expirado el código;
    // la expiración solo aplica al momento de ingresar el código.
    if (!record || !record.verified) {
      throw new BadRequestException('Email no verificado');
    }
  }
}



