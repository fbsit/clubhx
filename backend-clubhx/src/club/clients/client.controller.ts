import { Controller, Get, Headers, HttpCode, HttpStatus } from '@nestjs/common';
import { ClientsService } from './clients.service';

@Controller('api/v1/client')
export class ClientController {
  constructor(private readonly clientsService: ClientsService) {}

  @Get()
  @HttpCode(HttpStatus.OK)
  async getMe(@Headers('authorization') authorization?: string) {
    const authHeader = authorization
      ? (authorization.startsWith('Bearer ') ? `Token ${authorization.slice(7)}` : authorization)
      : undefined;
    return this.clientsService.fetchCurrentClient(authHeader);
  }

  @Get('me')
  @HttpCode(HttpStatus.OK)
  async getMeAlias(@Headers('authorization') authorization?: string) {
    const authHeader = authorization
      ? (authorization.startsWith('Bearer ') ? `Token ${authorization.slice(7)}` : authorization)
      : undefined;
    return this.clientsService.fetchCurrentClient(authHeader);
  }
}


