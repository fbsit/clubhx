import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CustomerAddressEntity } from './address.entity';
import { AddressesService } from './addresses.service';
import { AddressesController } from './addresses.controller';

@Module({
  imports: [TypeOrmModule.forFeature([CustomerAddressEntity])],
  providers: [AddressesService],
  controllers: [AddressesController],
  exports: [AddressesService],
})
export class AddressesModule {}


