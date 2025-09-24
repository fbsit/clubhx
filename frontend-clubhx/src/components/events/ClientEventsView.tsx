
import { useEffect, useState } from "react";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Calendar, Clock, MapPin, Users, ExternalLink, CalendarPlus, AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import EventRegistrationDialog from "./EventRegistrationDialog";
import { usePublicEvents } from "@/hooks/useEvents";
import { useEventRegistrations } from "@/hooks/useEventRegistrations";
import { adaptEventsFromDto } from "@/utils/eventAdapter";
import type { Event } from "@/types/event";
import { fetchMyLoyaltyPoints } from "@/services/loyaltyApi";

export default function ClientEventsView() {
  const { events: eventDtos, loading, error } = usePublicEvents(20);
  const { registerForEvent, registrations } = useEventRegistrations();
  const events = adaptEventsFromDto(eventDtos);
  const [userPoints, setUserPoints] = useState<number>(0);
  
  const [selectedEvent, setSelectedEvent] = useState<Event | null>(null);
  const [registrationDialogOpen, setRegistrationDialogOpen] = useState(false);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const { points } = await fetchMyLoyaltyPoints();
        if (!cancelled) setUserPoints(points ?? 0);
      } catch {
        if (!cancelled) setUserPoints(0);
      }
    })();
    return () => { cancelled = true; };
  }, []);

  const handleRegisterClick = (event: Event) => {
    setSelectedEvent(event);
    setRegistrationDialogOpen(true);
  };

  const handleRegister = async (_eventId: string, _attendeesCount: number = 1) => {
    // La inscripción real se ejecuta en EventRegistrationDialog vía registerForEvent
    setRegistrationDialogOpen(false);
  };

  return (
    <Tabs defaultValue="upcoming" className="w-full">
      <TabsList className="w-full grid grid-cols-2 h-auto mb-4">
        <TabsTrigger value="upcoming" className="py-2">Próximos</TabsTrigger>
        <TabsTrigger value="past" className="py-2">Pasados</TabsTrigger>
      </TabsList>
      
      <TabsContent value="upcoming" className="mt-0">
        {events.filter(event => !event.isPast).length === 0 ? (
          <Card>
            <CardContent className="p-12 text-center">
              <AlertCircle className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
              <h3 className="text-lg font-medium mb-2">No hay eventos próximos</h3>
              <p className="text-muted-foreground">Vuelve más tarde para ver nuevos eventos.</p>
            </CardContent>
          </Card>
        ) : (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {events.filter(event => !event.isPast).map(event => {
            const myReg = registrations.find(r => r.eventId === event.id);
            const isRegistered = Boolean(myReg);
            const attendees = myReg?.attendeesCount || 0;
            return (
            <Card key={event.id} className="overflow-hidden flex flex-col">
              <div className="aspect-video relative overflow-hidden">
                <img 
                  src={event.image} 
                  alt={event.title} 
                  className="object-cover w-full h-full"
                  onError={(e) => {
                    (e.target as HTMLImageElement).src = "https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?auto=format&fit=crop&q=80";
                  }}
                />
                <Badge 
                  className="absolute top-3 right-3 bg-primary/90 hover:bg-primary"
                >
                  {event.brand}
                </Badge>
              </div>
              
              <CardHeader className="pb-2">
                <CardTitle className="text-lg leading-tight">{event.title}</CardTitle>
                <CardDescription className="flex items-center gap-1">
                  <Calendar className="h-3 w-3 inline" />
                  {event.date}
                  <span className="mx-1">•</span>
                  <Clock className="h-3 w-3 inline" />
                  {event.time}
                </CardDescription>
              </CardHeader>
              
              <CardContent className="pb-2 flex-grow">
                <p className="text-sm text-muted-foreground mb-3">{event.description.length > 120 
                  ? `${event.description.substring(0, 120)}...` 
                  : event.description}
                </p>
                
                <div className="flex items-center gap-1 text-xs text-muted-foreground mb-2">
                  <MapPin className="h-3 w-3" />
                  {event.location}
                </div>
                
                {event.speaker && (
                  <div className="flex items-center gap-2 mt-3">
                    <Avatar className="h-8 w-8">
                      <AvatarImage src={event.speaker.avatar} alt={event.speaker.name} />
                      <AvatarFallback>{event.speaker.name.substring(0, 2)}</AvatarFallback>
                    </Avatar>
                    <div className="text-xs">
                      <p className="font-medium">{event.speaker.name}</p>
                      <p className="text-muted-foreground">{event.speaker.role}</p>
                    </div>
                  </div>
                )}
              </CardContent>
              
              <CardFooter className="pt-2 border-t flex-shrink-0 flex flex-col items-center gap-2">
                <div className="flex items-center gap-2 text-xs text-muted-foreground">
                  <Users className="h-3 w-3" />
                  {event.spotsLeft > 0 
                    ? `${event.spotsLeft} cupos disponibles de ${event.spots}` 
                    : "Sin cupos disponibles"}
                </div>
                
                {event.pointsCost > 0 && (
                  <div className="text-xs text-muted-foreground">
                    {event.pointsCost} puntos por persona
                  </div>
                )}
                
                {isRegistered ? (
                  <Badge variant="outline" className="border-green-500 text-green-500">
                    Inscrito {attendees > 1 ? `(${attendees} personas)` : ''}
                  </Badge>
                ) : (
                  <Button 
                    size="sm" 
                    disabled={event.spotsLeft === 0}
                    onClick={() => handleRegisterClick(event)}
                  >
                    <CalendarPlus className="mr-1 h-4 w-4" />
                    Inscribirme
                  </Button>
                )}
              </CardFooter>
            </Card>
          );})}
        </div>
        )}
      </TabsContent>
      
      <TabsContent value="past" className="mt-0">
        {events.filter(event => event.isPast).length === 0 ? (
          <Card>
            <CardContent className="p-12 text-center">
              <AlertCircle className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
              <h3 className="text-lg font-medium mb-2">No hay eventos pasados</h3>
              <p className="text-muted-foreground">Cuando participes en eventos, los verás aquí.</p>
            </CardContent>
          </Card>
        ) : (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {events.filter(event => event.isPast).map(event => (
            <Card key={event.id} className="overflow-hidden flex flex-col opacity-80">
              <div className="aspect-video relative overflow-hidden">
                <img 
                  src={event.image} 
                  alt={event.title} 
                  className="object-cover w-full h-full filter grayscale"
                  onError={(e) => {
                    (e.target as HTMLImageElement).src = "https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?auto=format&fit=crop&q=80";
                  }}
                />
                <Badge 
                  className="absolute top-3 right-3 bg-muted"
                >
                  {event.brand}
                </Badge>
              </div>
              
              <CardHeader className="pb-2">
                <CardTitle className="text-lg leading-tight">{event.title}</CardTitle>
                <CardDescription className="flex items-center gap-1">
                  <Calendar className="h-3 w-3 inline" />
                  {event.date}
                  <span className="mx-1">•</span>
                  <Clock className="h-3 w-3 inline" />
                  {event.time}
                </CardDescription>
              </CardHeader>
              
              <CardContent className="pb-2 flex-grow">
                <p className="text-sm text-muted-foreground mb-3">
                  {event.description.length > 120 
                    ? `${event.description.substring(0, 120)}...` 
                    : event.description}
                </p>
                
                <div className="flex items-center gap-1 text-xs text-muted-foreground">
                  <MapPin className="h-3 w-3" />
                  {event.location}
                </div>
              </CardContent>
              
              <CardFooter className="pt-2 border-t">
                {event.isRegistered && (
                  <Button size="sm" variant="outline" className="ml-auto">
                    <ExternalLink className="mr-1 h-4 w-4" />
                    Ver Materiales
                  </Button>
                )}
              </CardFooter>
            </Card>
          ))}
        </div>
        )}
      </TabsContent>
      
      {selectedEvent && (
        <EventRegistrationDialog
          event={selectedEvent}
          open={registrationDialogOpen}
          onOpenChange={setRegistrationDialogOpen}
          onRegister={handleRegister}
          userPoints={userPoints}
        />
      )}
    </Tabs>
  );
}
