import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, Index } from "typeorm";

@Entity("events")
@Index("IDX_EVENTS_TITLE", ["title"])
@Index("IDX_EVENTS_DATE", ["start_date"])
@Index("IDX_EVENTS_STATUS", ["status"])
@Index("IDX_EVENTS_CATEGORY", ["category"])
export class EventEntity {
  @PrimaryGeneratedColumn("uuid")
  id: string;

  @Column({ type: "varchar", length: 255 })
  title: string;

  @Column({ type: "text", nullable: true })
  description: string;

  @Column({ type: "varchar", length: 100, nullable: true })
  category: string;

  @Column({ type: "varchar", length: 50, default: "active" })
  status: string; // active, cancelled, completed, draft

  @Column({ type: "timestamp" })
  start_date: Date;

  @Column({ type: "timestamp" })
  end_date: Date;

  @Column({ type: "varchar", length: 255, nullable: true })
  location: string;

  @Column({ type: "varchar", length: 255, nullable: true })
  address: string;

  @Column({ type: "decimal", precision: 10, scale: 2, nullable: true })
  price: number;

  @Column({ type: "varchar", length: 3, default: "USD" })
  currency: string;

  @Column({ type: "int", default: 0 })
  max_capacity: number;

  @Column({ type: "int", default: 0 })
  current_registrations: number;

  @Column({ type: "varchar", length: 255, nullable: true })
  organizer_name: string;

  @Column({ type: "varchar", length: 255, nullable: true })
  organizer_email: string;

  @Column({ type: "varchar", length: 20, nullable: true })
  organizer_phone: string;

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

  @Column({ type: "text", nullable: true })
  registration_notes: string;

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
