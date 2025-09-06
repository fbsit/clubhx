import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, Index } from 'typeorm';

export type RedemptionStatus = 'pending' | 'delivered';

@Entity('loyalty_redemptions')
@Index('IDX_LOYALTY_REDEMPTIONS_CUSTOMER', ['customer_id'])
@Index('IDX_LOYALTY_REDEMPTIONS_REWARD', ['reward_id'])
export class LoyaltyRedemption {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'uuid' })
  reward_id: string;

  @Column({ type: 'varchar', length: 255 })
  customer_id: string;

  @Column({ type: 'int', default: 0 })
  points_spent: number;

  @Column({ type: 'varchar', length: 20, default: 'pending' })
  status: RedemptionStatus;

  @CreateDateColumn({ type: 'timestamp' })
  created_at: Date;

  @UpdateDateColumn({ type: 'timestamp' })
  updated_at: Date;

  @Column({ type: 'timestamp', nullable: true })
  delivered_at: Date | null;
}


