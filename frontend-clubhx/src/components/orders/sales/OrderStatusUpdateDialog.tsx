import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Textarea } from "@/components/ui/textarea";
import { Order, OrderStatus } from "@/types/order";
import { RefreshCw, Info } from "lucide-react";
import { toast } from "sonner";

interface OrderStatusUpdateDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  order: Order | null;
  onStatusUpdate: (orderId: string, newStatus: OrderStatus) => void;
}

const STATUS_OPTIONS: Array<{ value: OrderStatus; label: string; description: string; color: string }> = [
  { 
    value: "quotation", 
    label: "Cotización", 
    description: "El pedido está en estado de cotización, pendiente de confirmación",
    color: "text-gray-600"
  },
  { 
    value: "requested", 
    label: "Solicitado", 
    description: "El cliente ha solicitado el pedido y está pendiente de revisión",
    color: "text-orange-600"
  },
  { 
    value: "accepted", 
    label: "Aceptado", 
    description: "El pedido ha sido aceptado y se procesará",
    color: "text-purple-600"
  },
  { 
    value: "paid", 
    label: "Pagado", 
    description: "El cliente ha realizado el pago del pedido",
    color: "text-green-600"
  },
  { 
    value: "payment_pending", 
    label: "Pendiente de Verificación", 
    description: "El pago está pendiente de verificación",
    color: "text-yellow-600"
  },
  { 
    value: "invoiced", 
    label: "Facturado", 
    description: "Se ha generado la factura del pedido",
    color: "text-blue-600"
  },
  { 
    value: "processing", 
    label: "En Cobranza", 
    description: "El pedido está en proceso de cobranza por pago pendiente",
    color: "text-red-600"
  },
  { 
    value: "shipped", 
    label: "Enviado", 
    description: "El pedido está en camino al cliente",
    color: "text-indigo-600"
  },
  { 
    value: "delivered", 
    label: "Entregado", 
    description: "El pedido fue entregado al cliente",
    color: "text-cyan-600"
  },
  { 
    value: "completed", 
    label: "Completado", 
    description: "El pedido ha sido completado exitosamente",
    color: "text-emerald-600"
  },
  { 
    value: "rejected", 
    label: "Rechazado", 
    description: "El pedido ha sido rechazado",
    color: "text-red-600"
  },
  { 
    value: "canceled", 
    label: "Cancelado", 
    description: "El pedido ha sido cancelado",
    color: "text-gray-600"
  },
];

export default function OrderStatusUpdateDialog({
  open,
  onOpenChange,
  order,
  onStatusUpdate,
}: OrderStatusUpdateDialogProps) {
  const [selectedStatus, setSelectedStatus] = useState<OrderStatus | "">("");
  const [notes, setNotes] = useState("");
  const [isUpdating, setIsUpdating] = useState(false);

  if (!order) return null;

  const currentStatusOption = STATUS_OPTIONS.find(opt => opt.value === order.status);
  const availableOptions = STATUS_OPTIONS.filter(opt => opt.value !== order.status);

  const handleUpdate = async () => {
    if (!selectedStatus) {
      toast.error("Por favor selecciona un estado");
      return;
    }

    setIsUpdating(true);

    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000));

    onStatusUpdate(order.id, selectedStatus as OrderStatus);

    const statusLabel = STATUS_OPTIONS.find(opt => opt.value === selectedStatus)?.label;
    toast.success("Estado actualizado correctamente", {
      description: `El pedido ahora está marcado como "${statusLabel}"`
    });

    setIsUpdating(false);
    setSelectedStatus("");
    setNotes("");
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <RefreshCw className="h-5 w-5" />
            Actualizar Estado del Pedido
          </DialogTitle>
          <DialogDescription>
            Cambia el estado del pedido #{order.id} de "{currentStatusOption?.label}".
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          <div className="bg-muted/50 rounded-lg p-3">
            <div className="flex justify-between items-center">
              <span className="text-sm text-muted-foreground">Cliente:</span>
              <span className="font-medium">{order.customer}</span>
            </div>
          </div>

          <div className="space-y-3">
            <Label className="text-sm font-medium">Nuevo estado</Label>
            <Select value={selectedStatus} onValueChange={(value) => setSelectedStatus(value as OrderStatus)}>
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Selecciona el nuevo estado" />
              </SelectTrigger>
              <SelectContent className="max-w-full">
                <ScrollArea className="h-72">
                  <div className="p-1">
                    {availableOptions.map((option) => (
                      <SelectItem 
                        key={option.value} 
                        value={option.value} 
                        className="cursor-pointer focus:bg-accent focus:text-accent-foreground data-[highlighted]:bg-accent data-[highlighted]:text-accent-foreground"
                      >
                        <div className="flex flex-col items-start w-full py-1">
                          <span className={`font-medium ${option.color}`}>{option.label}</span>
                          <span className="text-xs text-muted-foreground mt-1">{option.description}</span>
                        </div>
                      </SelectItem>
                    ))}
                  </div>
                </ScrollArea>
              </SelectContent>
            </Select>
            
            {/* Mostrar descripción del estado seleccionado */}
            {selectedStatus && (
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
                <div className="flex items-start gap-2">
                  <Info className="h-4 w-4 text-blue-600 mt-0.5 flex-shrink-0" />
                  <div>
                    <p className="text-sm font-medium text-blue-900">
                      {STATUS_OPTIONS.find(opt => opt.value === selectedStatus)?.label}
                    </p>
                    <p className="text-xs text-blue-700 mt-1">
                      {STATUS_OPTIONS.find(opt => opt.value === selectedStatus)?.description}
                    </p>
                  </div>
                </div>
              </div>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="notes" className="text-sm font-medium">
              Notas adicionales (opcional)
            </Label>
            <Textarea
              id="notes"
              placeholder="Agrega comentarios sobre el cambio de estado..."
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              rows={3}
            />
          </div>
        </div>

        <DialogFooter>
          <Button 
            variant="outline" 
            onClick={() => {
              setSelectedStatus("");
              setNotes("");
              onOpenChange(false);
            }}
            disabled={isUpdating}
          >
            Cancelar
          </Button>
          <Button onClick={handleUpdate} disabled={isUpdating || !selectedStatus}>
            {isUpdating ? "Actualizando..." : "Actualizar Estado"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}