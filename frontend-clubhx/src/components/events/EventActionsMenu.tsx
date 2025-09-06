
import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { 
  MoreHorizontal, 
  Copy, 
  Download, 
  XCircle, 
  Bell,
  Users
} from "lucide-react";
import { toast } from "@/hooks/use-toast";
import type { Event } from "@/types/event";

interface EventActionsMenuProps {
  event: Event;
  onDuplicate: (event: Event) => void;
  onCancel: (event: Event) => void;
  onExportData: (event: Event) => void;
  onSendNotification: (event: Event) => void;
}

export function EventActionsMenu({ 
  event, 
  onDuplicate, 
  onCancel, 
  onExportData, 
  onSendNotification 
}: EventActionsMenuProps) {
  const [isOpen, setIsOpen] = useState(false);

  const handleDuplicate = () => {
    onDuplicate(event);
    setIsOpen(false);
    toast({
      title: "Evento duplicado",
      description: `Se ha creado una copia de "${event.title}"`,
    });
  };

  const handleCancel = () => {
    onCancel(event);
    setIsOpen(false);
  };

  const handleExport = () => {
    onExportData(event);
    setIsOpen(false);
    toast({
      title: "Datos exportados",
      description: "Los datos del evento se han descargado exitosamente",
    });
  };

  const handleNotification = () => {
    onSendNotification(event);
    setIsOpen(false);
    toast({
      title: "Notificación enviada",
      description: "Se ha enviado la notificación a los participantes registrados",
    });
  };

  return (
    <DropdownMenu open={isOpen} onOpenChange={setIsOpen}>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="icon" className="h-8 w-8">
          <MoreHorizontal className="h-4 w-4" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-48">
        <DropdownMenuItem onClick={handleDuplicate}>
          <Copy className="h-4 w-4 mr-2" />
          Duplicar evento
        </DropdownMenuItem>
        <DropdownMenuItem onClick={handleExport}>
          <Download className="h-4 w-4 mr-2" />
          Exportar datos
        </DropdownMenuItem>
        <DropdownMenuItem onClick={handleNotification}>
          <Bell className="h-4 w-4 mr-2" />
          Enviar notificación
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        {!event.isPast && (
          <DropdownMenuItem 
            onClick={handleCancel}
            className="text-red-600 focus:text-red-600"
          >
            <XCircle className="h-4 w-4 mr-2" />
            Cancelar evento
          </DropdownMenuItem>
        )}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
