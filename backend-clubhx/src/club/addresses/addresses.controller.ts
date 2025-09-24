import { Body, Controller, Delete, Get, Param, Patch, Post, Query } from '@nestjs/common';
import { AddressesService } from './addresses.service';

@Controller('api/v1/addresses')
export class AddressesController {
  constructor(private readonly service: AddressesService) {}

  @Get()
  list(@Query('customerId') customerId: string) {
    return this.service.list(customerId);
  }

  @Post()
  create(@Body() body: any) {
    const { customerId, ...rest } = body || {};
    return this.service.create(customerId, rest);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() body: any) {
    return this.service.update(id, body);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.service.delete(id);
  }

  @Post(':id/set-default')
  setDefault(@Param('id') id: string) {
    return this.service.setDefault(id);
  }
}


