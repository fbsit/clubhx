import { Module } from '@nestjs/common';
import { ClientsController } from './clients.controller';
import { ClientController } from './client.controller';
import { ClientsService } from './clients.service';
import { ClubSharedModule } from '../shared/club-shared.module';

@Module({
  imports: [ClubSharedModule],
  controllers: [ClientsController, ClientController],
  providers: [ClientsService],
  exports: [ClientsService],
})
export class ClientsModule {}


