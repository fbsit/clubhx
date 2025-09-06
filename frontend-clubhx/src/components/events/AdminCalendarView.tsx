
import { useState } from "react";
import { isSameDay, addMonths, subMonths } from "date-fns";
import EventsSearchFilter from "./EventsSearchFilter";
import { EventDetailDialog } from "./EventDetailDialog";
import EventsListView from "./EventsListView";
import { EventCancelDialog } from "./EventCancelDialog";
import { useEventsFilter } from "@/hooks/useEventsFilter";
import { exportEventData, duplicateEvent, sendEventNotification, cancelEvent } from "@/utils/eventUtils";
import { toast } from "@/hooks/use-toast";
import { useIsMobile } from "@/hooks/use-mobile";
import { ResponsiveEventCalendar } from "./ResponsiveEventCalendar";
import { MobileEventsList } from "./MobileEventsList";
import { MobileEventActions } from "./MobileEventActions";
import { CalendarHeader } from "./CalendarHeader";
import { DesktopCalendarLayout } from "./DesktopCalendarLayout";
import type { Event } from "@/types/event";

interface AdminCalendarViewProps {
  events: Event[];
  onAddEvent: () => void;
  onEditEvent: (event: Event) => void;
  onDeleteEvent?: (eventId: string) => Promise<void>;
}

