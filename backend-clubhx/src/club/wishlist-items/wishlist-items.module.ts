import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { WishlistItemEntity } from './entity/wishlist-item';
import { WishlistItemsService } from './wishlist-items.service';
import { WishlistItemsController } from './wishlist-items.controller';

@Module({
  imports: [TypeOrmModule.forFeature([WishlistItemEntity])],
  controllers: [WishlistItemsController],
  providers: [WishlistItemsService],
})
export class WishlistItemsModule {}


