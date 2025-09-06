
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { CalendarIcon, Clock } from "lucide-react";
import { format } from "date-fns";
import { cn } from "@/lib/utils";

type ScheduleVisitDialogProps = {
  isOpen: boolean;
  onClose: () => void;
  customerName: string;
  onSchedule: (visitData: { date: Date; time: string; purpose: string; notes: string }) => void;
};

export const ScheduleVisitDialog: React.FC<ScheduleVisitDialogProps> = ({
  isOpen,
  onClose,
  customerName,
  onSchedule,
}) => {
  const [selectedDate, setSelectedDate] = useState<Date>();
  const [time, setTime] = useState("");
  const [purpose, setPurpose] = useState("");
  const [notes, setNotes] = useState("");

  const handleSubmit = () => {
    if (selectedDate && time && purpose) {
      onSchedule({
        date: selectedDate,
        time,
        purpose,
        notes,
      });
      // Reset form
      setSelectedDate(undefined);
      setTime("");
      setPurpose("");
      setNotes("");
      onClose();
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Programar Visita - {customerName}</DialogTitle>
        </DialogHeader>
        
        <div className="space-y-6 py-4">
          {/* Date Selection */}
          <div className="space-y-2">
            <Label>Fecha de la visita</Label>
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  className={cn(
                    "w-full justify-start text-left font-normal",
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
            <Label htmlFor="time">Hora</Label>
            <div className="relative">
              <Clock className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
              <Input
                id="time"
                type="time"
                value={time}
                onChange={(e) => setTime(e.target.value)}
                className="pl-10"
                placeholder="09:00"
              />
            </div>
          </div>

          {/* Purpose */}
          <div className="space-y-2">
            <Label htmlFor="purpose">Propósito de la visita</Label>
            <Input
              id="purpose"
              value={purpose}
              onChange={(e) => setPurpose(e.target.value)}
              placeholder="Ej: Presentación de nuevos productos"
            />
          </div>

          {/* Notes */}
          <div className="space-y-2">
            <Label htmlFor="notes">Notas adicionales (opcional)</Label>
            <Input
              id="notes"
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="Cualquier información adicional..."
            />
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={onClose}>
            Cancelar
          </Button>
          <Button 
            onClick={handleSubmit}
            disabled={!selectedDate || !time || !purpose}
          >
            Programar Visita
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
