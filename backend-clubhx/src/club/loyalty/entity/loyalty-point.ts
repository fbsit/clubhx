import { Entity, PrimaryGeneratedColumn, Column, Unique } from "typeorm";

@Entity("loyalty_point")
@Unique("IDX_LOYALTY_CUSTOMER_ID", ["customer_id"])
export class LoyaltyPoint {
  @PrimaryGeneratedColumn("uuid")
  id: string;

  @Column({ type: "int", default: 0 })
  points: number;

  @Column({ type: "text" })
  customer_id: string;
}
