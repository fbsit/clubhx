import { Controller, Get } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { WishlistItemEntity } from '../wishlist-items/entity/wishlist-item';

@ApiTags('Wishlist Analytics')
@Controller('api/v1/wishlist')
export class WishlistController {
  constructor(
    @InjectRepository(WishlistItemEntity)
    private readonly wishlistRepo: Repository<WishlistItemEntity>,
  ) {}

  @Get('analytics')
  async getAnalytics() {
    const all = await this.wishlistRepo.find();
    const totalWishlistItems = all.length;
    const usersSet = new Set(all.map((i) => i.userId));
    const totalActiveWishlists = usersSet.size;
    const byProduct = new Map<string, { count: number; name: string; stock: number }>();
    for (const it of all) {
      const key = it.productId;
      const entry = byProduct.get(key) || { count: 0, name: it.product?.name || key, stock: Number(it.product?.stock ?? 0) };
      entry.count += 1;
      byProduct.set(key, entry);
    }
    const topProducts = Array.from(byProduct.entries())
      .map(([id, v]) => ({ id, name: v.name, wishlistCount: v.count, conversionRate: 0, stock: v.stock }))
      .sort((a, b) => b.wishlistCount - a.wishlistCount)
      .slice(0, 10);
    const lowStockHighDemand = topProducts.filter((p) => p.stock <= 5);
    const now = Date.now();
    const last30 = all.filter((i) => now - new Date(i.createdAt).getTime() <= 30 * 24 * 3600 * 1000).length;
    const prev30 = all.filter((i) => {
      const d = new Date(i.createdAt).getTime();
      return now - d > 30 * 24 * 3600 * 1000 && now - d <= 60 * 24 * 3600 * 1000;
    }).length;
    const growth = prev30 > 0 ? Math.round(((last30 - prev30) / prev30) * 100) : (last30 > 0 ? 100 : 0);
    return {
      totalWishlistItems,
      totalActiveWishlists,
      conversionRate: 0,
      topProducts,
      lowStockHighDemand,
      clientsWithLargeWishlists: [],
      categoryInsights: [],
      monthlyTrends: { growth },
    };
  }
}


