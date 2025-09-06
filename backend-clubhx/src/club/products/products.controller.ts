import {
  Controller,
  Get,
  Param,
  Post,
  Body,
  Query,
  Res,
  Put,
  Patch,
  Delete,
  Headers,
} from '@nestjs/common';
import { Response } from 'express';
import { ClubApiService } from '../shared/club-api.service';
import { PaginationQueryDto } from '../shared/dto/common.dto';

@Controller('api/v1/product')
export class ProductsController {
  constructor(private readonly api: ClubApiService) {}

  @Get('/')
  async list(@Query() query: PaginationQueryDto, @Res() res: Response, @Headers('authorization') authorization?: string) {
    const authHeader = authorization
      ? (authorization.startsWith('Bearer ') ? `Token ${authorization.slice(7)}` : authorization)
      : undefined;
    const upstream = await this.api.request('get', '/api/v1/product/', {
      query,
      headers: authHeader ? { Authorization: authHeader } : undefined,
      useAuthHeader: authHeader ? false : undefined,
    });
    return res.status(upstream.status).send(upstream.data);
  }

  // New: categories and brands proxied under product namespace for convenience
  @Get('/categories')
  async listCategories(@Res() res: Response) {
    const upstream = await this.api.request('get', '/api/v1/prodcategories/', {});
    return res.status(upstream.status).send(upstream.data);
  }

  @Get('/brands')
  async listBrands(@Res() res: Response) {
    const upstream = await this.api.request('get', '/api/v1/prodcategories/', {});
    return res.status(upstream.status).send(upstream.data);
  }

  @Post('/')
  async create(@Body() body: any, @Res() res: Response, @Headers('authorization') authorization?: string) {
    const authHeader = authorization
      ? (authorization.startsWith('Bearer ') ? `Token ${authorization.slice(7)}` : authorization)
      : undefined;
    const upstream = await this.api.request('post', '/api/v1/product/', {
      body,
      headers: authHeader ? { Authorization: authHeader } : undefined,
      useAuthHeader: authHeader ? false : undefined,
    });
    return res.status(upstream.status).send(upstream.data);
  }

  @Get('/:id/')
  async retrieve(@Param('id') id: string, @Res() res: Response, @Headers('authorization') authorization?: string) {
    const authHeader = authorization
      ? (authorization.startsWith('Bearer ') ? `Token ${authorization.slice(7)}` : authorization)
      : undefined;
    const upstream = await this.api.request('get', `/api/v1/product/${id}/`, {
      headers: authHeader ? { Authorization: authHeader } : undefined,
      useAuthHeader: authHeader ? false : undefined,
    });
    return res.status(upstream.status).send(upstream.data);
  }

  @Put('/:id/')
  async update(
    @Param('id') id: string,
    @Body() body: any,
    @Res() res: Response,
    @Headers('authorization') authorization?: string,
  ) {
    const authHeader = authorization
      ? (authorization.startsWith('Bearer ') ? `Token ${authorization.slice(7)}` : authorization)
      : undefined;
    const upstream = await this.api.request('put', `/api/v1/product/${id}/`, {
      body,
      headers: authHeader ? { Authorization: authHeader } : undefined,
      useAuthHeader: authHeader ? false : undefined,
    });
    return res.status(upstream.status).send(upstream.data);
  }

  @Patch('/:id/')
  async partialUpdate(
    @Param('id') id: string,
    @Body() body: any,
    @Res() res: Response,
    @Headers('authorization') authorization?: string,
  ) {
    const authHeader = authorization
      ? (authorization.startsWith('Bearer ') ? `Token ${authorization.slice(7)}` : authorization)
      : undefined;
    const upstream = await this.api.request('patch', `/api/v1/product/${id}/`, {
      body,
      headers: authHeader ? { Authorization: authHeader } : undefined,
      useAuthHeader: authHeader ? false : undefined,
    });
    return res.status(upstream.status).send(upstream.data);
  }

  @Delete('/:id/')
  async destroy(@Param('id') id: string, @Res() res: Response, @Headers('authorization') authorization?: string) {
    const authHeader = authorization
      ? (authorization.startsWith('Bearer ') ? `Token ${authorization.slice(7)}` : authorization)
      : undefined;
    const upstream = await this.api.request('delete', `/api/v1/product/${id}/`, {
      headers: authHeader ? { Authorization: authHeader } : undefined,
      useAuthHeader: authHeader ? false : undefined,
    });
    return res.status(upstream.status).send(upstream.data);
  }
}
