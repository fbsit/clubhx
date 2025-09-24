import { Module } from '@nestjs/common';
import { WishlistController } from './wishlist.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { WishlistItemEntity } from '../wishlist-items/entity/wishlist-item';

@Module({
  imports: [TypeOrmModule.forFeature([WishlistItemEntity])],
  controllers: [WishlistController],
})
export class WishlistModule {}


