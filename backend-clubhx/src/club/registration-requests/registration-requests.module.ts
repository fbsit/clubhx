import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { RegistrationRequestEntity } from './entity/registration-request';
import { EmailVerificationEntity } from './entity/email-verification';
import { RegistrationRequestsService } from './registration-requests.service';
import { RegistrationRequestsController } from './registration-requests.controller';
import { RegistrationEmailService } from './email.service';
import { EmailVerificationService } from './email-verification.service';

@Module({
  imports: [TypeOrmModule.forFeature([RegistrationRequestEntity, EmailVerificationEntity])],
  controllers: [RegistrationRequestsController],
  providers: [RegistrationRequestsService, RegistrationEmailService, EmailVerificationService],
  exports: [EmailVerificationService],
})
export class RegistrationRequestsModule {}


