import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, Unique, Index } from 'typeorm';

@Entity('wishlist_items')
@Unique('UQ_wishlist_user_product', ['userId', 'productId'])
export class WishlistItemEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Index()
  @Column({ type: 'varchar', length: 255 })
  userId: string;

  @Index()
  @Column({ type: 'varchar', length: 255 })
  productId: string;

  @Column({ type: 'jsonb' })
  product: any;

  @Column({ type: 'text', nullable: true })
  notes: string | null;

  @CreateDateColumn()
  createdAt: Date;
}


