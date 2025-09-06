import { Controller, Get, Param, Delete, Query, Res, Headers } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { Response } from 'express';
import { ClubApiService } from '../shared/club-api.service';
import { PaginationQueryDto } from '../shared/dto/common.dto';

@ApiTags('Orders')
@ApiBearerAuth('Bearer')
@Controller('api/v1/order')
export class OrdersController {
  constructor(private readonly api: ClubApiService) {}

  @Get('/')
  @ApiOperation({ summary: 'Listar pedidos', description: 'Lista pedidos desde upstream. Si se incluye Authorization, serán pedidos del usuario correspondiente.' })
  @ApiResponse({ status: 200, description: 'Listado paginado de pedidos' })
  async list(@Query() query: PaginationQueryDto, @Res() res: Response, @Headers('authorization') authorization?: string) {
    const authHeader = authorization
      ? (authorization.startsWith('Bearer ') ? `Token ${authorization.slice(7)}` : authorization)
      : undefined;
    const upstream = await this.api.request('get', '/api/v1/order/', { 
      query,
      headers: authHeader ? { Authorization: authHeader } : undefined,
      useAuthHeader: authHeader ? false : undefined,
    });
    return res.status(upstream.status).send(upstream.data);
  }

  // Client-only orders (same upstream, relies on Authorization to scope results)
  @Get('/my')
  @ApiOperation({ summary: 'Listar mis pedidos', description: 'Lista los pedidos del usuario autenticado (según Authorization)' })
  async listMine(@Query() query: PaginationQueryDto, @Res() res: Response, @Headers('authorization') authorization?: string) {
    const authHeader = authorization
      ? (authorization.startsWith('Bearer ') ? `Token ${authorization.slice(7)}` : authorization)
      : undefined;
    const upstream = await this.api.request('get', '/api/v1/order/', {
      query,
      headers: authHeader ? { Authorization: authHeader } : undefined,
      useAuthHeader: authHeader ? false : undefined,
    });
    return res.status(upstream.status).send(upstream.data);
  }

  // New: list orders by client (provider: /api/v1/clientorders/?client=pk&page=int)
  @Get('/by-client')
  @ApiOperation({ summary: 'Listar pedidos por cliente', description: 'Lista pedidos para un cliente específico' })
  async listByClient(
    @Query('client') client: string,
    @Query('page') page?: string,
    @Res() res: Response,
    @Headers('authorization') authorization?: string,
  ) {
    const authHeader = authorization
      ? (authorization.startsWith('Bearer ') ? `Token ${authorization.slice(7)}` : authorization)
      : undefined;
    const upstream = await this.api.request('get', '/api/v1/clientorders/', {
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
    @Query('page') page?: string,
    @Res() res: Response,
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


