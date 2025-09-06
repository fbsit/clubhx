import { Body, Controller, Delete, Get, Param, Patch, Post, Put, Query, Res } from '@nestjs/common';
import { Response } from 'express';
import { ClubApiService } from '../shared/club-api.service';
import { PaginationQueryDto } from '../shared/dto/common.dto';

@Controller('api/v1/ordermoduleitem')
export class OrderModuleItemsController {
  constructor(private readonly api: ClubApiService) {}

  @Get('/')
  async list(@Query() query: PaginationQueryDto, @Res() res: Response) {
    const upstream = await this.api.request('get', '/api/v1/ordermoduleitem/', { query });
    return res.status(upstream.status).send(upstream.data);
  }

  @Post('/')
  async create(@Body() body: any, @Res() res: Response) {
    const upstream = await this.api.request('post', '/api/v1/ordermoduleitem/', { body });
    return res.status(upstream.status).send(upstream.data);
  }

  @Get('/:id/')
  async retrieve(@Param('id') id: string, @Res() res: Response) {
    const upstream = await this.api.request('get', `/api/v1/ordermoduleitem/${id}/`);
    return res.status(upstream.status).send(upstream.data);
  }

  @Put('/:id/')
  async update(@Param('id') id: string, @Body() body: any, @Res() res: Response) {
    const upstream = await this.api.request('put', `/api/v1/ordermoduleitem/${id}/`, { body });
    return res.status(upstream.status).send(upstream.data);
  }

  @Patch('/:id/')
  async partialUpdate(
    @Param('id') id: string,
    @Body() body: any,
    @Res() res: Response,
  ) {
    const upstream = await this.api.request('patch', `/api/v1/ordermoduleitem/${id}/`, { body });
    return res.status(upstream.status).send(upstream.data);
  }

  @Delete('/:id/')
  async destroy(@Param('id') id: string, @Res() res: Response) {
    const upstream = await this.api.request('delete', `/api/v1/ordermoduleitem/${id}/`);
    return res.status(upstream.status).send(upstream.data);
  }
}


