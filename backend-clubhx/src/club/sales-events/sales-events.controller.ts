import { Controller, Get, Param, Headers } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { SalesEventsService } from './sales-events.service';

@ApiTags('Sales Events')
@ApiBearerAuth('Bearer')
@Controller('api/v1/sales/events')
export class SalesEventsController {
  constructor(private readonly service: SalesEventsService) {}

  @Get()
  @ApiOperation({ 
    summary: 'Listar eventos donde están inscritos clientes del vendedor', 
    description: 'Devuelve todos los eventos activos donde los clientes del vendedor autenticado están registrados' 
  })
  async getSalesEvents(@Headers('authorization') auth?: string) {
    return this.service.getSalesEvents(this.getUserIdFromAuth(auth));
  }

  @Get('upcoming')
  @ApiOperation({ 
    summary: 'Listar eventos próximos', 
    description: 'Devuelve eventos futuros donde están inscritos clientes del vendedor' 
  })
  async getUpcomingEvents(@Headers('authorization') auth?: string) {
    return this.service.getUpcomingEvents(this.getUserIdFromAuth(auth));
  }

  @Get(':id')
  @ApiOperation({ 
    summary: 'Obtener detalles de un evento específico', 
    description: 'Devuelve información detallada de un evento incluyendo registros de clientes del vendedor' 
  })
  async getEventDetails(
    @Param('id') eventId: string, 
    @Headers('authorization') auth?: string
  ) {
    return this.service.getEventDetails(this.getUserIdFromAuth(auth), eventId);
  }

  @Get(':id/registrations')
  @ApiOperation({ 
    summary: 'Obtener registros de clientes para un evento', 
    description: 'Devuelve la lista de clientes del vendedor registrados en un evento específico' 
  })
  async getEventRegistrations(
    @Param('id') eventId: string, 
    @Headers('authorization') auth?: string
  ) {
    return this.service.getEventRegistrations(this.getUserIdFromAuth(auth), eventId);
  }

  private getUserIdFromAuth(auth?: string): string {
    if (!auth) return 'default-user';
    return auth.includes('sales@clubhx.com') ? 'sales-user-123' : 'default-user';
  }
}
