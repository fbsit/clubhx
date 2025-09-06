import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { CalendarIcon, Clock, User, Video, MapPin, Link2 } from "lucide-react";
import { format } from "date-fns";
import { cn } from "@/lib/utils";
import { CalendarSettings, WorkingHours } from "./CalendarSettingsDialog";

type Customer = {
  id: string;
  name: string;
};

type NewVisitDialogProps = {
  isOpen: boolean;
  onClose: () => void;
  onSchedule: (visitData: {
    customerId: string;
    customerName: string;
    date: Date;
    time: string;
    purpose: string;
    notes: string;
    type: "presencial" | "videollamada";
    duration: number;
    meetingLink?: string;
  }) => void;
  calendarSettings: CalendarSettings;
};

// Mock customers data
const mockCustomers: Customer[] = [
  { id: "C001", name: "Salón Belleza Total" },
  { id: "C002", name: "Estética Moderna" },
  { id: "C003", name: "Hair & Style Studio" },
  { id: "C004", name: "Beauty Center Elite" },
  { id: "C005", name: "Salón Glamour" },
];

const defaultDurations = [
  { label: "30 min", value: 30 },
  { label: "1 hora", value: 60 },
  { label: "1h 30 min", value: 90 },
  { label: "2 horas", value: 120 },
];

