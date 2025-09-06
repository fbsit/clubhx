import { useState } from "react";
import { format, startOfMonth, endOfMonth, eachDayOfInterval, isSameMonth, isSameDay } from "date-fns";
import { es } from "date-fns/locale";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight, MapPin, Video } from "lucide-react";
import { useIsMobile } from "@/hooks/use-mobile";
type ClientAppointment = any;

interface ClientScheduleCalendarProps {
  currentDate: Date;
  appointments: ClientAppointment[];
  selectedDate: Date | null;
  onDateSelect: (date: Date) => void;
  onPreviousMonth: () => void;
  onNextMonth: () => void;
  onToday: () => void;
  onAppointmentSelect?: (appointment: ClientAppointment) => void;
}

export function ClientScheduleCalendar({
  currentDate,
  appointments,
  selectedDate,
  onDateSelect,
  onPreviousMonth,
  onNextMonth,
  onToday,
  onAppointmentSelect
}: ClientScheduleCalendarProps) {
  const isMobile = useIsMobile(768);
  
  const monthStart = startOfMonth(currentDate);
  const monthEnd = endOfMonth(currentDate);
  const monthDays = eachDayOfInterval({ start: monthStart, end: monthEnd });

  const appointmentsWithDates = appointments.map(appointment => ({
    ...appointment,
    dateObj: appointment.date
  }));

  const getAppointmentsForDay = (day: Date) => {
    return appointmentsWithDates.filter(appointment => isSameDay(appointment.dateObj, day));
  };

  if (isMobile) {
    return (
      <div className="w-full">
        <Card className="overflow-hidden shadow-sm">
          {/* Header móvil */}
          <div className="flex items-center justify-between p-4 border-b">
            <h2 className="text-lg font-semibold">
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
                const dayAppointments = getAppointmentsForDay(day);
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
                    
                    {/* Indicadores de citas */}
                    {dayAppointments.length > 0 && (
                      <div className="flex justify-center items-center mt-0.5 gap-0.5">
                        {dayAppointments.slice(0, 3).map((appointment, index) => (
                          <div
                            key={`${appointment.id}-${index}`}
                            className="w-1.5 h-1.5 rounded-full flex-shrink-0"
                            style={{ backgroundColor: appointment.color || '#6b7280' }}
                          />
                        ))}
                        {dayAppointments.length > 3 && (
                          <span className="text-[9px] text-muted-foreground font-medium ml-0.5">
                            +{dayAppointments.length - 3}
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
            const dayAppointments = getAppointmentsForDay(day);
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
                  {dayAppointments.slice(0, 3).map((appointment) => (
                    <button
                      key={appointment.id}
                      className="w-full text-xs p-1 rounded text-white truncate flex items-center gap-1 hover:opacity-80 transition-opacity"
                      style={{ backgroundColor: appointment.color || '#6b7280' }}
                      onClick={(e) => {
                        e.stopPropagation();
                        onAppointmentSelect?.(appointment);
                      }}
                    >
                      {appointment.type === "videollamada" ? (
                        <Video className="h-3 w-3 flex-shrink-0" />
                      ) : (
                        <MapPin className="h-3 w-3 flex-shrink-0" />
                      )}
                      <span className="truncate">{appointment.title}</span>
                    </button>
                  ))}
                  {dayAppointments.length > 3 && (
                    <div className="text-xs text-muted-foreground">
                      +{dayAppointments.length - 3} más
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