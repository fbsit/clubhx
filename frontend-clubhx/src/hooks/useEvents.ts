import { useState, useEffect, useCallback } from 'react';
import { eventsApi, EventDto, CreateEventDto, UpdateEventDto, EventQueryParams } from '@/services/eventsApi';
import { adaptEventToCreateDto, adaptEventToUpdateDto } from '@/utils/eventAdapter';
import { toast } from 'sonner';

export interface UseEventsReturn {
  events: EventDto[];
  loading: boolean;
  error: string | null;
  totalCount: number;
  hasNextPage: boolean;
  hasPreviousPage: boolean;
  currentPage: number;
  fetchEvents: (params?: EventQueryParams) => Promise<void>;
  fetchEvent: (id: string) => Promise<EventDto | null>;
  createEvent: (eventData: CreateEventDto) => Promise<EventDto | null>;
  updateEvent: (id: string, eventData: UpdateEventDto) => Promise<EventDto | null>;
  deleteEvent: (id: string) => Promise<boolean>;
  refreshEvents: () => Promise<void>;
}

export function useEvents(initialParams: EventQueryParams = {}): UseEventsReturn {
  const [events, setEvents] = useState<EventDto[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [totalCount, setTotalCount] = useState(0);
  const [hasNextPage, setHasNextPage] = useState(false);
  const [hasPreviousPage, setHasPreviousPage] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);

  const fetchEvents = useCallback(async (params: EventQueryParams = {}) => {
    try {
      setLoading(true);
      setError(null);
      
      const response = await eventsApi.getEvents({
        ...initialParams,
        ...params,
      });
      
      setEvents(response.results);
      setTotalCount(response.count);
      setHasNextPage(!!response.next);
      setHasPreviousPage(!!response.previous);
      setCurrentPage(params.page || 1);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Error al cargar eventos';
      setError(errorMessage);
      toast.error(errorMessage);
    } finally {
      setLoading(false);
    }
  }, []);

  const fetchEvent = useCallback(async (id: string): Promise<EventDto | null> => {
    try {
      setLoading(true);
      setError(null);
      
      const event = await eventsApi.getEvent(id);
      return event;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Error al cargar el evento';
      setError(errorMessage);
      toast.error(errorMessage);
      return null;
    } finally {
      setLoading(false);
    }
  }, []);

  const createEvent = useCallback(async (eventData: any): Promise<EventDto | null> => {
    try {
      setLoading(true);
      setError(null);
      
      const createDto = adaptEventToCreateDto(eventData);
      const newEvent = await eventsApi.createEvent(createDto);
      
      // Actualizar la lista de eventos
      setEvents(prev => [newEvent, ...prev]);
      setTotalCount(prev => prev + 1);
      
      toast.success('Evento creado exitosamente');
      return newEvent;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Error al crear el evento';
      setError(errorMessage);
      toast.error(errorMessage);
      return null;
    } finally {
      setLoading(false);
    }
  }, []);

  const updateEvent = useCallback(async (id: string, eventData: any): Promise<EventDto | null> => {
    try {
      setLoading(true);
      setError(null);
      
      const updateDto = adaptEventToUpdateDto(eventData);
      const updatedEvent = await eventsApi.updateEvent(id, updateDto);
      
      // Actualizar el evento en la lista
      setEvents(prev => prev.map(event => 
        event.id === id ? updatedEvent : event
      ));
      
      toast.success('Evento actualizado exitosamente');
      return updatedEvent;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Error al actualizar el evento';
      setError(errorMessage);
      toast.error(errorMessage);
      return null;
    } finally {
      setLoading(false);
    }
  }, []);

  const deleteEvent = useCallback(async (id: string): Promise<boolean> => {
    try {
      setLoading(true);
      setError(null);
      
      await eventsApi.deleteEvent(id);
      
      // Remover el evento de la lista
      setEvents(prev => prev.filter(event => event.id !== id));
      setTotalCount(prev => prev - 1);
      
      toast.success('Evento eliminado exitosamente');
      return true;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Error al eliminar el evento';
      setError(errorMessage);
      toast.error(errorMessage);
      return false;
    } finally {
      setLoading(false);
    }
  }, []);

  const refreshEvents = useCallback(async () => {
    await fetchEvents({ page: currentPage });
  }, [fetchEvents, currentPage]);

  // Cargar eventos iniciales
  useEffect(() => {
    fetchEvents();
  }, [fetchEvents]);

  return {
    events,
    loading,
    error,
    totalCount,
    hasNextPage,
    hasPreviousPage,
    currentPage,
    fetchEvents,
    fetchEvent,
    createEvent,
    updateEvent,
    deleteEvent,
    refreshEvents,
  };
}

// Hook específico para eventos públicos (clientes)
export function usePublicEvents(limit: number = 10) {
  const [events, setEvents] = useState<EventDto[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchPublicEvents = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      
      const publicEvents = await eventsApi.getUpcomingPublicEvents(limit);
      setEvents(publicEvents);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Error al cargar eventos';
      setError(errorMessage);
      toast.error(errorMessage);
    } finally {
      setLoading(false);
    }
  }, [limit]);

  const fetchFeaturedEvents = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      
      const featuredEvents = await eventsApi.getFeaturedEvents(limit);
      setEvents(featuredEvents);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Error al cargar eventos destacados';
      setError(errorMessage);
      toast.error(errorMessage);
    } finally {
      setLoading(false);
    }
  }, [limit]);

  const searchEvents = useCallback(async (searchTerm: string) => {
    try {
      setLoading(true);
      setError(null);
      
      const searchResults = await eventsApi.searchEvents(searchTerm, limit);
      setEvents(searchResults);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Error al buscar eventos';
      setError(errorMessage);
      toast.error(errorMessage);
    } finally {
      setLoading(false);
    }
  }, [limit]);

  useEffect(() => {
    fetchPublicEvents();
  }, [fetchPublicEvents]);

  return {
    events,
    loading,
    error,
    fetchPublicEvents,
    fetchFeaturedEvents,
    searchEvents,
  };
}
