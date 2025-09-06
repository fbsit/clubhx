
import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { format } from "date-fns";
import { es } from "date-fns/locale";

interface MobileCalendarHeaderProps {
  currentDate: Date;
  onPreviousMonth: () => void;
  onNextMonth: () => void;
  onToday: () => void;
}

export function MobileCalendarHeader({ 
  currentDate, 
  onPreviousMonth, 
  onNextMonth, 
  onToday 
}: MobileCalendarHeaderProps) {
  return (
    <div className="flex items-center justify-between p-4 border-b bg-background">
      <Button
        variant="outline"
        size="icon"
        onClick={onPreviousMonth}
        className="h-9 w-9 shrink-0"
      >
        <ChevronLeft className="h-4 w-4" />
      </Button>
      
      <div className="flex flex-col items-center flex-1 mx-4">
        <h2 className="text-lg font-semibold capitalize">
          {format(currentDate, "MMMM yyyy", { locale: es })}
        </h2>
        <Button
          variant="ghost"
          size="sm"
          onClick={onToday}
          className="text-xs text-muted-foreground h-6 px-2 mt-0.5"
        >
          Ir a hoy
        </Button>
      </div>
      
      <Button
        variant="outline"
        size="icon"
        onClick={onNextMonth}
        className="h-9 w-9 shrink-0"
      >
        <ChevronRight className="h-4 w-4" />
      </Button>
    </div>
  );
}
