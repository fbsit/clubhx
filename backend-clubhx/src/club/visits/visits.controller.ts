import { Body, Controller, Delete, Get, Param, Patch, Post, Query } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { VisitsService } from './visits.service';

@ApiTags('Visits')
@ApiBearerAuth('Bearer')
@Controller('api/v1/visits')
export class VisitsController {
  constructor(private readonly service: VisitsService) {}

  @Get()
  @ApiOperation({ summary: 'Listar visitas', description: 'Filtra por rango de fechas y opcionalmente por vendedor o cliente' })
  list(
    @Query('from') from?: string, 
    @Query('to') to?: string, 
    @Query('salesPersonId') salesPersonId?: string,
    @Query('customerId') customerId?: string,
    // New provider param name
    @Query('seller') seller?: string,
  ) {
    return this.service.list({ from, to, salesPersonId, customerId, seller });
  }

  @Post()
  create(@Body() body: any) {
    return this.service.create(body);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() body: any) {
    return this.service.update(id, body);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.service.delete(id);
  }
}


