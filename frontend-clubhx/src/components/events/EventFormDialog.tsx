
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
  const [form, setForm] = useState<Event>(event);
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
        ...form,
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
            title={form.title}
            brand={form.brand}
            description={form.description}
            date={form.date}
            time={form.time}
            onTitleChange={(v) => setForm(prev => ({ ...prev, title: v }))}
            onBrandChange={(v) => setForm(prev => ({ ...prev, brand: v }))}
            onDescriptionChange={(v) => setForm(prev => ({ ...prev, description: v }))}
            onDateChange={(v) => setForm(prev => ({ ...prev, date: v }))}
            onTimeChange={(v) => setForm(prev => ({ ...prev, time: v }))}
          />

          <EventTypeSelector
            eventType={eventType}
            onEventTypeChange={setEventType}
          />

          <EventLocationForm
            eventType={eventType}
            location={form.location}
            address={form.address}
            onlineUrl={form.onlineUrl}
          />

          <EventColorSelector
            selectedColor={selectedColor}
            onColorChange={setSelectedColor}
          />
          
          <EventConfigurationForm
            spots={form.spots}
            pointsCost={form.pointsCost}
            image={form.image}
            isPast={form.isPast}
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
