import { Module } from '@nestjs/common';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { ClubSharedModule } from '../shared/club-shared.module';
import { AuthPasswordResetController } from './auth.password-reset.controller';

@Module({
  imports: [ClubSharedModule],
  controllers: [AuthController, AuthPasswordResetController],
  providers: [AuthService],
  exports: [AuthService],
})
export class AuthModule {}


