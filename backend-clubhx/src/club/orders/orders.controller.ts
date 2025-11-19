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
    this.logger.debug(
      `Incoming GET /api/v1/order with query=${JSON.stringify(query)} auth=${authorization ? 'yes' : 'no'}`,
    );

    const authHeader = authorization
      ? authorization.startsWith('Bearer ')
        ? `Token ${authorization.slice(7)}`
        : authorization
      : undefined;

    // Siempre usamos el mismo endpoint upstream `/api/v1/order/`
    // y dejamos que acepte cualquier query param (incluyendo `client`).
    this.logger.debug(
      `Calling upstream GET /api/v1/order/ with query=${JSON.stringify(query)} authHeader=${
        authHeader ? 'custom' : 'default'
      }`,
    );

    const upstream = await this.api.request('get', '/api/v1/order/', {
      query,
      headers: authHeader ? { Authorization: authHeader } : undefined,
      useAuthHeader: authHeader ? false : undefined,
    });

    this.logger.debug(
      `Upstream /api/v1/order/ responded status=${upstream.status} payloadSample=${JSON.stringify(
        Array.isArray((upstream as any).data)
          ? (upstream as any).data.slice(0, 1)
          : (upstream as any).data && typeof (upstream as any).data === 'object'
          ? { ...((upstream as any).data as any), results: undefined }
          : (upstream as any).data,
      )}`,
    );
    return res.status(upstream.status).send(upstream.data);
  }

  // Removed /my: use /by-client or /by-seller instead

  // New: list orders by client (provider: /api/v1/order/?client=pk&page=int)
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
    const upstream = await this.api.request('get', '/api/v1/order/', {
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


