
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Calendar, Clock, MapPin, Users, Video, Link, Plus } from "lucide-react";
import { format } from "date-fns";
import { es } from "date-fns/locale";
import type { Event } from "@/types/event";

interface CalendarEventsListProps {
  selectedDate: Date | null;
  events: Event[];
  onEventClick: (event: Event) => void;
  onAddEvent: () => void;
}

export function CalendarEventsList({ 
  selectedDate, 
  events, 
  onEventClick, 
  onAddEvent 
}: CalendarEventsListProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg flex items-center gap-2">
          <Calendar className="h-5 w-5" />
          {selectedDate ? format(selectedDate, "dd MMM yyyy", { locale: es }) : "Selecciona un día"}
        </CardTitle>
      </CardHeader>
      <CardContent>
        {events.length > 0 ? (
          <div className="space-y-3">
            {events.map((event) => (
              <div
                key={event.id}
                className="p-3 border rounded-lg hover:bg-muted/50 cursor-pointer transition-colors relative"
                onClick={() => onEventClick(event)}
              >
                <div 
                  className="absolute left-0 top-0 bottom-0 w-1 rounded-l-lg"
                  style={{ backgroundColor: event.color || '#6b7280' }}
                />
                
                <div className="ml-3 space-y-2">
                  {/* Título del evento */}
                  <h4 className="font-medium text-sm leading-tight line-clamp-2">{event.title}</h4>
                  
                  {/* Badge de marca debajo del título */}
                  <div className="flex items-center gap-1.5">
                    <Badge variant="outline" className="text-xs">
                      {event.brand}
                    </Badge>
                  </div>
                  
                  {/* Badges de estado y tipo */}
                  <div className="flex flex-wrap items-center gap-1.5">
                    <Badge variant={event.isPast ? "outline" : "default"} className="text-xs">
                      {event.isPast ? "Finalizado" : event.spotsLeft === 0 ? "Lleno" : "Activo"}
                    </Badge>
                    {event.eventType === "online" ? (
                      <Badge variant="outline" className="text-blue-600 text-xs">
                        <Video className="h-3 w-3 mr-1" />
                        Online
                      </Badge>
                    ) : (
                      <Badge variant="outline" className="text-green-600 text-xs">
                        <MapPin className="h-3 w-3 mr-1" />
                        Presencial
                      </Badge>
                    )}
                  </div>
                  
                  {/* Información de tiempo y lugar */}
                  <div className="space-y-1 text-xs text-muted-foreground">
                    <div className="flex items-center gap-1">
                      <Clock className="h-3 w-3" />
                      {event.time}
                    </div>
                    <div className="flex items-start gap-1">
                      {event.eventType === "online" ? (
                        <Link className="h-3 w-3 flex-shrink-0 mt-0.5" />
                      ) : (
                        <MapPin className="h-3 w-3 flex-shrink-0 mt-0.5" />
                      )}
                      <span className="break-words leading-relaxed">
                        {event.location}
                      </span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Users className="h-3 w-3" />
                      {event.spotsLeft} / {event.spots} cupos
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : selectedDate ? (
          <div className="text-center py-8 text-muted-foreground">
            <Calendar className="h-8 w-8 mx-auto mb-2 opacity-50" />
            <p className="text-sm">No hay eventos programados</p>
            <Button 
              variant="outline" 
              size="sm" 
              className="mt-2"
              onClick={onAddEvent}
            >
              <Plus className="h-4 w-4 mr-1" />
              Crear evento
            </Button>
          </div>
        ) : (
          <div className="text-center py-8 text-muted-foreground">
            <p className="text-sm">Selecciona un día para ver sus eventos</p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
