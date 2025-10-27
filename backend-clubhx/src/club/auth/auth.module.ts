import { Module } from '@nestjs/common';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { ClubSharedModule } from '../shared/club-shared.module';
import { AuthPasswordResetController } from './auth.password-reset.controller';
import { AuthClientRegisterController } from './auth.client-register.controller';
import { AuthClientLoginController } from './auth.client-login.controller';

@Module({
  imports: [ClubSharedModule],
  controllers: [AuthController, AuthPasswordResetController, AuthClientRegisterController, AuthClientLoginController],
  providers: [AuthService],
  exports: [AuthService],
})
export class AuthModule {}


