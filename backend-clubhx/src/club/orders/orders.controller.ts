import { Controller, Get, Param, Delete, Query, Res, Headers, Logger } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { Response } from 'express';
import { ClubApiService } from '../shared/club-api.service';
import { PaginationQueryDto } from '../shared/dto/common.dto';

@ApiTags('Orders')
@ApiBearerAuth('Bearer')
@Controller('api/v1/order')
export class OrdersController {
  private readonly logger = new Logger(OrdersController.name);

  constructor(private readonly api: ClubApiService) {}

  @Get('/')
  @ApiOperation({
    summary: 'Listar pedidos',
    description:
      'Lista pedidos desde upstream. Si se incluye Authorization, serán pedidos del usuario correspondiente. Se puede filtrar por cliente usando ?client={id}.',
  })
  @ApiResponse({ status: 200, description: 'Listado paginado de pedidos' })
  async list(
    @Query() query: PaginationQueryDto & { client?: string },
    @Res() res: Response,
    @Headers('authorization') authorization?: string,
  ) {
    const authHeader = authorization
      ? authorization.startsWith('Bearer ')
        ? `Token ${authorization.slice(7)}`
        : authorization
      : undefined;

    // Construimos la URL final (incluyendo query) para loguear una sola vez
    const qs = new URLSearchParams();
    Object.entries(query ?? {}).forEach(([key, value]) => {
      if (value !== undefined && value !== null && value !== '') {
        qs.append(key, String(value));
      }
    });
    const finalUrl = qs.toString() ? `/api/v1/order?${qs.toString()}` : '/api/v1/order';

    this.logger.debug(
      `Orders upstream request: GET ${finalUrl} authHeader=${authHeader ? 'custom' : 'default'}`,
    );

    const upstream = await this.api.request('get', '/api/v1/order', {
      query,
      headers: authHeader ? { Authorization: authHeader } : undefined,
      useAuthHeader: authHeader ? false : undefined,
    });
    return res.status(upstream.status).send(upstream.data);
  }

  // Removed /my: use /by-client or /by-seller instead

  // New: list orders by client (provider: /api/v1/order?client=pk&page=int)
  @Get('/by-client')
  @ApiOperation({ summary: 'Listar pedidos por cliente', description: 'Lista pedidos para un cliente específico' })
  async listByClient(
    @Query('client') client: string,
    @Res() res: Response,
    @Query('page') page?: string,
    @Headers('authorization') authorization?: string,
  ) {
    const authHeader = authorization
      ? (authorization.startsWith('Bearer ') ? `Token ${authorization.slice(7)}` : authorization)
      : undefined;
    const upstream = await this.api.request('get', '/api/v1/order', {
      query: { client, ...(page ? { page } : {}) },
      headers: authHeader ? { Authorization: authHeader } : undefined,
      useAuthHeader: authHeader ? false : undefined,
    });
    return res.status(upstream.status).send(upstream.data);
  }

  // New: list orders by seller (provider: /api/v1/sellerorders/?seller=pk&page=int)
  @Get('/by-seller')
  @ApiOperation({ summary: 'Listar pedidos por vendedor', description: 'Lista pedidos para un vendedor específico' })
  async listBySeller(
    @Query('seller') seller: string,
    @Res() res: Response,
    @Query('page') page?: string,
    @Headers('authorization') authorization?: string,
  ) {
    const authHeader = authorization
      ? (authorization.startsWith('Bearer ') ? `Token ${authorization.slice(7)}` : authorization)
      : undefined;
    const upstream = await this.api.request('get', '/api/v1/sellerorders/', {
      query: { seller, ...(page ? { page } : {}) },
      headers: authHeader ? { Authorization: authHeader } : undefined,
      useAuthHeader: authHeader ? false : undefined,
    });
    return res.status(upstream.status).send(upstream.data);
  }

  @Get('/:id/')
  @ApiOperation({ summary: 'Obtener pedido', description: 'Obtiene un pedido por ID desde upstream' })
  async retrieve(@Param('id') id: string, @Res() res: Response, @Headers('authorization') authorization?: string) {
    const authHeader = authorization
      ? (authorization.startsWith('Bearer ') ? `Token ${authorization.slice(7)}` : authorization)
      : undefined;
    const upstream = await this.api.request('get', `/api/v1/order/${id}/`, {
      headers: authHeader ? { Authorization: authHeader } : undefined,
      useAuthHeader: authHeader ? false : undefined,
    });
    return res.status(upstream.status).send(upstream.data);
  }

  @Delete('/:id/')
  @ApiOperation({ summary: 'Eliminar pedido', description: 'Elimina un pedido por ID (cuando el upstream lo permite)' })
  async destroy(@Param('id') id: string, @Res() res: Response, @Headers('authorization') authorization?: string) {
    const authHeader = authorization
      ? (authorization.startsWith('Bearer ') ? `Token ${authorization.slice(7)}` : authorization)
      : undefined;
    const upstream = await this.api.request('delete', `/api/v1/order/${id}/`, {
      headers: authHeader ? { Authorization: authHeader } : undefined,
      useAuthHeader: authHeader ? false : undefined,
    });
    return res.status(upstream.status).send(upstream.data);
  }
}


