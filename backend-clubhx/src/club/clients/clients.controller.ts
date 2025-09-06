import { Controller, Get, Headers, HttpCode, HttpStatus, Query } from '@nestjs/common';
import { ClientsService } from './clients.service';

@Controller('api/v1/clients')
export class ClientsController {
  constructor(private readonly clientsService: ClientsService) {}

  @Get()
  @HttpCode(HttpStatus.OK)
  async findAll(
    @Query('limit') limit?: number,
    @Query('offset') offset?: number,
    @Headers('authorization') authorization?: string,
  ) {
    const authHeader = authorization
      ? (authorization.startsWith('Bearer ') ? `Token ${authorization.slice(7)}` : authorization)
      : undefined;
    return this.clientsService.fetchClients({ limit, offset }, authHeader);
  }
}


