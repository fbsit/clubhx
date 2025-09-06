import React, { useMemo, useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Event } from "@/types/event";
import { addSalesAppointment, addSalesEventRegistration, eventToAppointment, getCompanyRegistrationsForEvent } from "@/utils/salesScheduleStore";
import { toast } from "@/hooks/use-toast";

// Minimal mock customers list (could be replaced by real data later)
const customers = [
  { id: "C001", name: "Salón Belleza Total" },
  { id: "C002", name: "Estética Moderna" },
  { id: "C003", name: "Hair & Style Studio" },
  { id: "C004", name: "Beauty Center Elite" },
  { id: "C005", name: "Salón Glamour" },
];

type Props = {
  open: boolean;
  onOpenChange: (v: boolean) => void;
  event: Event | null;
  onSuccess?: () => void;
};

export default function SalesEventEnrollmentDialog({ open, onOpenChange, event, onSuccess }: Props) {
  const [selectedCustomer, setSelectedCustomer] = useState<string>("");
  const [submitting, setSubmitting] = useState(false);

  const isOnline = event?.eventType === "online";
  const companyRegsCount = useMemo(() => {
    if (!event || !selectedCustomer) return 0;
    return getCompanyRegistrationsForEvent(event.id, selectedCustomer).length;
  }, [event, selectedCustomer]);

  const companyLimitReached = useMemo(() => {
    if (!event || !event.maxAttendeesPerCompany) return false;
    return companyRegsCount >= event.maxAttendeesPerCompany;
  }, [event, companyRegsCount]);

  const handleConfirm = async () => {
    if (!event || !selectedCustomer) return;
    setSubmitting(true);

    // Enforce per-company limit if defined
    if (companyLimitReached) {
      toast({
        title: "Límite por empresa alcanzado",
        description: `Este curso permite hasta ${event.maxAttendeesPerCompany} asistente(s) por empresa.`,
        variant: "destructive",
      });
      setSubmitting(false);
      return;
    }

    // Save registration
    addSalesEventRegistration({
      id: `reg-${Date.now()}`,
      eventId: event.id,
      companyName: selectedCustomer,
      createdAt: new Date().toISOString(),
    });

    // Create calendar appointment at event time
    const appt = eventToAppointment(event, selectedCustomer);
    addSalesAppointment(appt);

    toast({
      title: "Cliente registrado",
      description: `${selectedCustomer} fue agendado al curso y agregado a tu calendario.`,
    });

    setSelectedCustomer("");
    setSubmitting(false);
    onOpenChange(false);
    onSuccess?.();
  };

  if (!event) return null;

  const spotsInfo = (
    <div className="flex items-center gap-2 text-xs text-muted-foreground">
      <Badge variant="secondary">{event.eventType === "online" ? "Online" : "Presencial"}</Badge>
      <span>{event.date} · {event.time}</span>
      <span>·</span>
      <span>{event.location}</span>
    </div>
  );

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[480px]">
        <DialogHeader>
          <DialogTitle>Agendar cliente al curso</DialogTitle>
          <div className="text-sm text-muted-foreground">
            {event.title} · {event.brand}
          </div>
          {spotsInfo}
        </DialogHeader>

        <div className="space-y-4 py-2">
          <div className="space-y-2">
            <Label>Cliente</Label>
            <Select value={selectedCustomer} onValueChange={setSelectedCustomer}>
              <SelectTrigger>
                <SelectValue placeholder="Seleccionar cliente" />
              </SelectTrigger>
              <SelectContent>
                {customers.map((c) => (
                  <SelectItem key={c.id} value={c.name}>{c.name}</SelectItem>
                ))}
              </SelectContent>
            </Select>
            {event.maxAttendeesPerCompany && selectedCustomer && (
              <p className={`text-xs ${companyLimitReached ? "text-destructive" : "text-muted-foreground"}`}>
                Cupo por empresa: {companyRegsCount}/{event.maxAttendeesPerCompany}
              </p>
            )}
          </div>

          {isOnline && event.onlineUrl && (
            <div className="text-xs text-muted-foreground">
              Este curso es online. Enlace: {event.onlineUrl}
            </div>
          )}
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)} disabled={submitting}>Cancelar</Button>
          <Button onClick={handleConfirm} disabled={!selectedCustomer || submitting}>
            Confirmar inscripción
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
