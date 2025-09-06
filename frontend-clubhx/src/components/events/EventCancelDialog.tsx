
import { useState } from "react";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { AlertTriangle, Users } from "lucide-react";
import type { Event } from "@/types/event";

interface EventCancelDialogProps {
  open: boolean;
  event: Event | null;
  onClose: () => void;
  onConfirm: (reason: string) => void;
}

export function EventCancelDialog({ open, event, onClose, onConfirm }: EventCancelDialogProps) {
  const [reason, setReason] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (!event) return null;

  const registeredCount = event.spots - event.spotsLeft;

  const handleConfirm = async () => {
    if (!reason.trim()) return;
    
    setIsSubmitting(true);
    await onConfirm(reason);
    setIsSubmitting(false);
    onClose();
    setReason("");
  };

  const handleClose = () => {
    onClose();
    setReason("");
  };

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-red-600">
            <AlertTriangle className="h-5 w-5" />
            Cancelar Evento
          </DialogTitle>
          <DialogDescription>
            Estás a punto de cancelar el evento "{event.title}".
          </DialogDescription>
        </DialogHeader>
        
        <div className="space-y-4">
          {registeredCount > 0 && (
            <Alert className="border-orange-200 bg-orange-50">
              <Users className="h-4 w-4 text-orange-600" />
              <AlertDescription className="text-orange-800">
                <strong>¡Atención!</strong> Este evento tiene {registeredCount} persona(s) registrada(s). 
                Se les enviará una notificación automática sobre la cancelación.
              </AlertDescription>
            </Alert>
          )}
          
          <div className="space-y-2">
            <Label htmlFor="reason">Motivo de la cancelación *</Label>
            <Textarea
              id="reason"
              placeholder="Explica el motivo de la cancelación..."
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              className="min-h-[100px]"
            />
          </div>
        </div>
        
        <DialogFooter>
          <Button variant="outline" onClick={handleClose}>
            Cancelar
          </Button>
          <Button 
            variant="destructive" 
            onClick={handleConfirm}
            disabled={!reason.trim() || isSubmitting}
          >
            {isSubmitting ? "Cancelando..." : "Confirmar Cancelación"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
