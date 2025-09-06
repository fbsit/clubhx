import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn } from 'typeorm';

@Entity('vendor_goals')
export class VendorGoalEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'uuid' })
  vendorId: string;

  @Column({ type: 'varchar', length: 7 })
  period: string; // YYYY-MM

  @Column({ type: 'bigint' })
  salesTarget: number;

  @CreateDateColumn()
  created_at: Date;
}


