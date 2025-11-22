import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Clock, Calendar, MapPin, Video } from "lucide-react";
import { format } from "date-fns";
import { es } from "date-fns/locale";
type ClientAppointment = any;

const purposeLabels: Record<string,string> = {
  product_demo: "Presentación de productos",
  new_brand: "Nueva marca",
  training: "Capacitación",
  follow_up: "Seguimiento",
  collection: "Cobranza",
  other: "Otro",
};
import { AdvancedScheduleSelector } from "./AdvancedScheduleSelector";
import { Badge } from "@/components/ui/badge";

interface RescheduleAppointmentDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  appointment: ClientAppointment | null;
  onConfirm: (appointmentId: string, newDate: Date, newTime: string, reason?: string) => void;
}

export function RescheduleAppointmentDialog({ 
  open, 
  onOpenChange, 
  appointment, 
  onConfirm 
}: RescheduleAppointmentDialogProps) {
  const [newDate, setNewDate] = useState<Date>();
  const [newTime, setNewTime] = useState<string>("");
  const [reason, setReason] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!appointment || !newDate || !newTime) {
      return;
    }

    onConfirm(appointment.id, newDate, newTime, reason);

    // Reset form
    setNewDate(undefined);
    setNewTime("");
    setReason("");
    onOpenChange(false);
  };

  if (!appointment) return null;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Reagendar Cita</DialogTitle>
          <DialogDescription>
            Selecciona una nueva fecha y hora para tu cita
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Información de la cita actual */}
          <div className="border rounded-lg p-4 bg-muted/30">
            <h4 className="font-medium text-sm mb-3 flex items-center gap-2">
              <Calendar className="h-4 w-4" />
              Cita Actual
            </h4>
            
            <div className="space-y-2 text-sm">
              <div className="flex items-center justify-between">
                <span className="font-medium">{appointment.title}</span>
                <Badge variant="outline" className="text-xs">
                  {purposeLabels[appointment.purpose]}
                </Badge>
              </div>
              
              <div className="flex items-center gap-2 text-muted-foreground">
                <Clock className="h-3 w-3" />
                <span>
                  {format(appointment.date, "dd 'de' MMMM 'a las' HH:mm", { locale: es })}
                </span>
              </div>
              
              <div className="flex items-center gap-2 text-muted-foreground">
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

              <div className="flex items-center gap-2 pt-2 border-t border-border/50">
                <Avatar className="h-6 w-6">
                  <AvatarImage src={appointment.salesPerson.avatar} />
                  <AvatarFallback className="text-xs">
                    {appointment.salesPerson.name.substring(0, 2).toUpperCase()}
                  </AvatarFallback>
                </Avatar>
                <span className="text-xs">{appointment.salesPerson.name}</span>
              </div>
            </div>
          </div>

          {/* Selector de nueva fecha y hora */}
          <div className="space-y-2">
            <Label className="font-medium">Nueva Fecha y Hora</Label>
            <AdvancedScheduleSelector
              selectedDate={newDate}
              selectedTime={newTime}
              onDateChange={setNewDate}
              onTimeChange={setNewTime}
            />
          </div>

          {/* Razón del reagendamiento */}
          <div className="space-y-2">
            <Label htmlFor="reason">Motivo del reagendamiento (opcional)</Label>
            <Textarea
              id="reason"
              placeholder="ej. Cambio en horario del salón, emergencia, etc."
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              rows={2}
            />
          </div>

          {/* Confirmación de cambios */}
          {newDate && newTime && (
            <div className="border rounded-lg p-4 bg-primary/5 border-primary/20">
              <h4 className="font-medium text-sm mb-2 text-primary">
                Nueva Programación
              </h4>
              <div className="text-sm text-primary/80">
                <div className="flex items-center gap-2">
                  <Clock className="h-3 w-3" />
                  <span>
                    {format(newDate, "dd 'de' MMMM 'a las'", { locale: es })} {newTime}
                  </span>
                </div>
              </div>
            </div>
          )}

          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              Cancelar
            </Button>
            <Button 
              type="submit" 
              disabled={!newDate || !newTime}
            >
              Confirmar Reagendamiento
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}