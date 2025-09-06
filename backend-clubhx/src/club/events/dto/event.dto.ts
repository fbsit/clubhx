import { EventStatus } from './create-event.dto';

export class EventDto {
  id: string;
  title: string;
  description?: string;
  category?: string;
  status: EventStatus;
  start_date: Date;
  end_date: Date;
  location?: string;
  address?: string;
  price?: number;
  currency: string;
  max_capacity: number;
  current_registrations: number;
  organizer_name?: string;
  organizer_email?: string;
  organizer_phone?: string;
  image_url?: string;
  banner_url?: string;
  tags?: string[];
  is_featured: boolean;
  is_public: boolean;
  registration_notes?: string;
  created_by?: string;
  updated_by?: string;
  created_at: Date;
  updated_at: Date;
  deleted_at?: Date;
}

export class PaginatedEventListDto {
  count: number;
  next?: string | null;
  previous?: string | null;
  results: EventDto[];
}
