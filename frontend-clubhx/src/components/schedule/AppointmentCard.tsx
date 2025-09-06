import { format } from "date-fns";
import { es } from "date-fns/locale";
import { Clock, MapPin, Video, User, Phone, Mail } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
type ClientAppointment = any;
const purposeLabels: Record<string,string> = {};
const statusLabels: Record<string,string> = {};

interface AppointmentCardProps {
  appointment: ClientAppointment;
  onReschedule?: (appointment: ClientAppointment) => void;
  onCancel?: (appointment: ClientAppointment) => void;
  onJoinMeeting?: (appointment: ClientAppointment) => void;
}

const getStatusColor = (status: ClientAppointment["status"]) => {
  switch (status) {
    case "confirmed":
      return "bg-green-100 text-green-800 border-green-200";
    case "requested":
      return "bg-yellow-100 text-yellow-800 border-yellow-200";
    case "in_progress":
      return "bg-blue-100 text-blue-800 border-blue-200";
    case "completed":
      return "bg-gray-100 text-gray-800 border-gray-200";
    case "cancelled":
      return "bg-red-100 text-red-800 border-red-200";
    case "rescheduled":
      return "bg-orange-100 text-orange-800 border-orange-200";
    default:
      return "bg-gray-100 text-gray-800 border-gray-200";
  }
};

export function AppointmentCard({ 
  appointment, 
  onReschedule, 
  onCancel, 
  onJoinMeeting 
}: AppointmentCardProps) {
  const isPast = appointment.date < new Date();
  const isToday = format(appointment.date, "yyyy-MM-dd") === format(new Date(), "yyyy-MM-dd");
  const canJoin = appointment.type === "videollamada" && appointment.status === "confirmed" && !isPast;

  return (
    <Card className="overflow-hidden transition-all hover:shadow-md">
      <CardContent className="p-4">
        <div className="flex items-start justify-between mb-3">
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-1">
              <h3 className="font-semibold text-sm">{appointment.title}</h3>
              {isToday && (
                <Badge variant="outline" className="text-xs bg-primary/10 text-primary border-primary/20">
                  Hoy
                </Badge>
              )}
            </div>
            <p className="text-xs text-muted-foreground mb-2">
              {appointment.description}
            </p>
          </div>
          <Badge 
            variant="outline" 
            className={`text-xs ${getStatusColor(appointment.status)}`}
          >
            {statusLabels[appointment.status]}
          </Badge>
        </div>

        {/* Fecha y hora */}
        <div className="flex items-center gap-4 mb-3 text-xs text-muted-foreground">
          <div className="flex items-center gap-1">
            <Clock className="h-3 w-3" />
            <span>
              {format(appointment.date, "dd 'de' MMMM", { locale: es })} • {appointment.time}
            </span>
          </div>
          <div className="text-xs">
            {appointment.duration} min
          </div>
        </div>

        {/* Tipo y ubicación */}
        <div className="flex items-center gap-1 mb-3 text-xs text-muted-foreground">
          {appointment.type === "videollamada" ? (
            <>
              <Video className="h-3 w-3" />
              <span>Videollamada</span>
            </>
          ) : (
            <>
              <MapPin className="h-3 w-3" />
              <span className="truncate">{appointment.location}</span>
            </>
          )}
        </div>

        {/* Propósito */}
        <div className="mb-3">
          <Badge variant="secondary" className="text-xs">
            {purposeLabels[appointment.purpose]}
          </Badge>
        </div>

        {/* Ejecutivo de ventas */}
        <div className="flex items-center justify-between mb-3 p-2 bg-muted/30 rounded-lg">
          <div className="flex items-center gap-2">
            <Avatar className="h-6 w-6">
              <AvatarImage src={appointment.salesPerson.avatar} />
              <AvatarFallback className="text-xs">
                {appointment.salesPerson.name.substring(0, 2).toUpperCase()}
              </AvatarFallback>
            </Avatar>
            <div className="min-w-0">
              <p className="text-xs font-medium truncate">
                {appointment.salesPerson.name}
              </p>
              <p className="text-xs text-muted-foreground">
                Ejecutivo de Ventas
              </p>
            </div>
          </div>
          <div className="flex gap-1">
            <Button
              variant="ghost"
              size="sm"
              className="h-6 w-6 p-0"
              onClick={() => window.open(`tel:${appointment.salesPerson.phone}`)}
            >
              <Phone className="h-3 w-3" />
            </Button>
            <Button
              variant="ghost"
              size="sm"
              className="h-6 w-6 p-0"
              onClick={() => window.open(`mailto:${appointment.salesPerson.email}`)}
            >
              <Mail className="h-3 w-3" />
            </Button>
          </div>
        </div>

        {/* Acciones */}
        {!isPast && appointment.status !== "cancelled" && (
          <div className="flex gap-2">
            {canJoin && (
              <Button 
                size="sm" 
                className="flex-1 text-xs h-8"
                onClick={() => onJoinMeeting?.(appointment)}
              >
                <Video className="h-3 w-3 mr-1" />
                Unirse
              </Button>
            )}
            {appointment.status === "confirmed" && (
              <>
                <Button
                  variant="outline"
                  size="sm"
                  className="text-xs h-8"
                  onClick={() => onReschedule?.(appointment)}
                >
                  Reagendar
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  className="text-xs h-8 text-destructive hover:text-destructive"
                  onClick={() => onCancel?.(appointment)}
                >
                  Cancelar
                </Button>
              </>
            )}
          </div>
        )}

        {/* Notas */}
        {appointment.notes && (
          <div className="mt-3 pt-3 border-t border-border/50">
            <p className="text-xs text-muted-foreground">
              <strong>Notas:</strong> {appointment.notes}
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}