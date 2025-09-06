
import { useState } from "react";
import { EventFormDialog } from "./EventFormDialog";
import AdminCalendarView from "./AdminCalendarView";
import { useEvents } from "@/hooks/useEvents";
import { adaptEventsFromDto, createEmptyEvent } from "@/utils/eventAdapter";
import type { Event } from "@/types/event";

export default function AdminEventsView() {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [currentEvent, setCurrentEvent] = useState<Event | null>(null);
  const [isNewEvent, setIsNewEvent] = useState(false);

  // Usar el hook de eventos para obtener datos reales
  const { 
    events: eventDtos, 
    loading, 
    error, 
    createEvent, 
    updateEvent, 
    deleteEvent,
    refreshEvents 
  } = useEvents();

  // Convertir EventDto a Event para compatibilidad con componentes existentes
  const events = adaptEventsFromDto(eventDtos);

  const handleAddEvent = () => {
    setCurrentEvent(createEmptyEvent());
    setIsNewEvent(true);
    setIsDialogOpen(true);
  };

  const handleEditEvent = (event: Event) => {
    setCurrentEvent(event);
    setIsNewEvent(false);
    setIsDialogOpen(true);
  };

  const handleSaveEvent = async (event: Event) => {
    if (isNewEvent) {
      await createEvent(event);
    } else {
      await updateEvent(event.id, event);
    }
    setIsDialogOpen(false);
    setCurrentEvent(null);
  };

  const handleDeleteEvent = async (eventId: string) => {
    await deleteEvent(eventId);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-lg">Cargando eventos...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-lg text-red-600">Error: {error}</div>
      </div>
    );
  }

  return (
    <>
      <AdminCalendarView
        events={events}
        onAddEvent={handleAddEvent}
        onEditEvent={handleEditEvent}
        onDeleteEvent={handleDeleteEvent}
      />

      {currentEvent && (
        <EventFormDialog 
          open={isDialogOpen}
          setOpen={setIsDialogOpen}
          event={currentEvent}
          isNew={isNewEvent}
          onSave={handleSaveEvent}
        />
      )}
    </>
  );
}
