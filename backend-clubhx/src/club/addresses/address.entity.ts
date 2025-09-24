import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, Index } from 'typeorm';

@Entity('customer_addresses')
@Index(['customerId', 'isDefault'])
export class CustomerAddressEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'varchar', length: 64 })
  customerId: string;

  @Column({ type: 'varchar', length: 128 })
  name: string; // Contact name or label

  @Column({ type: 'varchar', length: 24, nullable: true })
  phone: string | null;

  @Column({ type: 'varchar', length: 256 })
  street: string;

  @Column({ type: 'varchar', length: 32, nullable: true })
  number: string | null;

  @Column({ type: 'varchar', length: 64, nullable: true })
  apartment: string | null;

  @Column({ type: 'varchar', length: 64 })
  city: string;

  @Column({ type: 'varchar', length: 64 })
  commune: string;

  @Column({ type: 'varchar', length: 64 })
  region: string;

  @Column({ type: 'varchar', length: 64, default: 'Chile' })
  country: string;

  @Column({ type: 'varchar', length: 16, nullable: true })
  zip: string | null;

  @Column({ type: 'boolean', default: false })
  isDefault: boolean;

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;
}


