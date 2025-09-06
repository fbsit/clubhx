import { Body, Controller, Delete, Get, Param, Post, Put, Res } from '@nestjs/common';
import { Response } from 'express';
import { ClubApiService } from '../shared/club-api.service';

type Category = { id: string; name: string; description?: string; icon?: string; order?: number; productCount?: number };
type Brand = { id: string; name: string; productCount?: number };

// In-memory placeholder store for categories/brands until real entities are defined
const categories: Category[] = [];
const brands: Brand[] = [];

@Controller('api/v1/catalog')
export class CatalogController {
  constructor(private readonly api: ClubApiService) {}

  @Get('categories')
  async listCategories(@Res() res: Response) {
    // Proxy to provider prodcategories (also serves brands)
    const upstream = await this.api.request('get', '/api/v1/prodcategories/', {});
    return res.status(upstream.status).send(upstream.data);
  }

  @Post('categories')
  createCategory(@Body() body: Omit<Category, 'id'>) {
    const c: Category = { id: `${Date.now()}`, ...body };
    categories.push(c);
    return c;
  }

  @Put('categories/:id')
  updateCategory(@Param('id') id: string, @Body() body: Partial<Category>) {
    const i = categories.findIndex((c) => c.id === id);
    if (i === -1) return { id, ...body };
    categories[i] = { ...categories[i], ...body };
    return categories[i];
  }

  @Delete('categories/:id')
  deleteCategory(@Param('id') id: string) {
    const i = categories.findIndex((c) => c.id === id);
    if (i !== -1) categories.splice(i, 1);
    return {};
  }

  @Get('brands')
  async listBrands(@Res() res: Response) {
    // Same upstream as categories
    const upstream = await this.api.request('get', '/api/v1/prodcategories/', {});
    return res.status(upstream.status).send(upstream.data);
  }
}


