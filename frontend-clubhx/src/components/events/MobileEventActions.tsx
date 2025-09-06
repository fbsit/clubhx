
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { EventsViewToggle } from "./EventsViewToggle";

interface MobileEventActionsProps {
  viewMode: "calendar" | "list";
  onViewChange: (view: "calendar" | "list") => void;
  onAddEvent: () => void;
}

export function MobileEventActions({ 
  viewMode, 
  onViewChange, 
  onAddEvent 
}: MobileEventActionsProps) {
  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 md:hidden">
      <div className="bg-background/95 backdrop-blur-md border-t border-border/50 px-4 py-3 shadow-lg">
        <div className="flex items-center justify-between gap-3 max-w-md mx-auto">
          <EventsViewToggle view={viewMode} onViewChange={onViewChange} />
          <Button 
            onClick={onAddEvent} 
            className="flex-1 max-w-[180px] shadow-md"
            size="default"
          >
            <Plus className="mr-2 h-4 w-4" />
            Nuevo Evento
          </Button>
        </div>
      </div>
      {/* Safe area spacing for devices with home indicators */}
      <div className="h-safe-area-inset-bottom bg-background/95" />
    </div>
  );
}
