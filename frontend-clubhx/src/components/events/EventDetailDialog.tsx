
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { Sheet, SheetContent } from "@/components/ui/sheet";
import { useIsMobile } from "@/hooks/use-mobile";
import EventDetailView from "./EventDetailView";
import type { Event } from "@/types/event";

interface EventDetailDialogProps {
  open: boolean;
  event: Event | null;
  onClose: () => void;
  onEdit: () => void;
}

export function EventDetailDialog({ open, event, onClose, onEdit }: EventDetailDialogProps) {
  const isMobile = useIsMobile();
  
  if (!event) return null;

  if (isMobile) {
    return (
      <Sheet open={open} onOpenChange={onClose}>
        <SheetContent 
          side="bottom" 
          className="h-[95vh] p-0 overflow-hidden flex flex-col"
          closeButton={false}
        >
          <EventDetailView 
            event={event} 
            onEdit={onEdit}
            onClose={onClose}
            isMobile={true}
          />
        </SheetContent>
      </Sheet>
    );
  }

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-5xl max-h-[90vh] overflow-y-auto p-0">
        <EventDetailView 
          event={event} 
          onEdit={onEdit}
          onClose={onClose}
          isMobile={false}
        />
      </DialogContent>
    </Dialog>
  );
}
