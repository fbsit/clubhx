import { Module } from '@nestjs/common';
import { HttpModule } from '@nestjs/axios';
import { ClubApiService } from './club-api.service';

@Module({
  imports: [
    HttpModule.register({
      baseURL: process.env.CLUB_API_BASE_URL || undefined,
      timeout: 15000,
      maxRedirects: 5,
      validateStatus: () => true,
    }),
  ],
  providers: [ClubApiService],
  exports: [ClubApiService, HttpModule],
})
export class ClubSharedModule {}


