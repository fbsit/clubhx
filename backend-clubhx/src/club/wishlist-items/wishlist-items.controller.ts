import { Body, Controller, Delete, Get, Headers, HttpCode, HttpStatus, Param, Post } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { WishlistItemsService } from './wishlist-items.service';

@ApiTags('Wishlist')
@ApiBearerAuth('Bearer')
@Controller('api/v1/wishlist/items')
export class WishlistItemsController {
  constructor(private readonly service: WishlistItemsService) {}

  private getUserIdFromAuth(auth?: string): string {
    // For now, derive from Authorization if provided, else 'anonymous'
    return auth ? auth.slice(-16) : 'anonymous';
  }

  @Get()
  @ApiOperation({ summary: 'Listar wishlist del usuario', description: 'Devuelve los ítems de la lista de deseos del usuario autenticado' })
  list(@Headers('authorization') auth?: string) {
    return this.service.list(this.getUserIdFromAuth(auth));
  }

  @Post()
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({ summary: 'Agregar ítem a wishlist' })
  add(@Body('product') product: any, @Body('notes') notes?: string, @Headers('authorization') auth?: string) {
    return this.service.add(this.getUserIdFromAuth(auth), product, notes);
  }

  @Delete(':productId')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: 'Eliminar ítem de wishlist' })
  async remove(@Param('productId') productId: string, @Headers('authorization') auth?: string) {
    await this.service.remove(this.getUserIdFromAuth(auth), productId);
    return {};
  }

  @Delete()
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: 'Limpiar wishlist' })
  async clear(@Headers('authorization') auth?: string) {
    await this.service.clear(this.getUserIdFromAuth(auth));
    return {};
  }
}


