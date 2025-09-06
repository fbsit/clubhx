import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { VendorEntity } from './entity/vendor';
import { VendorGoalEntity } from './entity/vendor-goal';
import { VendorsService } from './vendors.service';
import { VendorsController } from './vendors.controller';
import { ClubSharedModule } from '../shared/club-shared.module';

@Module({
  imports: [TypeOrmModule.forFeature([VendorEntity, VendorGoalEntity]), ClubSharedModule],
  controllers: [VendorsController],
  providers: [VendorsService],
})
export class VendorsModule {}


