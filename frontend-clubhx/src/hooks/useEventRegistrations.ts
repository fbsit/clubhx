import { useState, useEffect, useCallback } from 'react';
import { eventRegistrationApi, EventRegistration, CreateRegistrationDto, UpdateRegistrationDto } from '@/services/eventRegistrationApi';
import { toast } from 'sonner';

export interface UseEventRegistrationsReturn {
  registrations: EventRegistration[];
  loading: boolean;
  error: string | null;
  registerForEvent: (eventId: string, data: CreateRegistrationDto) => Promise<EventRegistration | null>;
  cancelRegistration: (eventId: string, registrationId: string) => Promise<boolean>;
  updateRegistration: (eventId: string, registrationId: string, data: UpdateRegistrationDto) => Promise<EventRegistration | null>;
  checkUserRegistration: (eventId: string) => Promise<EventRegistration | null>;
  refreshRegistrations: () => Promise<void>;
}

export function useEventRegistrations(): UseEventRegistrationsReturn {
  const [registrations, setRegistrations] = useState<EventRegistration[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchUserRegistrations = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      
      const response = await eventRegistrationApi.getUserRegistrations();
      setRegistrations(response.results);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Error al cargar inscripciones';
      setError(errorMessage);
      toast.error(errorMessage);
    } finally {
      setLoading(false);
    }
  }, []);

  const registerForEvent = useCallback(async (eventId: string, data: CreateRegistrationDto): Promise<EventRegistration | null> => {
    try {
      setLoading(true);
      setError(null);
      
      const registration = await eventRegistrationApi.registerForEvent(eventId, data);
      
      // Refrescar desde el servidor para mantener consistencia
      try {
        const response = await eventRegistrationApi.getUserRegistrations();
        setRegistrations(response.results);
      } catch {
        // fallback en caso de error de refresco
        setRegistrations(prev => [registration, ...prev]);
      }
      
      toast.success('Inscripción exitosa');
      return registration;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Error al inscribirse al evento';
      setError(errorMessage);
      toast.error(errorMessage);
      return null;
    } finally {
      setLoading(false);
    }
  }, []);

  const cancelRegistration = useCallback(async (eventId: string, registrationId: string): Promise<boolean> => {
    try {
      setLoading(true);
      setError(null);
      
      await eventRegistrationApi.cancelRegistration(eventId, registrationId);
      
      // Remover la inscripción de la lista
      setRegistrations(prev => prev.filter(reg => reg.id !== registrationId));
      
      toast.success('Inscripción cancelada exitosamente');
      return true;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Error al cancelar la inscripción';
      setError(errorMessage);
      toast.error(errorMessage);
      return false;
    } finally {
      setLoading(false);
    }
  }, []);

  const updateRegistration = useCallback(async (eventId: string, registrationId: string, data: UpdateRegistrationDto): Promise<EventRegistration | null> => {
    try {
      setLoading(true);
      setError(null);
      
      const updatedRegistration = await eventRegistrationApi.updateAttendanceStatus(eventId, registrationId, data);
      
      // Actualizar la inscripción en la lista
      setRegistrations(prev => prev.map(reg => 
        reg.id === registrationId ? updatedRegistration : reg
      ));
      
      toast.success('Inscripción actualizada exitosamente');
      return updatedRegistration;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Error al actualizar la inscripción';
      setError(errorMessage);
      toast.error(errorMessage);
      return null;
    } finally {
      setLoading(false);
    }
  }, []);

  const checkUserRegistration = useCallback(async (eventId: string): Promise<EventRegistration | null> => {
    try {
      return await eventRegistrationApi.checkUserRegistration(eventId);
    } catch (err) {
      // Si no hay inscripción, no es un error
      return null;
    }
  }, []);

  const refreshRegistrations = useCallback(async () => {
    await fetchUserRegistrations();
  }, [fetchUserRegistrations]);

  // Cargar inscripciones iniciales
  useEffect(() => {
    fetchUserRegistrations();
  }, [fetchUserRegistrations]);

  return {
    registrations,
    loading,
    error,
    registerForEvent,
    cancelRegistration,
    updateRegistration,
    checkUserRegistration,
    refreshRegistrations,
  };
}

// Hook específico para inscripciones de un evento específico (admin)
export function useEventRegistrationsForEvent(eventId: string) {
  const [registrations, setRegistrations] = useState<EventRegistration[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [stats, setStats] = useState({
    totalRegistrations: 0,
    attendedCount: 0,
    noShowCount: 0,
    pendingCount: 0,
  });

  const fetchEventRegistrations = useCallback(async () => {
    if (!eventId) return;
    
    try {
      setLoading(true);
      setError(null);
      
      const [registrationsResponse, statsResponse] = await Promise.all([
        eventRegistrationApi.getEventRegistrations(eventId),
        eventRegistrationApi.getEventRegistrationStats(eventId),
      ]);
      
      setRegistrations(registrationsResponse.results);
      setStats(statsResponse);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Error al cargar inscripciones del evento';
      setError(errorMessage);
      toast.error(errorMessage);
    } finally {
      setLoading(false);
    }
  }, [eventId]);

  const updateAttendanceStatus = useCallback(async (registrationId: string, status: 'registered' | 'attended' | 'no-show') => {
    try {
      setLoading(true);
      setError(null);
      
      const updatedRegistration = await eventRegistrationApi.updateAttendanceStatus(eventId, registrationId, {
        attendanceStatus: status,
      });
      
      // Actualizar la inscripción en la lista
      setRegistrations(prev => prev.map(reg => 
        reg.id === registrationId ? updatedRegistration : reg
      ));
      
      // Actualizar estadísticas
      await fetchEventRegistrations();
      
      toast.success('Estado de asistencia actualizado');
      return updatedRegistration;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Error al actualizar estado de asistencia';
      setError(errorMessage);
      toast.error(errorMessage);
      return null;
    } finally {
      setLoading(false);
    }
  }, [eventId, fetchEventRegistrations]);

  // Cargar inscripciones cuando cambie el eventId
  useEffect(() => {
    fetchEventRegistrations();
  }, [fetchEventRegistrations]);

  return {
    registrations,
    loading,
    error,
    stats,
    updateAttendanceStatus,
    refreshRegistrations: fetchEventRegistrations,
  };
}
