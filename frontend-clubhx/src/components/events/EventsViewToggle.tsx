
import { Button } from "@/components/ui/button";
import { Calendar, List } from "lucide-react";

interface EventsViewToggleProps {
  view: "calendar" | "list";
  onViewChange: (view: "calendar" | "list") => void;
}

export function EventsViewToggle({ view, onViewChange }: EventsViewToggleProps) {
  return (
    <div className="flex items-center bg-muted/50 rounded-lg p-1 border">
      <Button
        variant={view === "calendar" ? "default" : "ghost"}
        size="sm"
        onClick={() => onViewChange("calendar")}
        className={`h-8 px-3 transition-all ${
          view === "calendar" 
            ? "shadow-sm" 
            : "hover:bg-muted/70"
        }`}
      >
        <Calendar className="h-4 w-4 mr-1.5" />
        <span className="text-sm font-medium">Cal</span>
      </Button>
      <Button
        variant={view === "list" ? "default" : "ghost"}
        size="sm"
        onClick={() => onViewChange("list")}
        className={`h-8 px-3 transition-all ${
          view === "list" 
            ? "shadow-sm" 
            : "hover:bg-muted/70"
        }`}
      >
        <List className="h-4 w-4 mr-1.5" />
        <span className="text-sm font-medium">Lista</span>
      </Button>
    </div>
  );
}
