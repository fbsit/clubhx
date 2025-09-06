import { Module } from '@nestjs/common';
import { ProdModulesController } from './prod-modules.controller';
import { ClubSharedModule } from '../shared/club-shared.module';

@Module({
  imports: [ClubSharedModule],
  controllers: [ProdModulesController],
})
export class ProdModulesModule {}


