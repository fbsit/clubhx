import { useState, useEffect } from 'react';
import { salesEventsApi, type SalesEvent, type SalesEventsResponse, type EventRegistrationsResponse } from '@/services/salesEventsApi';
import { toast } from 'sonner';

export function useSalesEvents() {
  const [events, setEvents] = useState<SalesEvent[]>([]);
  const [stats, setStats] = useState({
    total: 0,
    upcoming: 0,
    total_revenue: 0,
    total_attendees: 0
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchEvents = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const response = await salesEventsApi.getSalesEvents();
      setEvents(response.events);
      setStats({
        total: response.total,
        upcoming: response.upcoming,
        total_revenue: response.total_revenue,
        total_attendees: response.total_attendees
      });
    } catch (err: any) {
      setError(err?.message || 'Error cargando eventos');
      toast.error('Error cargando eventos', { description: err?.message });
    } finally {
      setLoading(false);
    }
  };

  const fetchUpcomingEvents = async (): Promise<SalesEventsResponse | null> => {
    try {
      return await salesEventsApi.getUpcomingEvents();
    } catch (err: any) {
      toast.error('Error cargando eventos próximos', { description: err?.message });
      return null;
    }
  };

  const getEventDetails = async (eventId: string): Promise<SalesEvent | null> => {
    try {
      return await salesEventsApi.getEventDetails(eventId);
    } catch (err: any) {
      toast.error('Error cargando detalles del evento', { description: err?.message });
      return null;
    }
  };

  const getEventRegistrations = async (eventId: string): Promise<EventRegistrationsResponse | null> => {
    try {
      return await salesEventsApi.getEventRegistrations(eventId);
    } catch (err: any) {
      toast.error('Error cargando registros del evento', { description: err?.message });
      return null;
    }
  };

  const refreshData = () => {
    fetchEvents();
  };

  useEffect(() => {
    fetchEvents();
  }, []);

  return {
    events,
    stats,
    loading,
    error,
    fetchEvents,
    fetchUpcomingEvents,
    getEventDetails,
    getEventRegistrations,
    refreshData
  };
}
