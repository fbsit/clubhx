import { Module } from '@nestjs/common';
import { HelpdeskController } from './helpdesk.controller';
import { ClubSharedModule } from '../shared/club-shared.module';

@Module({
  imports: [ClubSharedModule],
  controllers: [HelpdeskController],
})
export class HelpdeskModule {}


