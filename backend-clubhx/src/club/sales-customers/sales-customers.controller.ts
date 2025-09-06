import { Controller, Get, Post, Put, Delete, Body, Param, Query, Headers } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { SalesCustomersService } from './sales-customers.service';

@ApiTags('Sales Customers')
@ApiBearerAuth('Bearer')
@Controller('api/v1/sales/customers')
export class SalesCustomersController {
  constructor(private readonly service: SalesCustomersService) {}

  @Get()
  @ApiOperation({ summary: 'Listar clientes del vendedor', description: 'Devuelve todos los clientes asignados al vendedor autenticado' })
  async listCustomers(
    @Query('status') status?: string,
    @Query('search') search?: string,
    @Headers('authorization') auth?: string
  ) {
    return this.service.listCustomers(this.getUserIdFromAuth(auth), { status, search });
  }

  @Get('active')
  @ApiOperation({ summary: 'Listar clientes activos', description: 'Devuelve solo los clientes activos del vendedor' })
  async getActiveCustomers(@Headers('authorization') auth?: string) {
    return this.service.getActiveCustomers(this.getUserIdFromAuth(auth));
  }

  @Get('prospects')
  @ApiOperation({ summary: 'Listar prospectos', description: 'Devuelve los prospectos del vendedor' })
  async getProspects(@Headers('authorization') auth?: string) {
    return this.service.getProspects(this.getUserIdFromAuth(auth));
  }

  @Get('collections')
  @ApiOperation({ summary: 'Listar clientes con cobranzas pendientes', description: 'Devuelve clientes con montos pendientes de cobro' })
  async getCollectionsCustomers(@Headers('authorization') auth?: string) {
    return this.service.getCollectionsCustomers(this.getUserIdFromAuth(auth));
  }

  @Get(':id')
  @ApiOperation({ summary: 'Obtener detalle del cliente', description: 'Devuelve información detallada de un cliente específico' })
  async getCustomer(@Param('id') id: string, @Headers('authorization') auth?: string) {
    return this.service.getCustomer(this.getUserIdFromAuth(auth), id);
  }

  @Post()
  @ApiOperation({ summary: 'Crear nuevo cliente', description: 'Crea un nuevo cliente asignado al vendedor' })
  async createCustomer(@Body() customerData: any, @Headers('authorization') auth?: string) {
    return this.service.createCustomer(this.getUserIdFromAuth(auth), customerData);
  }

  @Put(':id')
  @ApiOperation({ summary: 'Actualizar cliente', description: 'Actualiza información de un cliente existente' })
  async updateCustomer(@Param('id') id: string, @Body() customerData: any, @Headers('authorization') auth?: string) {
    return this.service.updateCustomer(this.getUserIdFromAuth(auth), id, customerData);
  }

  @Get(':id/orders')
  @ApiOperation({ summary: 'Obtener pedidos del cliente', description: 'Devuelve el historial de pedidos de un cliente' })
  async getCustomerOrders(@Param('id') id: string, @Headers('authorization') auth?: string) {
    return this.service.getCustomerOrders(this.getUserIdFromAuth(auth), id);
  }

  @Get(':id/visits')
  @ApiOperation({ summary: 'Obtener visitas del cliente', description: 'Devuelve el historial de visitas a un cliente' })
  async getCustomerVisits(@Param('id') id: string, @Headers('authorization') auth?: string) {
    return this.service.getCustomerVisits(this.getUserIdFromAuth(auth), id);
  }

  @Get(':id/wishlist')
  @ApiOperation({ summary: 'Obtener wishlist del cliente', description: 'Devuelve los productos en la lista de deseos del cliente' })
  async getCustomerWishlist(@Param('id') id: string, @Headers('authorization') auth?: string) {
    return this.service.getCustomerWishlist(this.getUserIdFromAuth(auth), id);
  }

  private getUserIdFromAuth(auth?: string): string {
    if (!auth) return 'default-user';
    return auth.includes('sales@clubhx.com') ? 'sales-user-123' : 'default-user';
  }
}
