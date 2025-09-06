import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Calendar, Clock, MapPin, Users, CalendarPlus, CheckCircle, Star, Minus, Plus } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Separator } from "@/components/ui/separator";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { useIsMobile } from "@/hooks/use-mobile";
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { eventRegistrationApi } from "@/services/eventRegistrationApi";
import { useEventRegistrations } from "@/hooks/useEventRegistrations";
import type { Event } from "@/types/event";

interface EventRegistrationDialogProps {
  event: Event;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onRegister: (eventId: string, attendeesCount: number) => void;
  userPoints?: number; // Puntos actuales del usuario (reales)
}

export default function EventRegistrationDialog({
  event,
  open,
  onOpenChange,
  onRegister,
  userPoints = 0
}: EventRegistrationDialogProps) {
  const { registerForEvent } = useEventRegistrations();
  const [step, setStep] = useState(1);
  const [isRegistering, setIsRegistering] = useState(false);
  const [attendeesCount, setAttendeesCount] = useState(1);
  const [notes, setNotes] = useState("");
  const isMobile = useIsMobile();
  
  const maxAllowed = Math.min(
    event.maxAttendeesPerCompany || 5, // Default máximo 5 por empresa
    event.spotsLeft // No puede exceder cupos disponibles
  );
  
  const totalCost = event.pointsCost * attendeesCount;
  const remainingPoints = userPoints - totalCost;
  const hasEnoughPoints = totalCost <= userPoints;

  const handleRegister = async () => {
    if (attendeesCount < 1) {
      toast.error("Debe seleccionar al menos 1 asistente");
      return;
    }

    if (attendeesCount > event.maxAttendeesPerCompany) {
      toast.error(`Máximo ${event.maxAttendeesPerCompany} asistentes por empresa`);
      return;
    }

    const totalCost = attendeesCount * event.pointsCost;
    if (totalCost > userPoints) {
      toast.error("Puntos insuficientes para esta inscripción");
      return;
    }

    try {
      setIsRegistering(true);
      
      // Registrar usando el hook
      const registration = await registerForEvent(event.id, {
        attendeesCount,
        notes: notes.trim() || undefined,
      });

      if (registration) {
        onRegister(event.id, attendeesCount);
        setStep(3);
      }
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Error al inscribirse al evento';
      toast.error(errorMessage);
    } finally {
      setIsRegistering(false);
    }
  };

  const handleClose = () => {
    setStep(1);
    setAttendeesCount(1);
    onOpenChange(false);
  };

  const incrementAttendees = () => {
    if (attendeesCount < maxAllowed) {
      setAttendeesCount(prev => prev + 1);
    }
  };

  const decrementAttendees = () => {
    if (attendeesCount > 1) {
      setAttendeesCount(prev => prev - 1);
    }
  };

  const content = (
    <div className="space-y-6">
      {step === 1 && (
        <>
          <div className="space-y-4">
            <div className="aspect-video relative overflow-hidden rounded-lg">
              <img 
                src={event.image} 
                alt={event.title} 
                className="object-cover w-full h-full"
              />
              <Badge className="absolute top-3 right-3 bg-primary/90">
                {event.brand}
              </Badge>
            </div>
            
            <div className="space-y-2">
              <h3 className="text-lg font-semibold">{event.title}</h3>
              <div className="flex items-center gap-4 text-sm text-muted-foreground">
                <div className="flex items-center gap-1">
                  <Calendar className="h-4 w-4" />
                  {event.date}
                </div>
                <div className="flex items-center gap-1">
                  <Clock className="h-4 w-4" />
                  {event.time}
                </div>
              </div>
              <div className="flex items-center gap-1 text-sm text-muted-foreground">
                <MapPin className="h-4 w-4" />
                {event.location}
              </div>
            </div>
            
            <p className="text-sm text-muted-foreground">{event.description}</p>
            
            {event.speaker && (
              <div className="flex items-center gap-3 p-3 bg-muted/50 rounded-lg">
                <Avatar className="h-10 w-10">
                  <AvatarImage src={event.speaker.avatar} alt={event.speaker.name} />
                  <AvatarFallback>{event.speaker.name.substring(0, 2)}</AvatarFallback>
                </Avatar>
                <div>
                  <p className="font-medium text-sm">{event.speaker.name}</p>
                  <p className="text-xs text-muted-foreground">{event.speaker.role}</p>
                </div>
              </div>
            )}
            
            <Separator />
            
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Users className="h-4 w-4 text-muted-foreground" />
                  <span className="text-sm">Cupos disponibles</span>
                </div>
                <span className="text-sm font-medium">{event.spotsLeft} de {event.spots}</span>
              </div>
              
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Star className="h-4 w-4 text-blue-500" />
                  <span className="text-sm">Costo por persona</span>
                </div>
                <span className="text-sm font-medium text-blue-600">
                  {event.pointsCost} puntos
                </span>
              </div>
              
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Star className="h-4 w-4 text-red-500" />
                  <span className="text-sm">Costo total</span>
                </div>
                <span className="text-sm font-medium text-red-600">
                  {totalCost} puntos
                </span>
              </div>
              
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Star className="h-4 w-4 text-green-500" />
                  <span className="text-sm">Puntos restantes</span>
                </div>
                <span className={`text-sm font-medium ${remainingPoints >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                  {remainingPoints} puntos
                </span>
              </div>
            </div>
            
            <Separator />
            
            <div className="space-y-3">
              <Label className="text-sm font-medium">Número de asistentes</Label>
              <div className="flex items-center justify-between p-3 border rounded-lg">
                <div className="space-y-1">
                  <p className="text-sm font-medium">¿Cuántas personas asistirán?</p>
                  <p className="text-xs text-muted-foreground">
                    Máximo {event.maxAttendeesPerCompany || 5} personas por empresa
                  </p>
                </div>
                
                <div className="flex items-center gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    className="h-8 w-8 p-0"
                    onClick={decrementAttendees}
                    disabled={attendeesCount <= 1}
                  >
                    <Minus className="h-4 w-4" />
                  </Button>
                  
                  <span className="text-lg font-semibold min-w-[2rem] text-center">
                    {attendeesCount}
                  </span>
                  
                  <Button
                    variant="outline"
                    size="sm"
                    className="h-8 w-8 p-0"
                    onClick={incrementAttendees}
                    disabled={attendeesCount >= maxAllowed}
                  >
                    <Plus className="h-4 w-4" />
                  </Button>
                </div>
              </div>
              
              {attendeesCount > 1 && (
                <div className="text-xs text-muted-foreground bg-muted/50 p-2 rounded">
                  Se reservarán {attendeesCount} cupos de {event.spotsLeft} disponibles
                </div>
              )}
              
              {!hasEnoughPoints && (
                <div className="text-xs text-red-600 bg-red-50 border border-red-200 p-2 rounded">
                  ⚠️ No tienes suficientes puntos. Necesitas {totalCost - userPoints} puntos más.
                </div>
              )}
            </div>
          </div>
          
          <div className="flex gap-2">
            <Button variant="outline" onClick={handleClose} className="flex-1">
              Cancelar
            </Button>
            <Button 
              onClick={() => setStep(2)} 
              className="flex-1"
              disabled={!hasEnoughPoints}
            >
              Continuar
            </Button>
          </div>
        </>
      )}
      
      {step === 2 && (
        <>
          <div className="space-y-4">
            <div className="text-center space-y-2">
              <h3 className="text-lg font-semibold">Confirmar inscripción</h3>
              <p className="text-sm text-muted-foreground">
                Vas a canjear {totalCost} puntos para inscribir a {attendeesCount} persona{attendeesCount > 1 ? 's' : ''} en "{event.title}"
              </p>
            </div>
            
            <Card>
              <CardHeader>
                <CardTitle className="text-base">Términos y condiciones</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3 text-sm">
                <p>• Se canjearán {totalCost} puntos de tu cuenta</p>
                <p>• Los cupos son limitados y se asignan por orden de inscripción</p>
                <p>• Se reservarán {attendeesCount} cupo{attendeesCount > 1 ? 's' : ''} para tu empresa</p>
                <p>• Te quedarán {remainingPoints} puntos después del canje</p>
                <p>• Si no pueden asistir, por favor cancela con 24 horas de anticipación</p>
                <p>• Se enviará un recordatorio por email 1 día antes del evento</p>
              </CardContent>
            </Card>
          </div>
          
          <div className="flex gap-2">
            <Button variant="outline" onClick={() => setStep(1)} className="flex-1">
              Volver
            </Button>
            <Button 
              onClick={handleRegister} 
              disabled={isRegistering}
              className="flex-1"
            >
              {isRegistering ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2" />
                  Inscribiendo...
                </>
              ) : (
                <>
                  <CalendarPlus className="mr-2 h-4 w-4" />
                  Confirmar inscripción
                </>
              )}
            </Button>
          </div>
        </>
      )}
      
      {step === 3 && (
        <>
          <div className="text-center space-y-4">
            <div className="mx-auto w-16 h-16 bg-green-100 rounded-full flex items-center justify-center">
              <CheckCircle className="h-8 w-8 text-green-600" />
            </div>
            
            <div className="space-y-2">
              <h3 className="text-lg font-semibold text-green-700">¡Inscripción exitosa!</h3>
              <p className="text-sm text-muted-foreground">
                {attendeesCount === 1 
                  ? `Te has inscrito exitosamente en "${event.title}"`
                  : `Has inscrito a ${attendeesCount} personas exitosamente en "${event.title}"`
                }
              </p>
            </div>
            
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
              <div className="flex items-center justify-center gap-2">
                <Star className="h-5 w-5 text-blue-600" />
                <span className="text-sm font-medium text-blue-800">
                  Has canjeado {totalCost} puntos
                </span>
              </div>
              <div className="text-center mt-2">
                <span className="text-xs text-blue-700">
                  Te quedan {remainingPoints} puntos disponibles
                </span>
              </div>
            </div>
            
            <div className="text-xs text-muted-foreground space-y-1">
              <p>• Recibirás un email de confirmación</p>
              <p>• Te recordaremos el evento 1 día antes</p>
              <p>• Los puntos se han descontado de tu cuenta</p>
            </div>
          </div>
          
          <Button onClick={handleClose} className="w-full">
            Cerrar
          </Button>
        </>
      )}
    </div>
  );

  if (isMobile) {
    return (
      <Sheet open={open} onOpenChange={onOpenChange}>
        <SheetContent side="bottom" className="max-h-[90vh] overflow-y-auto">
          <SheetHeader>
            <SheetTitle>
              {step === 1 ? "Detalles del evento" : 
               step === 2 ? "Confirmar inscripción" : 
               "¡Inscripción exitosa!"}
            </SheetTitle>
          </SheetHeader>
          <div className="mt-6">
            {content}
          </div>
        </SheetContent>
      </Sheet>
    );
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>
            {step === 1 ? "Detalles del evento" : 
             step === 2 ? "Confirmar inscripción" : 
             "¡Inscripción exitosa!"}
          </DialogTitle>
        </DialogHeader>
        {content}
      </DialogContent>
    </Dialog>
  );
}