import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, Index } from 'typeorm';

@Entity('event_registrations')
@Index('IDX_EVENT_REGISTRATIONS_EVENT', ['event_id'])
@Index('IDX_EVENT_REGISTRATIONS_AUTH', ['auth_token_hash'])
export class EventRegistrationEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'uuid' })
  event_id: string;

  @Column({ type: 'varchar', length: 255, nullable: true })
  user_id: string | null;

  @Column({ type: 'varchar', length: 255, nullable: true })
  user_email: string | null;

  @Column({ type: 'varchar', length: 128 })
  auth_token_hash: string; // Identifica al usuario de manera estable basada en su token

  @Column({ type: 'int', default: 1 })
  attendees_count: number;

  @Column({ type: 'varchar', length: 20, default: 'registered' })
  attendance_status: 'registered' | 'attended' | 'no-show';

  @Column({ type: 'text', nullable: true })
  notes: string | null;

  @CreateDateColumn({ type: 'timestamp' })
  created_at: Date;

  @UpdateDateColumn({ type: 'timestamp' })
  updated_at: Date;
}


