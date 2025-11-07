import { fetchJson } from "@/lib/api";

// Tipos de eventos que coinciden con el backend
export interface EventDto {
  id: string;
  title: string;
  description?: string;
  category?: string;
  status: string;
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

export interface CreateEventDto {
  title: string;
  description?: string;
  category?: string;
  status?: string;
  start_date: string;
  end_date: string;
  location?: string;
  address?: string;
  price?: number;
  currency?: string;
  max_capacity?: number;
  organizer_name?: string;
  organizer_email?: string;
  organizer_phone?: string;
  image_url?: string;
  banner_url?: string;
  tags?: string[];
  is_featured?: boolean;
  is_public?: boolean;
  registration_notes?: string;
}

export interface UpdateEventDto extends Partial<CreateEventDto> {}

export interface PaginatedEventListDto {
  count: number;
  next?: string | null;
  previous?: string | null;
  results: EventDto[];
}

export interface EventQueryParams {
  page?: number;
  limit?: number;
  search?: string;
  category?: string;
  status?: string;
  startDate?: string;
  endDate?: string;
  isFeatured?: boolean;
  isPublic?: boolean;
}

// Servicio de API para eventos
export class EventsApiService {
  private baseUrl = "/api/v1/events";

  // Obtener todos los eventos con paginación y filtros
  async getEvents(params: EventQueryParams = {}): Promise<PaginatedEventListDto> {
    const queryParams = new URLSearchParams();
    
    Object.entries(params).forEach(([key, value]) => {
      if (value !== undefined && value !== null) {
        queryParams.append(key, String(value));
      }
    });

    const url = `${this.baseUrl}?${queryParams.toString()}`;
    return fetchJson<PaginatedEventListDto>(url);
  }

  // Obtener un evento por ID
  async getEvent(id: string): Promise<EventDto> {
    return fetchJson<EventDto>(`${this.baseUrl}/${id}`);
  }

  // Crear un nuevo evento
  async createEvent(eventData: CreateEventDto): Promise<EventDto> {
    return fetchJson<EventDto>(this.baseUrl, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(eventData),
    });
  }

  // Actualizar un evento existente
  async updateEvent(id: string, eventData: UpdateEventDto): Promise<EventDto> {
    return fetchJson<EventDto>(`${this.baseUrl}/${id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(eventData),
    });
  }

  // Eliminar un evento (soft delete)
  async deleteEvent(id: string): Promise<void> {
    return fetchJson<void>(`${this.baseUrl}/${id}`, {
      method: "DELETE",
    });
  }

  // Obtener eventos destacados
  async getFeaturedEvents(limit: number = 5): Promise<EventDto[]> {
    const params: EventQueryParams = {
      isFeatured: true,
      isPublic: true,
      limit,
    };
    const response = await this.getEvents(params);
    return response.results;
  }

  // Obtener eventos públicos próximos
  async getUpcomingPublicEvents(limit: number = 10): Promise<EventDto[]> {
    const now = new Date().toISOString();
    const params: EventQueryParams = {
      isPublic: true,
      startDate: now,
      limit,
    };
    const response = await this.getEvents(params);
    return response.results;
  }

  // Buscar eventos por texto
  async searchEvents(searchTerm: string, limit: number = 10): Promise<EventDto[]> {
    const params: EventQueryParams = {
      search: searchTerm,
      limit,
    };
    const response = await this.getEvents(params);
    return response.results;
  }
}

// Instancia singleton del servicio
export const eventsApi = new EventsApiService();
