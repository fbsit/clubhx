import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { WishlistItemEntity } from './entity/wishlist-item';

@Injectable()
export class WishlistItemsService {
  constructor(@InjectRepository(WishlistItemEntity) private readonly repo: Repository<WishlistItemEntity>) {}

  list(userId: string) {
    return this.repo.find({ where: { userId }, order: { createdAt: 'DESC' } });
  }

  async add(userId: string, product: any, notes?: string) {
    const item = this.repo.create({ userId, productId: product.id, product, notes: notes ?? null });
    try {
      return await this.repo.save(item);
    } catch (e) {
      // If duplicate due to unique, return existing
      const existing = await this.repo.findOne({ where: { userId, productId: product.id } });
      return existing ?? item;
    }
  }

  async remove(userId: string, productId: string) {
    await this.repo.delete({ userId, productId });
  }

  async clear(userId: string) {
    await this.repo.delete({ userId });
  }
}