export default function AdminCalendarView({ events, onAddEvent, onEditEvent, onDeleteEvent }: AdminCalendarViewProps) {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [selectedEvent, setSelectedEvent] = useState<Event | null>(null);
  const [showEventDetail, setShowEventDetail] = useState(false);
  const [viewMode, setViewMode] = useState<"calendar" | "list">("calendar");
  const [showCancelDialog, setShowCancelDialog] = useState(false);
  const [eventToCancel, setEventToCancel] = useState<Event | null>(null);
  
  const isMobile = useIsMobile();

  const {
    searchValue,
    selectedBrand,
    selectedStatus,
    selectedEventType,
    summaryPeriod,
    filteredEvents,
    availableBrands,
    summaryStats,
    setSearchValue,
    setSelectedBrand,
    setSelectedStatus,
    setSelectedEventType,
    setSummaryPeriod
  } = useEventsFilter(events);

  // Convertir eventos filtrados a fechas para comparación
  const eventsWithDates = filteredEvents.map(event => ({
    ...event,
    dateObj: new Date(event.date)
  }));

  const getEventsForDay = (day: Date) => {
    return eventsWithDates.filter(event => isSameDay(event.dateObj, day));
  };

  const selectedDayEvents = selectedDate ? getEventsForDay(selectedDate) : [];

  const navigateMonth = (direction: 'prev' | 'next') => {
    setCurrentDate(direction === 'prev' ? subMonths(currentDate, 1) : addMonths(currentDate, 1));
  };

  const handleEventClick = (event: Event) => {
    setSelectedEvent(event);
    setShowEventDetail(true);
  };

  const handleEditFromDetail = () => {
    setShowEventDetail(false);
    if (selectedEvent) {
      onEditEvent(selectedEvent);
    }
  };

  const handleCloseDetail = () => {
    setShowEventDetail(false);
    setSelectedEvent(null);
  };

  const handleDuplicateEvent = (event: Event) => {
    const duplicatedEvent = duplicateEvent(event);
    console.log("Evento duplicado:", duplicatedEvent);
  };

  const handleCancelEvent = (event: Event) => {
    setEventToCancel(event);
    setShowCancelDialog(true);
  };

  const handleConfirmCancel = async (reason: string) => {
    if (eventToCancel) {
      await cancelEvent(eventToCancel, reason);
      toast({
        title: "Evento cancelado",
        description: `El evento "${eventToCancel.title}" ha sido cancelado exitosamente.`,
        variant: "destructive",
      });
    }
  };

  const handleExportData = (event: Event) => {
    exportEventData(event);
  };

  const handleSendNotification = async (event: Event) => {
    await sendEventNotification(event);
  };

  // Layout móvil optimizado
  if (isMobile) {
    return (
      <div className="space-y-4 pb-24">
        {/* Búsqueda y filtros */}
        <div className="px-4">
          <EventsSearchFilter
            onSearchChange={setSearchValue}
            onBrandFilter={setSelectedBrand}
            onStatusFilter={setSelectedStatus}
            onEventTypeFilter={setSelectedEventType}
            selectedBrand={selectedBrand}
            selectedStatus={selectedStatus}
            selectedEventType={selectedEventType}
            searchValue={searchValue}
            availableBrands={availableBrands}
          />
        </div>

        {viewMode === "list" ? (
          <div className="px-4">
            <EventsListView
              events={filteredEvents}
              onEventClick={handleEventClick}
              onDuplicate={handleDuplicateEvent}
              onCancel={handleCancelEvent}
              onExportData={handleExportData}
              onSendNotification={handleSendNotification}
            />
          </div>
        ) : (
          <div className="space-y-4">
            <div className="px-4">
              <ResponsiveEventCalendar
                currentDate={currentDate}
                events={filteredEvents}
                selectedDate={selectedDate}
                onDateSelect={setSelectedDate}
                onPreviousMonth={() => navigateMonth('prev')}
                onNextMonth={() => navigateMonth('next')}
                onToday={() => setCurrentDate(new Date())}
              />
            </div>
            
            <MobileEventsList
              events={selectedDayEvents}
              selectedDate={selectedDate}
              onEventClick={handleEventClick}
              onAddEvent={onAddEvent}
            />
          </div>
        )}

        {/* Acciones móviles flotantes */}
        <MobileEventActions
          viewMode={viewMode}
          onViewChange={setViewMode}
          onAddEvent={onAddEvent}
        />

        {/* Event Detail Dialog */}
        {selectedEvent && (
          <EventDetailDialog
            open={showEventDetail}
            event={selectedEvent}
            onClose={handleCloseDetail}
            onEdit={handleEditFromDetail}
          />
        )}

        {/* Event Cancel Dialog */}
        <EventCancelDialog
          open={showCancelDialog}
          event={eventToCancel}
          onClose={() => {
            setShowCancelDialog(false);
            setEventToCancel(null);
          }}
          onConfirm={handleConfirmCancel}
        />
      </div>
    );
  }

  // Layout desktop/tablet
  return (
    <div className="space-y-6">
      <CalendarHeader
        viewMode={viewMode}
        onViewChange={setViewMode}
        onAddEvent={onAddEvent}
      />

      {/* Búsqueda y filtros */}
      <EventsSearchFilter
        onSearchChange={setSearchValue}
        onBrandFilter={setSelectedBrand}
        onStatusFilter={setSelectedStatus}
        onEventTypeFilter={setSelectedEventType}
        selectedBrand={selectedBrand}
        selectedStatus={selectedStatus}
        selectedEventType={selectedEventType}
        searchValue={searchValue}
        availableBrands={availableBrands}
      />

      {viewMode === "list" ? (
        <EventsListView
          events={filteredEvents}
          onEventClick={handleEventClick}
          onDuplicate={handleDuplicateEvent}
          onCancel={handleCancelEvent}
          onExportData={handleExportData}
          onSendNotification={handleSendNotification}
        />
      ) : (
        <DesktopCalendarLayout
          currentDate={currentDate}
          filteredEvents={filteredEvents}
          selectedDate={selectedDate}
          selectedDayEvents={selectedDayEvents}
          summaryPeriod={summaryPeriod}
          summaryStats={summaryStats}
          totalEventsCount={events.length}
          onDateSelect={setSelectedDate}
          onPreviousMonth={() => navigateMonth('prev')}
          onNextMonth={() => navigateMonth('next')}
          onToday={() => setCurrentDate(new Date())}
          onEventClick={handleEventClick}
          onAddEvent={onAddEvent}
          onSummaryPeriodChange={setSummaryPeriod}
        />
      )}

      {/* Event Detail Dialog */}
      {selectedEvent && (
        <EventDetailDialog
          open={showEventDetail}
          event={selectedEvent}
          onClose={handleCloseDetail}
          onEdit={handleEditFromDetail}
        />
      )}

      {/* Event Cancel Dialog */}
      <EventCancelDialog
        open={showCancelDialog}
        event={eventToCancel}
        onClose={() => {
          setShowCancelDialog(false);
          setEventToCancel(null);
        }}
        onConfirm={handleConfirmCancel}
      />
    </div>
  );
}
