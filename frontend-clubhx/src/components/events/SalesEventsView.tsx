
import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Calendar, MapPin, Users, DollarSign, Clock } from "lucide-react";
import { useSalesEvents } from "@/hooks/useSalesEvents";
import { formatCurrency, formatDate } from "@/utils/customerFormatters";

export default function SalesEventsView() {
  const { events, stats, loading, error } = useSalesEvents();
  const [selectedEvent, setSelectedEvent] = useState<string | null>(null);

  if (loading) {
    return (
      <div className="space-y-6">
        <Card>
          <CardHeader>
            <CardTitle>Eventos de Clientes</CardTitle>
            <CardDescription>Cargando eventos...</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {[...Array(3)].map((_, i) => (
                <div key={i} className="h-32 bg-muted animate-pulse rounded" />
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (error) {
    return (
      <div className="space-y-6">
        <Card>
          <CardContent className="p-6">
            <p className="text-center text-muted-foreground">{error}</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Eventos con inscripciones de clientes */}
      <Card>
        <CardHeader>
          <CardTitle>Eventos con Inscripciones de Clientes</CardTitle>
          <CardDescription>
            Eventos activos donde tus clientes están registrados
          </CardDescription>
        </CardHeader>
        <CardContent>
          {events.length === 0 ? (
            <div className="text-center py-8">
              <p className="text-muted-foreground">No hay eventos con inscripciones de clientes</p>
            </div>
          ) : (
            <div className="space-y-4">
              {events.map((event) => (
                <div key={event.id} className="rounded-md border overflow-hidden">
                  <div className="bg-muted p-4">
                    <div className="flex justify-between items-start">
                      <div className="flex-1">
                        <h3 className="font-medium text-lg">{event.title}</h3>
                        <p className="text-sm text-muted-foreground mt-1">{event.description}</p>
                        <div className="flex items-center gap-4 mt-2 text-xs text-muted-foreground">
                          <div className="flex items-center gap-1">
                            <Calendar className="h-3 w-3" />
                            {formatDate(event.start_date)}
                          </div>
                          <div className="flex items-center gap-1">
                            <MapPin className="h-3 w-3" />
                            {event.location}
                          </div>
                          <div className="flex items-center gap-1">
                            <Users className="h-3 w-3" />
                            {event.total_customers_registered} clientes
                          </div>
                          <div className="flex items-center gap-1">
                            <DollarSign className="h-3 w-3" />
                            {formatCurrency(event.total_revenue)}
                          </div>
                        </div>
                      </div>
                      <div className="flex flex-col items-end gap-2">
                        <Badge variant={event.is_featured ? "default" : "secondary"}>
                          {event.category}
                        </Badge>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => setSelectedEvent(selectedEvent === event.id ? null : event.id)}
                        >
                          Ver Detalles
                        </Button>
                      </div>
                    </div>
                  </div>
                  
                  {selectedEvent === event.id && (
                    <div className="border-t">
                      <div className="p-4">
                        <h4 className="font-medium mb-3">Clientes Registrados:</h4>
                        <div className="space-y-3">
                          {event.customer_registrations.map((registration) => (
                            <div key={registration.id} className="flex justify-between items-center p-3 bg-background rounded border">
                              <div>
                                <p className="font-medium">{registration.customer_name}</p>
                                <p className="text-sm text-muted-foreground">
                                  {registration.attendees_count} asistentes • {registration.customer_contact}
                                </p>
                                <p className="text-xs text-muted-foreground">
                                  Registrado: {formatDate(registration.registration_date)}
                                </p>
                              </div>
                              <div className="flex flex-col items-end gap-1">
                                <Badge 
                                  variant={registration.payment_status === 'paid' ? 'default' : 'destructive'}
                                >
                                  {registration.payment_status === 'paid' ? 'Pagado' : 'Pendiente'}
                                </Badge>
                                <p className="text-sm font-medium">
                                  {formatCurrency(registration.amount_paid)}
                                </p>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
      
      {/* Estadísticas */}
      <Card>
        <CardHeader>
          <CardTitle>Estadísticas de Eventos</CardTitle>
          <CardDescription>
            Resumen de participación de tus clientes en eventos
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-4">
            <Card>
              <CardHeader className="p-4">
                <CardTitle className="text-lg flex items-center gap-2">
                  <Calendar className="h-5 w-5" />
                  Total Eventos
                </CardTitle>
              </CardHeader>
              <CardContent className="pt-0 p-4">
                <p className="text-3xl font-bold">{stats.total}</p>
                <p className="text-sm text-muted-foreground">{stats.upcoming} próximos</p>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader className="p-4">
                <CardTitle className="text-lg flex items-center gap-2">
                  <Users className="h-5 w-5" />
                  Total Asistentes
                </CardTitle>
              </CardHeader>
              <CardContent className="pt-0 p-4">
                <p className="text-3xl font-bold">{stats.total_attendees}</p>
                <p className="text-sm text-muted-foreground">clientes registrados</p>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader className="p-4">
                <CardTitle className="text-lg flex items-center gap-2">
                  <DollarSign className="h-5 w-5" />
                  Ingresos Totales
                </CardTitle>
              </CardHeader>
              <CardContent className="pt-0 p-4">
                <p className="text-3xl font-bold">{formatCurrency(stats.total_revenue)}</p>
                <p className="text-sm text-muted-foreground">por eventos</p>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader className="p-4">
                <CardTitle className="text-lg flex items-center gap-2">
                  <Clock className="h-5 w-5" />
                  Próximos Eventos
                </CardTitle>
              </CardHeader>
              <CardContent className="pt-0 p-4">
                <p className="text-3xl font-bold">{stats.upcoming}</p>
                <p className="text-sm text-muted-foreground">en las próximas semanas</p>
              </CardContent>
            </Card>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
