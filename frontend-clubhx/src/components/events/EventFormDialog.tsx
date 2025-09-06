
import { useState } from "react";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import EventBasicInfoForm from "./form/EventBasicInfoForm";
import EventTypeSelector from "./form/EventTypeSelector";
import EventLocationForm from "./form/EventLocationForm";
import EventColorSelector from "./form/EventColorSelector";
import EventConfigurationForm from "./form/EventConfigurationForm";
import type { Event } from "@/types/event";

interface EventFormDialogProps {
  open: boolean;
  setOpen: (open: boolean) => void;
  event: Event;
  isNew: boolean;
  onSave?: (event: Event) => Promise<void>;
}

export function EventFormDialog({ open, setOpen, event, isNew, onSave }: EventFormDialogProps) {
  const [eventType, setEventType] = useState<"online" | "presencial">(event.eventType || "presencial");
  const [selectedColor, setSelectedColor] = useState(event.color || "#3b82f6");
  const [isSaving, setIsSaving] = useState(false);

  const handleImageSelected = (imageUrl: string) => {
    console.log("Imagen seleccionada:", imageUrl);
  };

  const handleSave = async () => {
    if (!onSave) return;
    
    try {
      setIsSaving(true);
      const updatedEvent = {
        ...event,
        eventType,
        color: selectedColor,
      };
      await onSave(updatedEvent);
    } catch (error) {
      console.error('Error al guardar evento:', error);
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{isNew ? "Crear Nuevo Evento" : "Editar Evento"}</DialogTitle>
          <DialogDescription>
            {isNew ? "Complete los detalles para crear un nuevo evento" : "Modifique los detalles del evento"}
          </DialogDescription>
        </DialogHeader>
        
        <div className="grid gap-6 py-4">
          <EventBasicInfoForm
            title={event.title}
            brand={event.brand}
            description={event.description}
            date={event.date}
            time={event.time}
          />

          <EventTypeSelector
            eventType={eventType}
            onEventTypeChange={setEventType}
          />

          <EventLocationForm
            eventType={eventType}
            location={event.location}
            address={event.address}
            onlineUrl={event.onlineUrl}
          />

          <EventColorSelector
            selectedColor={selectedColor}
            onColorChange={setSelectedColor}
          />
          
          <EventConfigurationForm
            spots={event.spots}
            pointsCost={event.pointsCost}
            image={event.image}
            isPast={event.isPast}
            isNew={isNew}
            onImageSelected={handleImageSelected}
          />
        </div>
        
        <DialogFooter>
          <Button variant="outline" onClick={() => setOpen(false)} disabled={isSaving}>
            Cancelar
          </Button>
          <Button onClick={handleSave} disabled={isSaving}>
            {isSaving ? "Guardando..." : (isNew ? "Crear Evento" : "Guardar Cambios")}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