export const NewVisitDialog: React.FC<NewVisitDialogProps> = ({
  isOpen,
  onClose,
  onSchedule,
  calendarSettings,
}) => {
  const [selectedCustomer, setSelectedCustomer] = useState("");
  const [selectedDate, setSelectedDate] = useState<Date>();
  const [time, setTime] = useState("");
  const [purpose, setPurpose] = useState("");
  const [customPurpose, setCustomPurpose] = useState("");
  const [notes, setNotes] = useState("");
  const [type, setType] = useState<"presencial" | "videollamada">("presencial");
  const [duration, setDuration] = useState<number>(60);
  const [meetingLink, setMeetingLink] = useState("");

  // Mostrar solo horas laborales del día seleccionado
  function getWorkingHoursForDate(date: Date | undefined) {
    if (!date) return null;
    const weekDays = ["sun", "mon", "tue", "wed", "thu", "fri", "sat"];
    const dayKey = weekDays[date.getDay()];
    const wh = calendarSettings.workingHours.find(w => w.day === dayKey);
    return wh && wh.enabled ? wh : null;
  }

  function generateTimeSlots(wh: WorkingHours | null): string[] {
    if (!wh) return [];
    const slots: string[] = [];
    let [sh, sm] = wh.start.split(":").map(Number);
    let [eh, em] = wh.end.split(":").map(Number);
    let current = sh * 60 + sm;
    const end = eh * 60 + em;
    while (current + duration <= end) {
      const h = Math.floor(current / 60);
      const m = current % 60;
      slots.push(`${h.toString().padStart(2,"0")}:${m.toString().padStart(2,"0")}`);
      current += 15; // intervalos de 15 min
    }
    return slots;
  }

  const wh = getWorkingHoursForDate(selectedDate);
  const availableSlots = generateTimeSlots(wh);

  // Generar link simulando un endpoint real (fake)
  const handleAutoGenerateMeetingLink = () => {
    setMeetingLink(`https://meet.fakevideo.com/${Math.random().toString(36).slice(2, 10)}`);
  };

  const handleSubmit = () => {
    const customer = mockCustomers.find(c => c.id === selectedCustomer);
    const finalPurpose = purpose === "otro" ? customPurpose : purpose;
    
    if (selectedCustomer && customer && selectedDate && time && finalPurpose && duration) {
      onSchedule({
        customerId: selectedCustomer,
        customerName: customer.name,
        date: selectedDate,
        time,
        purpose: finalPurpose,
        notes,
        type,
        duration,
        meetingLink: type === "videollamada" ? meetingLink : undefined,
      });
      // Reset form
      setSelectedCustomer("");
      setSelectedDate(undefined);
      setTime("");
      setPurpose("");
      setCustomPurpose("");
      setNotes("");
      setType("presencial");
      setDuration(60);
      setMeetingLink("");
      onClose();
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[500px] w-full max-w-full p-0 sm:p-6 rounded-lg"
        style={{ minWidth: 0 }}
      >
        <div className="p-4 sm:p-0">
          <DialogHeader>
            <DialogTitle className="text-lg sm:text-2xl">Programar Nueva Cita</DialogTitle>
          </DialogHeader>

          <div className="space-y-4 sm:space-y-6 py-3 sm:py-4">
            {/* Tipo de visita */}
            <div className="space-y-2">
              <Label>Tipo de cita</Label>
              <div className="flex gap-2 sm:gap-3">
                <Button
                  type="button"
                  variant={type === "presencial" ? "default" : "outline"}
                  onClick={() => setType("presencial")}
                  size="sm"
                  className="flex-1"
                >
                  <MapPin className="h-4 w-4 mr-1" />
                  Presencial
                </Button>
                <Button
                  type="button"
                  variant={type === "videollamada" ? "default" : "outline"}
                  onClick={() => setType("videollamada")}
                  size="sm"
                  className="flex-1"
                >
                  <Video className="h-4 w-4 mr-1" />
                  Videollamada
                </Button>
              </div>
            </div>

            {/* Customer Selection */}
            <div className="space-y-2">
              <Label>Seleccionar Cliente</Label>
              <Select value={selectedCustomer} onValueChange={setSelectedCustomer}>
                <SelectTrigger className="w-full min-h-[44px] sm:min-h-[40px] text-base">
                  <SelectValue placeholder="Seleccionar cliente..." />
                </SelectTrigger>
                <SelectContent>
                  {mockCustomers.map((customer) => (
                    <SelectItem key={customer.id} value={customer.id}>
                      <div className="flex items-center gap-2">
                        <User className="h-4 w-4" />
                        {customer.name}
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Date Selection */}
            <div className="space-y-2">
              <Label>Fecha de la cita</Label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    className={cn(
                      "w-full justify-start text-left font-normal min-h-[44px] sm:min-h-[40px] text-base",
                      !selectedDate && "text-muted-foreground"
                    )}
                  >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {selectedDate ? format(selectedDate, "PPP") : "Seleccionar fecha"}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                  <Calendar
                    mode="single"
                    selected={selectedDate}
                    onSelect={setSelectedDate}
                    disabled={(date) => date < new Date()}
                    initialFocus
                    className="p-3 pointer-events-auto"
                  />
                </PopoverContent>
              </Popover>
            </div>

            {/* Time Selection */}
            <div className="space-y-2">
              <Label htmlFor="time">
                Hora {calendarSettings.timezone && (
                  <span className="text-xs text-gray-500 ml-1">({calendarSettings.timezone})</span>
                )}
              </Label>
              <div className="relative">
                <Clock className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                {wh && availableSlots.length > 0 ? (
                  <select
                    id="time"
                    value={time}
                    className="pl-10 border rounded w-full py-3 sm:py-2 text-base"
                    onChange={e => setTime(e.target.value)}
                  >
                    <option value="">Seleccionar hora...</option>
                    {availableSlots.map(slot => (
                      <option value={slot} key={slot}>{slot}</option>
                    ))}
                  </select>
                ) : (
                  <Input
                    id="time"
                    type="time"
                    value={time}
                    onChange={(e) => setTime(e.target.value)}
                    className="pl-10 text-base py-3 sm:py-2"
                    placeholder="09:00"
                    disabled
                  />
                )}
              </div>
              {!wh && (
                <div className="text-xs text-yellow-700 mt-1">
                  Día fuera de horario laboral.
                </div>
              )}
            </div>

            {/* Duración */}
            <div className="space-y-2">
              <Label>Duración</Label>
              <Select
                value={String(duration)}
                onValueChange={val => setDuration(Number(val))}
              >
                <SelectTrigger className="w-full min-h-[44px] sm:min-h-[40px] text-base">
                  <SelectValue placeholder="Duración" />
                </SelectTrigger>
                <SelectContent>
                  {defaultDurations.map(d => (
                    <SelectItem key={d.value} value={String(d.value)}>
                      {d.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Purpose */}
            <div className="space-y-2">
              <Label htmlFor="purpose">Propósito</Label>
              <Select 
                value={purpose} 
                onValueChange={(value) => {
                  setPurpose(value);
                  if (value !== "otro") {
                    setCustomPurpose(""); // Clear custom purpose if not "otro"
                  }
                }}
              >
                <SelectTrigger className="text-base py-3 sm:py-2">
                  <SelectValue placeholder="Selecciona el propósito de la visita" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="presentacion_productos">Presentación de productos nuevos</SelectItem>
                  <SelectItem value="seguimiento_pedidos">Seguimiento de pedidos</SelectItem>
                  <SelectItem value="negociacion_precios">Negociación de precios/descuentos</SelectItem>
                  <SelectItem value="capacitacion">Capacitación en productos</SelectItem>
                  <SelectItem value="resolucion_problemas">Resolución de problemas/quejas</SelectItem>
                  <SelectItem value="planificacion_estrategia">Planificación estrategia comercial</SelectItem>
                  <SelectItem value="visita_cortesia">Visita de cortesía/mantenimiento</SelectItem>
                  <SelectItem value="cobranza">Gestión de cobranzas</SelectItem>
                  <SelectItem value="prospeccion">Prospección/primera visita</SelectItem>
                  <SelectItem value="renovacion_contrato">Renovación de contrato</SelectItem>
                  <SelectItem value="otro">Otro (especificar)</SelectItem>
                </SelectContent>
              </Select>
              
              {/* Custom purpose input - only show when "otro" is selected */}
              {purpose === "otro" && (
                <Input
                  value={customPurpose}
                  onChange={(e) => setCustomPurpose(e.target.value)}
                  placeholder="Especifica el propósito de la visita"
                  className="text-base py-3 sm:py-2"
                />
              )}
            </div>

            {/* Meeting Link (solo para videollamada) */}
            {type === "videollamada" && (
              <div className="space-y-2">
                <Label htmlFor="meetingLink">Enlace de videollamada</Label>
                <div className="flex gap-2 items-center">
                  <Input
                    id="meetingLink"
                    value={meetingLink}
                    onChange={(e) => setMeetingLink(e.target.value)}
                    placeholder="Pega el enlace o genera uno"
                    className="text-base py-3 sm:py-2"
                  />
                  <Button type="button" size="icon" variant="outline"
                    onClick={handleAutoGenerateMeetingLink}
                    title="Generar enlace automático"
                  >
                    <Link2 className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            )}

            {/* Notes */}
            <div className="space-y-2">
              <Label htmlFor="notes">Notas adicionales (opcional)</Label>
              <Input
                id="notes"
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                placeholder="Cualquier información adicional..."
                className="text-base py-3 sm:py-2"
              />
            </div>
          </div>

          <DialogFooter className="flex-col gap-2 sm:flex-row sm:gap-2 mt-2">
            <Button variant="outline" onClick={onClose} className="w-full sm:w-auto">
              Cancelar
            </Button>
            <Button
              onClick={handleSubmit}
              disabled={
                !selectedCustomer ||
                !selectedDate ||
                !time ||
                !purpose ||
                (purpose === "otro" && !customPurpose.trim()) ||
                !duration ||
                (type === "videollamada" && !meetingLink)
              }
              className="w-full sm:w-auto"
            >
              Programar Cita
            </Button>
          </DialogFooter>
        </div>
      </DialogContent>
    </Dialog>
  );
};
