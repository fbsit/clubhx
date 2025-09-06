import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { RegistrationRequestEntity } from './entity/registration-request';
import { RegistrationRequestsService } from './registration-requests.service';
import { RegistrationRequestsController } from './registration-requests.controller';
import { RegistrationEmailService } from './email.service';

@Module({
  imports: [TypeOrmModule.forFeature([RegistrationRequestEntity])],
  controllers: [RegistrationRequestsController],
  providers: [RegistrationRequestsService, RegistrationEmailService],
})
export class RegistrationRequestsModule {}


