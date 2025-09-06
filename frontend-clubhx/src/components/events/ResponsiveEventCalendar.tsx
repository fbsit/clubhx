
import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { format, startOfMonth, endOfMonth, eachDayOfInterval, isSameMonth, isSameDay } from "date-fns";
import { es } from "date-fns/locale";
import { MapPin, Video, ChevronLeft, ChevronRight } from "lucide-react";
import { useIsMobile } from "@/hooks/use-mobile";
import { MobileCalendarHeader } from "./MobileCalendarHeader";
import type { Event } from "@/types/event";

interface ResponsiveEventCalendarProps {
  currentDate: Date;
  events: Event[];
  selectedDate: Date | null;
  onDateSelect: (date: Date) => void;
  onPreviousMonth: () => void;
  onNextMonth: () => void;
  onToday: () => void;
}

export function ResponsiveEventCalendar({
  currentDate,
  events,
  selectedDate,
  onDateSelect,
  onPreviousMonth,
  onNextMonth,
  onToday
}: ResponsiveEventCalendarProps) {
  const isMobile = useIsMobile(768);
  
  const monthStart = startOfMonth(currentDate);
  const monthEnd = endOfMonth(currentDate);
  const monthDays = eachDayOfInterval({ start: monthStart, end: monthEnd });

  const eventsWithDates = events.map(event => ({
    ...event,
    dateObj: new Date(event.date)
  }));

  const getEventsForDay = (day: Date) => {
    return eventsWithDates.filter(event => isSameDay(event.dateObj, day));
  };

  if (isMobile) {
    return (
      <div className="w-full">
        <Card className="overflow-hidden shadow-sm">
          <MobileCalendarHeader
            currentDate={currentDate}
            onPreviousMonth={onPreviousMonth}
            onNextMonth={onNextMonth}
            onToday={onToday}
          />
          
          <CardContent className="p-0">
            {/* Días de la semana */}
            <div className="grid grid-cols-7 bg-muted/20">
              {['D', 'L', 'M', 'X', 'J', 'V', 'S'].map((day) => (
                <div key={day} className="py-2 text-center text-xs font-medium text-muted-foreground">
                  {day}
                </div>
              ))}
            </div>

            {/* Grid del calendario */}
            <div className="grid grid-cols-7">
              {monthDays.map((day) => {
                const dayEvents = getEventsForDay(day);
                const isSelected = selectedDate && isSameDay(day, selectedDate);
                const isToday = isSameDay(day, new Date());

                return (
                  <button
                    key={day.toISOString()}
                    className={`
                      aspect-square p-1 border-r border-b border-border/20 transition-all duration-200 
                      flex flex-col items-center justify-center relative
                      ${isSelected ? 'bg-primary/15 border-primary/30' : 'hover:bg-muted/30 active:bg-muted/50'}
                      ${isToday ? 'ring-1 ring-primary ring-inset' : ''}
                      ${!isSameMonth(day, currentDate) ? 'opacity-30 text-muted-foreground' : ''}
                    `}
                    onClick={() => onDateSelect(day)}
                  >
                    <span className={`text-sm font-medium ${isToday ? 'text-primary font-semibold' : ''}`}>
                      {format(day, 'd')}
                    </span>
                    
                    {/* Indicadores de eventos */}
                    {dayEvents.length > 0 && (
                      <div className="flex justify-center items-center mt-0.5 gap-0.5">
                        {dayEvents.slice(0, 3).map((event, index) => (
                          <div
                            key={`${event.id}-${index}`}
                            className="w-1.5 h-1.5 rounded-full flex-shrink-0"
                            style={{ backgroundColor: event.color || '#6b7280' }}
                          />
                        ))}
                        {dayEvents.length > 3 && (
                          <span className="text-[9px] text-muted-foreground font-medium ml-0.5">
                            +{dayEvents.length - 3}
                          </span>
                        )}
                      </div>
                    )}
                  </button>
                );
              })}
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  // Vista desktop/tablet
  return (
    <Card>
      <CardContent className="p-6">
        {/* Header del calendario para desktop */}
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-semibold">
            {format(currentDate, "MMMM yyyy", { locale: es })}
          </h2>
          <div className="flex items-center gap-2">
            <Button variant="outline" size="icon" onClick={onPreviousMonth}>
              <ChevronLeft className="h-4 w-4" />
            </Button>
            <Button variant="outline" size="sm" onClick={onToday}>
              Hoy
            </Button>
            <Button variant="outline" size="icon" onClick={onNextMonth}>
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>
        </div>

        {/* Días de la semana */}
        <div className="grid grid-cols-7 gap-1 mb-2">
          {['Dom', 'Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb'].map((day) => (
            <div key={day} className="p-3 text-center text-sm font-medium text-muted-foreground">
              {day}
            </div>
          ))}
        </div>

        {/* Grid del calendario */}
        <div className="grid grid-cols-7 gap-1">
          {monthDays.map((day) => {
            const dayEvents = getEventsForDay(day);
            const isSelected = selectedDate && isSameDay(day, selectedDate);
            const isToday = isSameDay(day, new Date());

            return (
              <div
                key={day.toISOString()}
                className={`
                  min-h-[100px] p-2 border rounded-md cursor-pointer transition-colors
                  ${isSelected ? 'bg-primary/10 border-primary' : 'hover:bg-muted/50'}
                  ${isToday ? 'border-primary' : 'border-border'}
                  ${!isSameMonth(day, currentDate) ? 'opacity-50' : ''}
                `}
                onClick={() => onDateSelect(day)}
              >
                <div className={`text-sm font-medium mb-2 ${isToday ? 'text-primary' : ''}`}>
                  {format(day, 'd')}
                </div>
                <div className="space-y-1">
                  {dayEvents.slice(0, 3).map((event) => (
                    <div
                      key={event.id}
                      className="text-xs p-1 rounded text-white truncate flex items-center gap-1"
                      style={{ backgroundColor: event.color || '#6b7280' }}
                    >
                      {event.eventType === "online" ? (
                        <Video className="h-3 w-3 flex-shrink-0" />
                      ) : (
                        <MapPin className="h-3 w-3 flex-shrink-0" />
                      )}
                      <span className="truncate">{event.title}</span>
                    </div>
                  ))}
                  {dayEvents.length > 3 && (
                    <div className="text-xs text-muted-foreground">
                      +{dayEvents.length - 3} más
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
}
