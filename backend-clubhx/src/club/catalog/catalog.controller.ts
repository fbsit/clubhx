import { Body, Controller, Delete, Get, Headers, Param, Post, Put, Res } from '@nestjs/common';
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
  async listCategories(@Res() res: Response, @Headers('authorization') authorization?: string) {
    // Proxy to provider prodcategories (also serves brands)
    // If an Authorization header is present, forward it transforming Bearer -> Token.
    // Otherwise, ClubApiService will fall back to CLUB_API_TOKEN (defaultAuthHeader).
    const authHeader = authorization
      ? authorization.startsWith('Bearer ')
        ? `Token ${authorization.slice(7)}`
        : authorization
      : undefined;

    const upstream = await this.api.request<any>('get', '/api/v1/prodcategories/', {
      headers: authHeader ? { Authorization: authHeader } : undefined,
      useAuthHeader: authHeader ? false : undefined,
    });
    const raw = upstream.data as any;

    // If upstream already returns an array, forward directly for backward compatibility
    if (Array.isArray(raw)) {
      return res.status(upstream.status).send(raw);
    }

    const familyNames: string[] = Array.isArray(raw.family_names) ? raw.family_names : [];

    // Normalize provider data into a flat list of "categories" based on family_names
    const normalizedCategories: Category[] = familyNames
      .filter((name) => typeof name === 'string' && name.trim().length > 0)
      .map((name, index) => ({
        id: String(index),
        name: name.trim(),
        description: undefined,
        icon: undefined,
        order: index,
        productCount: 0,
      }));

    const payload = {
      categories: normalizedCategories,
      brands: raw.brands ?? [],
      familyNames: raw.family_names ?? [],
      subfamilyNames: raw.subfamily_name_list ?? [],
      subsubfamilyNames: raw.subsubfamily_name_list ?? [],
    };

    return res.status(upstream.status).send(payload);
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
  async listBrands(@Res() res: Response, @Headers('authorization') authorization?: string) {
    // Same upstream as categories
    const authHeader = authorization
      ? authorization.startsWith('Bearer ')
        ? `Token ${authorization.slice(7)}`
        : authorization
      : undefined;

    const upstream = await this.api.request('get', '/api/v1/prodcategories/', {
      headers: authHeader ? { Authorization: authHeader } : undefined,
      useAuthHeader: authHeader ? false : undefined,
    });
    return res.status(upstream.status).send(upstream.data);
  }
}


