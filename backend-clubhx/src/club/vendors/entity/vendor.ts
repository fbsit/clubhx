import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn } from 'typeorm';

@Entity('vendors')
export class VendorEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'varchar', length: 255 })
  name: string;

  @Column({ type: 'varchar', length: 255 })
  email: string;

  @Column({ type: 'varchar', length: 100, nullable: true })
  region: string | null;

  @Column({ type: 'int', default: 0 })
  customers: number;

  @Column({ type: 'bigint', default: 0 })
  totalSales: number;

  @Column({ type: 'bigint', default: 0 })
  salesTarget: number;

  @Column({ type: 'int', default: 0 })
  targetCompletion: number;

  @Column({ type: 'varchar', length: 16, default: 'active' })
  status: 'active' | 'inactive';

  @Column({ type: 'varchar', length: 512, nullable: true })
  avatar: string | null;

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;
}


