import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn } from 'typeorm';

export type RegistrationStatus = 'pending' | 'approved' | 'rejected';

@Entity('registration_requests')
export class RegistrationRequestEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'varchar', length: 255 })
  companyName: string;

  @Column({ type: 'varchar', length: 20 })
  rut: string;

  @Column({ type: 'varchar', length: 64 })
  businessType: string;

  @Column({ type: 'varchar', length: 255 })
  contactName: string;

  @Column({ type: 'varchar', length: 255 })
  email: string;

  @Column({ type: 'varchar', length: 32 })
  phone: string;

  @Column({ type: 'varchar', length: 255 })
  address: string;

  @Column({ type: 'varchar', length: 128 })
  commune: string;

  @Column({ type: 'varchar', length: 128 })
  region: string;

  @Column({ type: 'varchar', length: 16, default: 'pending' })
  status: RegistrationStatus;

  @Column({ type: 'timestamp', nullable: true })
  reviewedAt: Date | null;

  @Column({ type: 'varchar', length: 255, nullable: true })
  reviewedBy: string | null;

  @Column({ type: 'text', nullable: true })
  adminComments: string | null;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}


