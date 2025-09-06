import { IsString, IsOptional, IsDateString, IsNumber, IsBoolean, IsArray, IsEnum, Min, MaxLength } from 'class-validator';

export enum EventStatus {
  ACTIVE = 'active',
  CANCELLED = 'cancelled',
  COMPLETED = 'completed',
  DRAFT = 'draft'
}

export class CreateEventDto {
  @IsString()
  @MaxLength(255)
  title: string;

  @IsOptional()
  @IsString()
  description?: string;

  @IsOptional()
  @IsString()
  @MaxLength(100)
  category?: string;

  @IsOptional()
  @IsEnum(EventStatus)
  status?: EventStatus = EventStatus.DRAFT;

  @IsDateString()
  start_date: string;

  @IsDateString()
  end_date: string;

  @IsOptional()
  @IsString()
  @MaxLength(255)
  location?: string;

  @IsOptional()
  @IsString()
  @MaxLength(255)
  address?: string;

  @IsOptional()
  @IsNumber()
  @Min(0)
  price?: number;

  @IsOptional()
  @IsString()
  @MaxLength(3)
  currency?: string = 'USD';

  @IsOptional()
  @IsNumber()
  @Min(0)
  max_capacity?: number = 0;

  @IsOptional()
  @IsString()
  @MaxLength(255)
  organizer_name?: string;

  @IsOptional()
  @IsString()
  @MaxLength(255)
  organizer_email?: string;

  @IsOptional()
  @IsString()
  @MaxLength(20)
  organizer_phone?: string;

  @IsOptional()
  @IsString()
  @MaxLength(255)
  image_url?: string;

  @IsOptional()
  @IsString()
  @MaxLength(255)
  banner_url?: string;

  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  tags?: string[];

  @IsOptional()
  @IsBoolean()
  is_featured?: boolean = false;

  @IsOptional()
  @IsBoolean()
  is_public?: boolean = true;

  @IsOptional()
  @IsString()
  registration_notes?: string;
}
