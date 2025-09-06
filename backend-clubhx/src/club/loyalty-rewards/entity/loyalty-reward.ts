import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, Index } from "typeorm";

@Entity("loyalty_rewards")
@Index("IDX_LOYALTY_REWARDS_NAME", ["name"])
@Index("IDX_LOYALTY_REWARDS_CATEGORY", ["category"])
@Index("IDX_LOYALTY_REWARDS_STATUS", ["status"])
@Index("IDX_LOYALTY_REWARDS_POINTS", ["points_required"])
export class LoyaltyReward {
  @PrimaryGeneratedColumn("uuid")
  id: string;

  @Column({ type: "varchar", length: 255 })
  name: string;

  @Column({ type: "text", nullable: true })
  description: string;

  @Column({ type: "varchar", length: 100, nullable: true })
  category: string;

  @Column({ type: "varchar", length: 50, default: "active" })
  status: string; // active, inactive, out_of_stock, discontinued

  @Column({ type: "int" })
  points_required: number;

  @Column({ type: "decimal", precision: 10, scale: 2, nullable: true })
  original_price: number;

  @Column({ type: "varchar", length: 3, default: "USD" })
  currency: string;

  @Column({ type: "int", default: 0 })
  stock_quantity: number;

  @Column({ type: "int", default: 0 })
  redeemed_quantity: number;

  @Column({ type: "int", default: 1 })
  max_redemptions_per_user: number;

  @Column({ type: "varchar", length: 255, nullable: true })
  image_url: string;

  @Column({ type: "varchar", length: 255, nullable: true })
  banner_url: string;

  @Column({ type: "json", nullable: true })
  tags: string[];

  @Column({ type: "boolean", default: false })
  is_featured: boolean;

  @Column({ type: "boolean", default: true })
  is_public: boolean;

  @Column({ type: "date", nullable: true })
  valid_from: Date;

  @Column({ type: "date", nullable: true })
  valid_until: Date;

  @Column({ type: "text", nullable: true })
  redemption_instructions: string;

  @Column({ type: "text", nullable: true })
  terms_conditions: string;

  @Column({ type: "varchar", length: 255, nullable: true })
  created_by: string;

  @Column({ type: "varchar", length: 255, nullable: true })
  updated_by: string;

  @CreateDateColumn({ type: "timestamp", default: () => "CURRENT_TIMESTAMP" })
  created_at: Date;

  @UpdateDateColumn({ type: "timestamp", default: () => "CURRENT_TIMESTAMP", onUpdate: "CURRENT_TIMESTAMP" })
  updated_at: Date;

  @Column({ type: "timestamp", nullable: true })
  deleted_at: Date;
}

