import { Module } from '@nestjs/common';
import { HttpModule } from '@nestjs/axios';
import { ClubApiService } from './club-api.service';
import { EmailModule } from '../email/email.module';

@Module({
  imports: [
    HttpModule.register({
      baseURL: process.env.CLUB_API_BASE_URL || undefined,
      timeout: 15000,
      maxRedirects: 5,
      validateStatus: () => true,
    }),
    EmailModule,
  ],
  providers: [ClubApiService],
  exports: [ClubApiService, HttpModule, EmailModule],
})
export class ClubSharedModule {}


