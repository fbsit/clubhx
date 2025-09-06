import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { VisitEntity } from './entity/visit';
import { VisitsService } from './visits.service';
import { VisitsController } from './visits.controller';
import { ClubSharedModule } from '../shared/club-shared.module';

@Module({
  imports: [TypeOrmModule.forFeature([VisitEntity]), ClubSharedModule],
  controllers: [VisitsController],
  providers: [VisitsService],
})
export class VisitsModule {}


