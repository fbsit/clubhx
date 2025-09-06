
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { 
  Calendar, 
  Clock, 
  MapPin, 
  Users, 
  Video, 
  Star,
  TrendingUp,
  AlertCircle
} from "lucide-react";
import { format } from "date-fns";
import { es } from "date-fns/locale";
import { EventActionsMenu } from "./EventActionsMenu";
import type { Event } from "@/types/event";

interface EventsListViewProps {
  events: Event[];
  onEventClick: (event: Event) => void;
  onDuplicate: (event: Event) => void;
  onCancel: (event: Event) => void;
  onExportData: (event: Event) => void;
  onSendNotification: (event: Event) => void;
}

export default function EventsListView({ 
  events, 
  onEventClick, 
  onDuplicate, 
  onCancel, 
  onExportData, 
  onSendNotification 
}: EventsListViewProps) {
  const getEventStatus = (event: Event) => {
    if (event.isPast) return "Finalizado";
    if (event.spotsLeft === 0) return "Lleno";
    return "Activo";
  };

  const getStatusColor = (event: Event) => {
    if (event.isPast) return "secondary";
    if (event.spotsLeft === 0) return "destructive";
    return "default";
  };

  const getOccupancyColor = (occupancyPercentage: number) => {
    if (occupancyPercentage >= 90) return "text-red-600";
    if (occupancyPercentage >= 70) return "text-orange-600";
    return "text-green-600";
  };

  return (
    <div className="space-y-4">
      {events.map((event) => {
        const occupancyPercentage = Math.round(((event.spots - event.spotsLeft) / event.spots) * 100);
        
        return (
          <Card key={event.id} className="hover:shadow-md transition-shadow overflow-hidden">
            <CardContent className="p-4 md:p-6">
              <div className="flex flex-col md:flex-row md:items-start justify-between gap-4">
                {/* Información principal */}
                <div className="flex-1 min-w-0 space-y-3">
                  <div className="flex items-start gap-3">
                    {/* Indicador de color */}
                    <div 
                      className="w-1 h-16 md:h-16 rounded-full flex-shrink-0 self-stretch"
                      style={{ backgroundColor: event.color || '#6b7280' }}
                    />
                    
                    <div className="flex-1 min-w-0">
                      <div className="flex flex-col gap-2 mb-2">
                        <h3 
                          className="font-semibold text-base md:text-lg break-words cursor-pointer hover:text-primary transition-colors leading-tight"
                          onClick={() => onEventClick(event)}
                        >
                          {event.title}
                        </h3>
                        <div className="flex flex-wrap items-center gap-1.5">
                          <Badge variant="outline" className="text-xs">{event.brand}</Badge>
                          <Badge variant={getStatusColor(event) as any} className="text-xs">
                            {getEventStatus(event)}
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
                      </div>
                      
                      <div className="flex flex-col gap-2 text-sm text-muted-foreground mb-2">
                        <div className="flex flex-wrap items-center gap-3">
                          <div className="flex items-center gap-1">
                            <Calendar className="h-4 w-4 flex-shrink-0" />
                            <span className="text-xs">
                              {format(new Date(event.date), "dd MMM yyyy", { locale: es })}
                            </span>
                          </div>
                          <div className="flex items-center gap-1">
                            <Clock className="h-4 w-4 flex-shrink-0" />
                            <span className="text-xs">{event.time}</span>
                          </div>
                        </div>
                        <div className="flex items-start gap-1">
                          {event.eventType === "online" ? (
                            <Video className="h-4 w-4 flex-shrink-0 mt-0.5" />
                          ) : (
                            <MapPin className="h-4 w-4 flex-shrink-0 mt-0.5" />
                          )}
                          <span className="break-words text-xs leading-relaxed">
                            {event.location}
                          </span>
                        </div>
                      </div>
                      
                      <p className="text-sm text-muted-foreground line-clamp-2 break-words leading-relaxed">
                        {event.description}
                      </p>
                    </div>
                  </div>
                  
                  {/* Speaker */}
                  {event.speaker && (
                    <div className="flex items-center gap-2">
                      <Avatar className="h-6 w-6">
                        <AvatarImage src={event.speaker.avatar} />
                        <AvatarFallback className="text-xs">
                          {event.speaker.name.split(' ').map(n => n[0]).join('')}
                        </AvatarFallback>
                      </Avatar>
                      <span className="text-sm text-muted-foreground break-words">
                        {event.speaker.name} - {event.speaker.role}
                      </span>
                    </div>
                  )}
                </div>
                
                {/* Estadísticas y acciones */}
                <div className="flex flex-row md:flex-col items-start justify-between md:items-end gap-4 md:gap-6">
                  {/* Estadísticas */}
                  <div className="flex flex-col md:text-right space-y-2">
                    <div className="flex items-center gap-2">
                      <Users className="h-4 w-4 text-muted-foreground" />
                      <span className="text-sm">
                        <span className="font-medium">{event.spots - event.spotsLeft}</span>
                        <span className="text-muted-foreground">/{event.spots}</span>
                      </span>
                    </div>
                    <div className={`text-sm font-medium ${getOccupancyColor(occupancyPercentage)}`}>
                      {occupancyPercentage}% ocupado
                    </div>
                    {event.pointsCost > 0 && (
                      <div className="flex items-center gap-1 text-sm text-muted-foreground">
                        <Star className="h-3 w-3" />
                        {event.pointsCost} pts
                      </div>
                    )}
                  </div>
                  
                  {/* Acciones */}
                  <div className="flex items-center gap-2 flex-shrink-0">
                    <Button 
                      variant="outline" 
                      size="sm"
                      onClick={() => onEventClick(event)}
                      className="text-xs px-3"
                    >
                      Ver Detalles
                    </Button>
                    <EventActionsMenu
                      event={event}
                      onDuplicate={onDuplicate}
                      onCancel={onCancel}
                      onExportData={onExportData}
                      onSendNotification={onSendNotification}
                    />
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        );
      })}
      
      {events.length === 0 && (
        <Card>
          <CardContent className="p-12 text-center">
            <AlertCircle className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
            <h3 className="text-lg font-medium mb-2">No hay eventos</h3>
            <p className="text-muted-foreground">
              No se encontraron eventos que coincidan con los filtros seleccionados.
            </p>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
