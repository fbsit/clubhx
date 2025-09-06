import { Body, Controller, Delete, Get, Param, Patch, Post, Put } from '@nestjs/common';
import { ShippingZonesService } from './shipping-zones.service';

@Controller('api/v1/shipping-zones')
export class ShippingZonesController {
  constructor(private readonly service: ShippingZonesService) {}

  @Get()
  list() {
    return this.service.list();
  }

  @Post()
  create(@Body() body: any) {
    return this.service.create(body);
  }

  @Put(':id')
  update(@Param('id') id: string, @Body() body: any) {
    return this.service.update(id, body);
  }

  @Patch(':id')
  toggle(@Param('id') id: string, @Body('active') active: boolean) {
    return this.service.toggle(id, active);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.service.delete(id);
  }
}


