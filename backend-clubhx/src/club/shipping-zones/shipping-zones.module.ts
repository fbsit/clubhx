import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ShippingZoneEntity } from './entity/shipping-zone';
import { ShippingZonesService } from './shipping-zones.service';
import { ShippingZonesController } from './shipping-zones.controller';

@Module({
  imports: [TypeOrmModule.forFeature([ShippingZoneEntity])],
  controllers: [ShippingZonesController],
  providers: [ShippingZonesService],
})
export class ShippingZonesModule {}


