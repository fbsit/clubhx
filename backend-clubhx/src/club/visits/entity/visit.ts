import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, Index } from 'typeorm';

@Entity('visits')
@Index(['date'])
export class VisitEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column('uuid')
  salesPersonId: string;

  @Column({ type: 'varchar', length: 255, nullable: true })
  salesPersonName: string | null;

  @Column('uuid')
  customerId: string;

  @Column({ type: 'varchar', length: 255 })
  customerName: string;

  @Column({ type: 'timestamp' })
  date: Date; // full timestamp

  @Column({ type: 'varchar', length: 5 })
  time: string; // HH:mm

  @Column('int')
  duration: number;

  @Column({ type: 'varchar', length: 16, default: 'pending' })
  status: 'pending' | 'confirmed' | 'completed' | 'cancelled' | 'rescheduled';

  @Column({ type: 'varchar', length: 64 })
  visitType: string;

  @Column({ type: 'varchar', length: 16 })
  meetingType: 'presencial' | 'videollamada';

  @Column({ type: 'text', nullable: true })
  description: string | null;

  @Column({ type: 'varchar', length: 512, nullable: true })
  meetingLink: string | null;

  @Column({ type: 'varchar', length: 8, default: 'medium' })
  priority: 'low' | 'medium' | 'high';

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;
}


