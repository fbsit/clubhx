
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { EventsViewToggle } from "./EventsViewToggle";

interface CalendarHeaderProps {
  viewMode: "calendar" | "list";
  onViewChange: (view: "calendar" | "list") => void;
  onAddEvent: () => void;
}

export function CalendarHeader({ viewMode, onViewChange, onAddEvent }: CalendarHeaderProps) {
  return (
    <div className="flex justify-between items-center">
      <h2 className="text-xl font-bold">Calendario de Eventos</h2>
      <div className="flex items-center gap-3">
        <EventsViewToggle view={viewMode} onViewChange={onViewChange} />
        <Button onClick={onAddEvent}>
          <Plus className="mr-2 h-4 w-4" />
          Nuevo Evento
        </Button>
      </div>
    </div>
  );
}
