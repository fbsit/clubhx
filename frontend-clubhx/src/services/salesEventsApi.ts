import { fetchJson } from '@/lib/api';

export interface SalesEvent {
  id: string;
  title: string;
  description: string;
  category: string;
  status: string;
  start_date: string;
  end_date: string;
  location: string;
  address: string;
  price: number;
  currency: string;
  max_capacity: number;
  current_registrations: number;
  organizer_name: string;
  organizer_email: string;
  image_url: string;
  is_featured: boolean;
  is_public: boolean;
  tags: string[];
  created_at: string;
  updated_at: string;
  total_customers_registered: number;
  total_attendees: number;
  total_revenue: number;
  pending_payments: number;
  customer_registrations: CustomerRegistration[];
}

export interface CustomerRegistration {
  id: string;
  customer_id: string;
  customer_name: string;
  customer_contact: string;
  customer_email: string;
  registration_date: string;
  attendees_count: number;
  attendance_status: 'registered' | 'attended' | 'no-show';
  payment_status: 'paid' | 'pending' | 'cancelled';
  amount_paid: number;
}

export interface SalesEventsResponse {
  events: SalesEvent[];
  total: number;
  upcoming: number;
  total_revenue: number;
  total_attendees: number;
}

export interface EventRegistrationsResponse {
  event: {
    id: string;
    title: string;
    start_date: string;
    end_date: string;
    location: string;
  };
  registrations: CustomerRegistration[];
  summary: {
    total_registrations: number;
    total_attendees: number;
    total_revenue: number;
    pending_payments: number;
    paid_registrations: number;
  };
}

export const salesEventsApi = {
  async getSalesEvents(): Promise<SalesEventsResponse> {
    return fetchJson('/api/v1/sales/events');
  },

  async getUpcomingEvents(): Promise<SalesEventsResponse> {
    return fetchJson('/api/v1/sales/events/upcoming');
  },

  async getEventDetails(eventId: string): Promise<SalesEvent> {
    return fetchJson(`/api/v1/sales/events/${eventId}`);
  },

  async getEventRegistrations(eventId: string): Promise<EventRegistrationsResponse> {
    return fetchJson(`/api/v1/sales/events/${eventId}/registrations`);
  }
};
