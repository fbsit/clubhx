import { fetchJson } from "@/lib/api";

export interface EventRegistration {
  id: string;
  eventId: string;
  userId: string;
  userName: string;
  userEmail: string;
  userAvatar?: string;
  registrationDate: Date;
  attendanceStatus: 'registered' | 'attended' | 'no-show';
  attendeesCount?: number;
  notes?: string;
}

export interface CreateRegistrationDto {
  eventId: string;
  attendeesCount?: number;
  notes?: string;
}

export interface UpdateRegistrationDto {
  attendanceStatus?: 'registered' | 'attended' | 'no-show';
  attendeesCount?: number;
  notes?: string;
}

export interface PaginatedRegistrationListDto {
  count: number;
  next?: string | null;
  previous?: string | null;
  results: EventRegistration[];
}

export interface RegistrationQueryParams {
  page?: number;
  limit?: number;
  eventId?: string;
  userId?: string;
  attendanceStatus?: string;
}

// Servicio de API para inscripciones a eventos
export class EventRegistrationApiService {
  private baseUrl = "/api/v1/events";

  // Obtener inscripciones de un evento
  async getEventRegistrations(eventId: string, params: RegistrationQueryParams = {}): Promise<PaginatedRegistrationListDto> {
    const queryParams = new URLSearchParams();
    
    Object.entries(params).forEach(([key, value]) => {
      if (value !== undefined && value !== null) {
        queryParams.append(key, String(value));
      }
    });

    const url = `${this.baseUrl}/${eventId}/registrations?${queryParams.toString()}`;
    return fetchJson<PaginatedRegistrationListDto>(url);
  }

  // Obtener inscripciones del usuario actual
  async getUserRegistrations(params: RegistrationQueryParams = {}): Promise<PaginatedRegistrationListDto> {
    const queryParams = new URLSearchParams();
    
    Object.entries(params).forEach(([key, value]) => {
      if (value !== undefined && value !== null) {
        queryParams.append(key, String(value));
      }
    });

    const url = `/api/v1/user/event-registrations?${queryParams.toString()}`;
    return fetchJson<PaginatedRegistrationListDto>(url);
  }

  // Inscribirse a un evento
  async registerForEvent(eventId: string, registrationData: CreateRegistrationDto): Promise<EventRegistration> {
    return fetchJson<EventRegistration>(`${this.baseUrl}/${eventId}/register`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(registrationData),
    });
  }

  // Cancelar inscripción a un evento
  async cancelRegistration(eventId: string, registrationId: string): Promise<void> {
    return fetchJson<void>(`${this.baseUrl}/${eventId}/registrations/${registrationId}`, {
      method: "DELETE",
    });
  }

  // Actualizar estado de asistencia (admin)
  async updateAttendanceStatus(
    eventId: string, 
    registrationId: string, 
    updateData: UpdateRegistrationDto
  ): Promise<EventRegistration> {
    return fetchJson<EventRegistration>(`${this.baseUrl}/${eventId}/registrations/${registrationId}`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(updateData),
    });
  }

  // Verificar si el usuario está inscrito a un evento
  async checkUserRegistration(eventId: string): Promise<EventRegistration | null> {
    try {
      return await fetchJson<EventRegistration>(`${this.baseUrl}/${eventId}/my-registration`);
    } catch (error) {
      if (error instanceof Error && error.message.includes('404')) {
        return null;
      }
      throw error;
    }
  }

  // Obtener estadísticas de inscripciones de un evento
  async getEventRegistrationStats(eventId: string): Promise<{
    totalRegistrations: number;
    attendedCount: number;
    noShowCount: number;
    pendingCount: number;
  }> {
    return fetchJson(`${this.baseUrl}/${eventId}/registration-stats`);
  }
}

// Instancia singleton del servicio
export const eventRegistrationApi = new EventRegistrationApiService();
