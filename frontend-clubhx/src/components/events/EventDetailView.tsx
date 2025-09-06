import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { ScrollArea } from "@/components/ui/scroll-area";
import { 
  Calendar, 
  Clock, 
  MapPin, 
  Users, 
  Video, 
  Edit, 
  TrendingUp, 
  Star,
  AlertTriangle,
  CheckCircle,
  XCircle,
  X
} from "lucide-react";
import { format } from "date-fns";
import { es } from "date-fns/locale";
const getEventRegistrations = async () => [] as any[];
const getEventPerformance = async () => ({}) as any;
import type { Event } from "@/types/event";

interface EventDetailViewProps {
  event: Event;
  onEdit: () => void;
  onClose: () => void;
  isMobile?: boolean;
}

export default function EventDetailView({ event, onEdit, onClose, isMobile = false }: EventDetailViewProps) {
  const [showEditWarning, setShowEditWarning] = useState(false);
  
  const registrations = getEventRegistrations(event.id);
  const performance = getEventPerformance(event.id);
  const hasRegistrations = registrations.length > 0;

  const handleEditClick = () => {
    if (hasRegistrations && !event.isPast) {
      setShowEditWarning(true);
    } else {
      onEdit();
    }
  };

  const handleConfirmEdit = () => {
    setShowEditWarning(false);
    onEdit();
  };

  const getAttendanceStatusIcon = (status: string) => {
    switch (status) {
      case "attended":
        return <CheckCircle className="h-4 w-4 text-green-500" />;
      case "no-show":
        return <XCircle className="h-4 w-4 text-red-500" />;
      default:
        return <Clock className="h-4 w-4 text-yellow-500" />;
    }
  };

  const getAttendanceStatusText = (status: string) => {
    switch (status) {
      case "attended":
        return "Asistió";
      case "no-show":
        return "No asistió";
      default:
        return "Registrado";
    }
  };

  if (isMobile) {
    return (
      <div className="flex flex-col h-full">
        {/* Mobile Header */}
        <div className="flex items-center justify-between p-4 border-b bg-background sticky top-0 z-10">
          <h1 className="font-semibold text-lg truncate flex-1 mr-4">
            {event.title}
          </h1>
          <Button variant="ghost" size="icon" onClick={onClose}>
            <X className="h-5 w-5" />
          </Button>
        </div>

        <ScrollArea className="flex-1">
          <div className="p-4 space-y-6">
            {/* Mobile Event Info */}
            <div className="space-y-3">
              <div className="flex items-center gap-2 flex-wrap">
                <div 
                  className="w-3 h-3 rounded-full flex-shrink-0"
                  style={{ backgroundColor: event.color || '#6b7280' }}
                />
                <Badge variant="outline" className="text-xs">{event.brand}</Badge>
                <Badge variant={event.isPast ? "secondary" : "default"} className="text-xs">
                  {event.isPast ? "Finalizado" : "Próximo"}
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
              
              <div className="grid grid-cols-2 gap-3 text-sm">
                <div className="flex items-center gap-2">
                  <Calendar className="h-4 w-4 text-muted-foreground flex-shrink-0" />
                  <span className="text-xs">
                    {format(new Date(event.date), "dd MMM", { locale: es })}
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <Clock className="h-4 w-4 text-muted-foreground flex-shrink-0" />
                  <span className="text-xs">{event.time}</span>
                </div>
              </div>
              
              <div className="flex items-center gap-2 text-sm">
                <Users className="h-4 w-4 text-muted-foreground flex-shrink-0" />
                <span className="text-xs">
                  {event.spots - event.spotsLeft} / {event.spots} registrados
                </span>
              </div>
            </div>

            {/* Warning Alert */}
            {showEditWarning && (
              <Alert className="border-orange-200 bg-orange-50">
                <AlertTriangle className="h-4 w-4 text-orange-600" />
                <div className="ml-2">
                  <AlertDescription className="text-orange-800 text-sm">
                    <strong>¡Atención!</strong> Este evento ya tiene {registrations.length} persona(s) registrada(s). 
                    Los cambios pueden afectar a los participantes registrados.
                    <div className="flex gap-2 mt-3">
                      <Button size="sm" variant="outline" onClick={() => setShowEditWarning(false)}>
                        Cancelar
                      </Button>
                      <Button size="sm" onClick={handleConfirmEdit} className="bg-orange-600 hover:bg-orange-700">
                        Continuar
                      </Button>
                    </div>
                  </AlertDescription>
                </div>
              </Alert>
            )}

            {/* Mobile Tabs */}
            <Tabs defaultValue="overview" className="w-full">
              <TabsList className="grid w-full grid-cols-2 h-9">
                <TabsTrigger value="overview" className="text-xs">Resumen</TabsTrigger>
                <TabsTrigger value="registrations" className="text-xs">
                  Registros ({registrations.length})
                </TabsTrigger>
              </TabsList>

              <TabsContent value="overview" className="space-y-4 mt-4">
                {/* Description */}
                <Card>
                  <CardContent className="p-4">
                    <p className="text-sm text-muted-foreground mb-3">{event.description}</p>
                    <div className="space-y-2">
                      <div className="flex items-start gap-2 text-sm">
                        {event.eventType === "online" ? (
                          <Video className="h-4 w-4 mt-0.5 flex-shrink-0" />
                        ) : (
                          <MapPin className="h-4 w-4 mt-0.5 flex-shrink-0" />
                        )}
                        <span className="break-words">{event.location}</span>
                      </div>
                      {event.speaker && (
                        <div className="flex items-center gap-3 p-3 bg-muted/50 rounded-lg">
                          <Avatar className="h-8 w-8">
                            <AvatarImage src={event.speaker.avatar} />
                            <AvatarFallback className="text-xs">
                              {event.speaker.name.split(' ').map(n => n[0]).join('')}
                            </AvatarFallback>
                          </Avatar>
                          <div>
                            <p className="font-medium text-sm">{event.speaker.name}</p>
                            <p className="text-xs text-muted-foreground">{event.speaker.role}</p>
                          </div>
                        </div>
                      )}
                    </div>
                  </CardContent>
                </Card>

                {/* Stats Grid */}
                <div className="grid grid-cols-2 gap-3">
                  <Card>
                    <CardContent className="p-3 text-center">
                      <div className="text-xl font-bold text-blue-600">
                        {event.spots - event.spotsLeft}
                      </div>
                      <div className="text-xs text-muted-foreground">Registrados</div>
                    </CardContent>
                  </Card>
                  <Card>
                    <CardContent className="p-3 text-center">
                      <div className="text-xl font-bold text-green-600">
                        {event.spotsLeft}
                      </div>
                      <div className="text-xs text-muted-foreground">Disponibles</div>
                    </CardContent>
                  </Card>
                  <Card>
                    <CardContent className="p-3 text-center">
                      <div className="text-xl font-bold text-purple-600">
                        {event.pointsCost}
                      </div>
                      <div className="text-xs text-muted-foreground">Puntos</div>
                    </CardContent>
                  </Card>
                  <Card>
                    <CardContent className="p-3 text-center">
                      <div className="text-xl font-bold text-orange-600">
                        {Math.round(((event.spots - event.spotsLeft) / event.spots) * 100)}%
                      </div>
                      <div className="text-xs text-muted-foreground">Ocupación</div>
                    </CardContent>
                  </Card>
                </div>
              </TabsContent>

              <TabsContent value="registrations" className="space-y-4 mt-4">
                {registrations.length > 0 ? (
                  <div className="space-y-3">
                    {registrations.map((registration) => (
                      <Card key={registration.id}>
                        <CardContent className="p-3">
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-3 flex-1 min-w-0">
                              <Avatar className="h-8 w-8">
                                <AvatarImage src={registration.userAvatar} />
                                <AvatarFallback className="text-xs">
                                  {registration.userName.split(' ').map(n => n[0]).join('')}
                                </AvatarFallback>
                              </Avatar>
                              <div className="min-w-0 flex-1">
                                <p className="font-medium text-sm truncate">{registration.userName}</p>
                                <p className="text-xs text-muted-foreground truncate">{registration.userEmail}</p>
                              </div>
                            </div>
                            <div className="flex items-center gap-1 flex-shrink-0">
                              {getAttendanceStatusIcon(registration.attendanceStatus)}
                              <span className="text-xs">
                                {getAttendanceStatusText(registration.attendanceStatus)}
                              </span>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-8 text-muted-foreground">
                    <Users className="h-8 w-8 mx-auto mb-2 opacity-50" />
                    <p className="text-sm">No hay registros para este evento</p>
                  </div>
                )}
              </TabsContent>
            </Tabs>
          </div>
        </ScrollArea>

        {/* Mobile Action Button */}
        <div className="p-4 border-t bg-background">
          <Button onClick={handleEditClick} className="w-full">
            <Edit className="h-4 w-4 mr-2" />
            Editar Evento
          </Button>
        </div>
      </div>
    );
  }

  // Desktop version (keep existing code)
  return (
    <div className="max-w-4xl mx-auto p-6 space-y-6">
      {/* Header */}
      <div className="flex items-start justify-between gap-4">
        <div className="flex-1">
          <div className="flex items-center gap-3 mb-2">
            <div 
              className="w-4 h-4 rounded-full"
              style={{ backgroundColor: event.color || '#6b7280' }}
            />
            <Badge variant="outline">{event.brand}</Badge>
            <Badge variant={event.isPast ? "secondary" : "default"}>
              {event.isPast ? "Finalizado" : "Próximo"}
            </Badge>
            {event.eventType === "online" ? (
              <Badge variant="outline" className="text-blue-600">
                <Video className="h-3 w-3 mr-1" />
                Online
              </Badge>
            ) : (
              <Badge variant="outline" className="text-green-600">
                <MapPin className="h-3 w-3 mr-1" />
                Presencial
              </Badge>
            )}
          </div>
          <h1 className="text-2xl font-bold mb-2">{event.title}</h1>
          <div className="flex items-center gap-4 text-sm text-muted-foreground">
            <div className="flex items-center gap-1">
              <Calendar className="h-4 w-4" />
              {format(new Date(event.date), "dd 'de' MMMM, yyyy", { locale: es })}
            </div>
            <div className="flex items-center gap-1">
              <Clock className="h-4 w-4" />
              {event.time}
            </div>
            <div className="flex items-center gap-1">
              <Users className="h-4 w-4" />
              {event.spots - event.spotsLeft} / {event.spots} registrados
            </div>
          </div>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" onClick={onClose}>
            Cerrar
          </Button>
          <Button onClick={handleEditClick}>
            <Edit className="h-4 w-4 mr-2" />
            Editar Evento
          </Button>
        </div>
      </div>

      {/* Warning Alert */}
      {showEditWarning && (
        <Alert className="border-orange-200 bg-orange-50">
          <AlertTriangle className="h-4 w-4 text-orange-600" />
          <div className="ml-2">
            <AlertDescription className="text-orange-800">
              <strong>¡Atención!</strong> Este evento ya tiene {registrations.length} persona(s) registrada(s). 
              Los cambios pueden afectar a los participantes registrados.
              <div className="flex gap-2 mt-3">
                <Button size="sm" variant="outline" onClick={() => setShowEditWarning(false)}>
                  Cancelar
                </Button>
                <Button size="sm" onClick={handleConfirmEdit} className="bg-orange-600 hover:bg-orange-700">
                  Continuar Editando
                </Button>
              </div>
            </AlertDescription>
          </div>
        </Alert>
      )}

      {/* Content Tabs */}
      <Tabs defaultValue="overview" className="w-full">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="overview">Resumen</TabsTrigger>
          <TabsTrigger value="registrations">
            Registros ({registrations.length})
          </TabsTrigger>
          <TabsTrigger value="performance" disabled={!event.isPast}>
            Desempeño
          </TabsTrigger>
          <TabsTrigger value="feedback" disabled={!event.isPast}>
            Feedback
          </TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Event Details */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Detalles del Evento</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <p className="text-sm text-muted-foreground">{event.description}</p>
                <div className="space-y-2">
                  <div className="flex items-center gap-2 text-sm">
                    {event.eventType === "online" ? (
                      <Video className="h-4 w-4" />
                    ) : (
                      <MapPin className="h-4 w-4" />
                    )}
                    <span>{event.location}</span>
                  </div>
                  {event.speaker && (
                    <div className="flex items-center gap-3 p-3 bg-muted/50 rounded-lg">
                      <Avatar className="h-10 w-10">
                        <AvatarImage src={event.speaker.avatar} />
                        <AvatarFallback>
                          {event.speaker.name.split(' ').map(n => n[0]).join('')}
                        </AvatarFallback>
                      </Avatar>
                      <div>
                        <p className="font-medium text-sm">{event.speaker.name}</p>
                        <p className="text-xs text-muted-foreground">{event.speaker.role}</p>
                      </div>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>

            {/* Quick Stats */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Estadísticas Rápidas</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 gap-4">
                  <div className="text-center">
                    <div className="text-2xl font-bold text-blue-600">
                      {event.spots - event.spotsLeft}
                    </div>
                    <div className="text-xs text-muted-foreground">Registrados</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-green-600">
                      {event.spotsLeft}
                    </div>
                    <div className="text-xs text-muted-foreground">Cupos disponibles</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-purple-600">
                      {event.pointsCost}
                    </div>
                    <div className="text-xs text-muted-foreground">Puntos por asistir</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-orange-600">
                      {Math.round(((event.spots - event.spotsLeft) / event.spots) * 100)}%
                    </div>
                    <div className="text-xs text-muted-foreground">Ocupación</div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="registrations" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Personas Registradas</CardTitle>
            </CardHeader>
            <CardContent>
              {registrations.length > 0 ? (
                <div className="space-y-3">
                  {registrations.map((registration) => (
                    <div 
                      key={registration.id}
                      className="flex items-center justify-between p-3 border rounded-lg"
                    >
                      <div className="flex items-center gap-3">
                        <Avatar className="h-8 w-8">
                          <AvatarImage src={registration.userAvatar} />
                          <AvatarFallback>
                            {registration.userName.split(' ').map(n => n[0]).join('')}
                          </AvatarFallback>
                        </Avatar>
                        <div>
                          <p className="font-medium text-sm">{registration.userName}</p>
                          <p className="text-xs text-muted-foreground">{registration.userEmail}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        {getAttendanceStatusIcon(registration.attendanceStatus)}
                        <span className="text-xs">
                          {getAttendanceStatusText(registration.attendanceStatus)}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8 text-muted-foreground">
                  <Users className="h-8 w-8 mx-auto mb-2 opacity-50" />
                  <p>No hay registros para este evento</p>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="performance" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm">Tasa de Asistencia</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-green-600">
                  {performance.attendanceRate.toFixed(1)}%
                </div>
                <div className="text-xs text-muted-foreground">
                  {performance.actualAttendance} de {performance.totalRegistrations} asistieron
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm">Puntos Distribuidos</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-purple-600">
                  {performance.pointsDistributed}
                </div>
                <div className="text-xs text-muted-foreground">
                  Total de puntos entregados
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm">Calificación Promedio</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-center gap-1">
                  <div className="text-2xl font-bold text-yellow-600">
                    {performance.averageRating?.toFixed(1) || "N/A"}
                  </div>
                  {performance.averageRating && (
                    <Star className="h-5 w-5 text-yellow-500 fill-current" />
                  )}
                </div>
                <div className="text-xs text-muted-foreground">
                  Basado en {performance.feedback.length} evaluaciones
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="feedback" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Comentarios de Participantes</CardTitle>
            </CardHeader>
            <CardContent>
              {performance.feedback.length > 0 ? (
                <div className="space-y-4">
                  {performance.feedback.map((feedback) => (
                    <div key={feedback.id} className="border-l-4 border-blue-200 pl-4 py-2">
                      <div className="flex items-center justify-between mb-2">
                        <span className="font-medium text-sm">{feedback.userName}</span>
                        <div className="flex items-center gap-1">
                          {[...Array(5)].map((_, i) => (
                            <Star 
                              key={i}
                              className={`h-4 w-4 ${
                                i < feedback.rating 
                                  ? 'text-yellow-500 fill-current' 
                                  : 'text-gray-300'
                              }`}
                            />
                          ))}
                        </div>
                      </div>
                      {feedback.comment && (
                        <p className="text-sm text-muted-foreground">{feedback.comment}</p>
                      )}
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8 text-muted-foreground">
                  <Star className="h-8 w-8 mx-auto mb-2 opacity-50" />
                  <p>No hay comentarios para este evento</p>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
