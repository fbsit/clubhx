
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Calendar, Clock, MapPin, Users, Video, Plus, ChevronRight } from "lucide-react";
import { format } from "date-fns";
import { es } from "date-fns/locale";
import type { Event } from "@/types/event";

interface MobileEventsListProps {
  events: Event[];
  selectedDate: Date | null;
  onEventClick: (event: Event) => void;
  onAddEvent: () => void;
}

export function MobileEventsList({ 
  events, 
  selectedDate, 
  onEventClick, 
  onAddEvent 
}: MobileEventsListProps) {
  if (!selectedDate) {
    return (
      <div className="px-4 py-8 text-center space-y-4">
        <Calendar className="h-16 w-16 mx-auto text-muted-foreground/40" />
        <div className="space-y-2">
          <h3 className="font-semibold text-lg">Selecciona una fecha</h3>
          <p className="text-muted-foreground text-sm px-4">
            Toca un día en el calendario para ver los eventos programados
          </p>
        </div>
      </div>
    );
  }

  if (events.length === 0) {
    return (
      <div className="px-4 py-8 text-center space-y-4">
        <Calendar className="h-16 w-16 mx-auto text-muted-foreground/40" />
        <div className="space-y-3">
          <h3 className="font-semibold text-lg">
            {format(selectedDate, "dd 'de' MMMM", { locale: es })}
          </h3>
          <p className="text-muted-foreground text-sm px-4">
            No hay eventos programados para este día
          </p>
          <Button onClick={onAddEvent} size="sm" className="mt-4">
            <Plus className="h-4 w-4 mr-2" />
            Crear evento
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="px-4 pt-4 pb-2 border-b bg-background/95 sticky top-0 z-10">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="font-semibold text-lg">
              {format(selectedDate, "dd 'de' MMMM", { locale: es })}
            </h3>
            <p className="text-sm text-muted-foreground">
              {events.length} evento{events.length !== 1 ? 's' : ''}
            </p>
          </div>
        </div>
      </div>
      
      {/* Lista de eventos */}
      <div className="px-4 space-y-3 pb-24">
        {events.map((event) => {
          const occupancyPercentage = Math.round(((event.spots - event.spotsLeft) / event.spots) * 100);
          
          return (
            <Card 
              key={event.id} 
              className="overflow-hidden hover:shadow-md transition-all duration-200 active:scale-[0.98]"
              onClick={() => onEventClick(event)}
            >
              <CardContent className="p-0">
                <div className="flex">
                  {/* Barra de color lateral */}
                  <div 
                    className="w-1 flex-shrink-0"
                    style={{ backgroundColor: event.color || '#6b7280' }}
                  />
                  
                  {/* Contenido del evento */}
                  <div className="flex-1 p-4 min-w-0">
                    <div className="space-y-3">
                      {/* Header del evento */}
                      <div className="flex items-start justify-between gap-3">
                        <div className="flex-1 min-w-0">
                          <h4 className="font-semibold text-base leading-tight line-clamp-2 break-words">
                            {event.title}
                          </h4>
                          <div className="flex items-center gap-2 mt-1 flex-wrap">
                            <Badge variant="outline" className="text-xs">
                              {event.brand}
                            </Badge>
                            {event.eventType === "online" ? (
                              <Badge variant="secondary" className="text-xs bg-blue-50 text-blue-700 border-blue-200">
                                <Video className="h-3 w-3 mr-1" />
                                Online
                              </Badge>
                            ) : (
                              <Badge variant="secondary" className="text-xs bg-green-50 text-green-700 border-green-200">
                                <MapPin className="h-3 w-3 mr-1" />
                                Presencial
                              </Badge>
                            )}
                          </div>
                        </div>
                        <ChevronRight className="h-5 w-5 text-muted-foreground flex-shrink-0" />
                      </div>
                      
                      {/* Información del evento */}
                      <div className="space-y-2">
                        <div className="flex items-center gap-3 text-sm text-muted-foreground">
                          <div className="flex items-center gap-1.5">
                            <Clock className="h-4 w-4 flex-shrink-0" />
                            <span>{event.time}</span>
                          </div>
                        </div>
                        
                        {/* Ubicación con truncado correcto */}
                        {event.eventType === "presencial" && (
                          <div className="flex items-start gap-1.5 text-sm text-muted-foreground">
                            <MapPin className="h-4 w-4 flex-shrink-0 mt-0.5" />
                            <span className="break-words text-left leading-relaxed">
                              {event.location}
                            </span>
                          </div>
                        )}
                        
                        {/* Estadísticas de ocupación */}
                        <div className="flex items-center justify-between pt-1">
                          <div className="flex items-center gap-1.5 text-sm">
                            <Users className="h-4 w-4 text-muted-foreground" />
                            <span className="font-medium">{event.spots - event.spotsLeft}</span>
                            <span className="text-muted-foreground">de {event.spots}</span>
                          </div>
                          <div className={`text-sm font-medium ${
                            occupancyPercentage >= 90 ? 'text-red-600' : 
                            occupancyPercentage >= 70 ? 'text-orange-600' : 
                            'text-green-600'
                          }`}>
                            {occupancyPercentage}% ocupado
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>
    </div>
  );
}
