import { Module } from '@nestjs/common';
import { CatalogController } from './catalog.controller';
import { ClubSharedModule } from '../shared/club-shared.module';

@Module({
  imports: [ClubSharedModule],
  controllers: [CatalogController],
})
export class CatalogModule {}


