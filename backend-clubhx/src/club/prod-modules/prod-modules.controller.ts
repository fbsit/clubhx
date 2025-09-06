import { Body, Controller, Get, Param, Patch, Post, Put, Query, Res } from '@nestjs/common';
import { Response } from 'express';
import { ClubApiService } from '../shared/club-api.service';
import { PaginationQueryDto } from '../shared/dto/common.dto';

@Controller('api/v1/prodmodule')
export class ProdModulesController {
  constructor(private readonly api: ClubApiService) {}

  @Get('/')
  async list(@Query() query: PaginationQueryDto, @Res() res: Response) {
    const upstream = await this.api.request('get', '/api/v1/prodmodule/', { query });
    return res.status(upstream.status).send(upstream.data);
  }

  @Post('/')
  async create(@Body() body: any, @Res() res: Response) {
    const upstream = await this.api.request('post', '/api/v1/prodmodule/', { body });
    return res.status(upstream.status).send(upstream.data);
  }

  @Get('/:id/')
  async retrieve(@Param('id') id: string, @Res() res: Response) {
    const upstream = await this.api.request('get', `/api/v1/prodmodule/${id}/`);
    return res.status(upstream.status).send(upstream.data);
  }

  @Put('/:id/')
  async update(@Param('id') id: string, @Body() body: any, @Res() res: Response) {
    const upstream = await this.api.request('put', `/api/v1/prodmodule/${id}/`, { body });
    return res.status(upstream.status).send(upstream.data);
  }

  @Patch('/:id/')
  async partialUpdate(
    @Param('id') id: string,
    @Body() body: any,
    @Res() res: Response,
  ) {
    const upstream = await this.api.request('patch', `/api/v1/prodmodule/${id}/`, { body });
    return res.status(upstream.status).send(upstream.data);
  }
}


