import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, Index } from "typeorm";

@Entity("loyalty_transactions")
@Index("IDX_LOYALTY_TRANSACTIONS_CUSTOMER", ["customer_id"])
@Index("IDX_LOYALTY_TRANSACTIONS_ORDER", ["order_id"])
export class LoyaltyTransaction {
  @PrimaryGeneratedColumn("uuid")
  id: string;

  @Column({ type: "varchar", length: 255 })
  customer_id: string;

  @Column({ type: "int" })
  points_delta: number; // positive for earning, negative for spending

  @Column({ type: "varchar", length: 255, nullable: true })
  order_id: string;

  @Column({ type: "json", nullable: true })
  metadata: any;

  @CreateDateColumn({ type: "timestamp", default: () => "CURRENT_TIMESTAMP" })
  created_at: Date;
}
