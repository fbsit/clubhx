import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, Index, Unique } from 'typeorm';

@Entity('user_settings')
@Index('IDX_USER_SETTINGS_AUTH', ['auth_token_hash'])
@Unique('UQ_USER_SETTINGS_AUTH', ['auth_token_hash'])
export class UserSettingsEntity {
	@PrimaryGeneratedColumn('uuid')
	id: string;

	@Column({ type: 'varchar', length: 128 })
	auth_token_hash: string;

	@Column({ type: 'varchar', length: 255, nullable: true })
	user_email: string | null;

	@Column({ type: 'jsonb', nullable: true, default: () => "'{}'" })
	notifications: any | null;

	@Column({ type: 'jsonb', nullable: true, default: () => "'{}'" })
	preferences: any | null;

	@CreateDateColumn({ type: 'timestamp' })
	created_at: Date;

	@UpdateDateColumn({ type: 'timestamp' })
	updated_at: Date;
}
