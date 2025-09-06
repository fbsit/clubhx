import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { CalendarIcon, Clock } from "lucide-react";
import { format, addDays, isSameDay } from "date-fns";
import { es } from "date-fns/locale";
import { cn } from "@/lib/utils";

interface TimeSlot {
  time: string;
  available: boolean;
}

interface ScheduleSelectorProps {
  selectedDate?: Date;
  selectedTime?: string;
  onDateChange: (date: Date) => void;
  onTimeChange: (time: string) => void;
}

// Mock availability data - in real app this would come from API
const getAvailableSlots = (date: Date): TimeSlot[] => {
  const slots = [
    "09:00", "09:30", "10:00", "10:30", "11:00", "11:30",
    "12:00", "12:30", "14:00", "14:30", "15:00", "15:30",
    "16:00", "16:30", "17:00", "17:30", "18:00"
  ];

  // Simulate some occupied slots based on date
  const occupiedSlots = [
    "10:00", "14:30", "16:00" // Simulate occupied times
  ];

  return slots.map(time => ({
    time,
    available: !occupiedSlots.includes(time)
  }));
};

export function AdvancedScheduleSelector({ 
  selectedDate, 
  selectedTime, 
  onDateChange, 
  onTimeChange 
}: ScheduleSelectorProps) {
  const [datePickerOpen, setDatePickerOpen] = useState(false);
  
  const availableSlots = selectedDate ? getAvailableSlots(selectedDate) : [];

  return (
    <div className="space-y-4">
      {/* Date Selector */}
      <div className="space-y-2">
        <label className="text-sm font-medium">Fecha propuesta</label>
        <Popover open={datePickerOpen} onOpenChange={setDatePickerOpen}>
          <PopoverTrigger asChild>
            <Button
              variant="outline"
              className={cn(
                "w-full justify-start text-left font-normal",
                !selectedDate && "text-muted-foreground"
              )}
            >
              <CalendarIcon className="mr-2 h-4 w-4" />
              {selectedDate ? 
                format(selectedDate, "PPP", { locale: es }) : 
                <span>Selecciona una fecha</span>
              }
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-auto p-0" align="start">
            <Calendar
              mode="single"
              selected={selectedDate}
              onSelect={(date) => {
                if (date) {
                  onDateChange(date);
                  setDatePickerOpen(false);
                }
              }}
              initialFocus
              className="pointer-events-auto"
              disabled={(date) => date < new Date()}
            />
          </PopoverContent>
        </Popover>
      </div>

      {/* Time Slots Grid */}
      {selectedDate && (
        <div className="space-y-2">
          <label className="text-sm font-medium flex items-center gap-2">
            <Clock className="h-4 w-4" />
            Horarios disponibles para {format(selectedDate, "dd 'de' MMMM", { locale: es })}
          </label>
          
          <div className="grid grid-cols-3 sm:grid-cols-4 gap-2">
            {availableSlots.map((slot) => (
              <Button
                key={slot.time}
                variant={selectedTime === slot.time ? "default" : "outline"}
                className={cn(
                  "h-10 text-sm",
                  !slot.available && "opacity-50 cursor-not-allowed bg-muted text-muted-foreground",
                  slot.available && selectedTime === slot.time && "bg-primary text-primary-foreground",
                  slot.available && selectedTime !== slot.time && "hover:bg-muted"
                )}
                disabled={!slot.available}
                onClick={() => slot.available && onTimeChange(slot.time)}
              >
                {slot.time}
              </Button>
            ))}
          </div>
          
          <div className="flex items-center gap-4 text-xs text-muted-foreground mt-3">
            <div className="flex items-center gap-1">
              <div className="w-3 h-3 border border-input rounded bg-background"></div>
              <span>Disponible</span>
            </div>
            <div className="flex items-center gap-1">
              <div className="w-3 h-3 bg-muted rounded"></div>
              <span>Ocupado</span>
            </div>
            <div className="flex items-center gap-1">
              <div className="w-3 h-3 bg-primary rounded"></div>
              <span>Seleccionado</span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}