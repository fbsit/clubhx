
import React from "react";
import { Order, OrderStatus } from "@/types/order";
import { Button } from "@/components/ui/button";
import { Download, Truck, CheckCircle, XCircle, FileText } from "lucide-react";
import { toast } from "sonner";

interface ActionButtonsProps {
  order: Order;
}

const getActionButtons = (status: OrderStatus, order: Order) => {
  const actions = [];
  
  switch (status) {
    case "requested":
      actions.push(
        { label: "Aceptar Pedido", variant: "default" as const, icon: CheckCircle },
        { label: "Rechazar", variant: "destructive" as const, icon: XCircle }
      );
      break;
    case "accepted":
      actions.push(
        { label: "Generar Factura", variant: "default" as const, icon: FileText },
        { label: "Cancelar Pedido", variant: "destructive" as const, icon: XCircle }
      );
      break;
    case "invoiced":
      actions.push(
        { label: "Marcar como Enviado", variant: "default" as const, icon: Truck },
        { label: "Descargar Factura", variant: "outline" as const, icon: Download }
      );
      break;
    case "shipped":
      actions.push(
        { label: "Marcar como Entregado", variant: "default" as const, icon: CheckCircle },
        { label: "Ver Tracking", variant: "outline" as const, icon: Truck }
      );
      break;
    case "delivered":
      actions.push(
        { label: "Completar Pedido", variant: "default" as const, icon: CheckCircle }
      );
      break;
    case "completed":
    case "quotation":
    case "processing":
      actions.push(
        { label: "Descargar Factura", variant: "outline" as const, icon: Download }
      );
      break;
    default:
      // No actions for canceled/rejected status
      break;
  }
  
  // Agregar botón de descarga de comprobante si existe
  if (order.paymentProof) {
    actions.push(
      { label: "Descargar Comprobante", variant: "outline" as const, icon: Download }
    );
  }
  
  return actions;
};

export default function ActionButtons({ order }: ActionButtonsProps) {
  const actionButtons = getActionButtons(order.status, order);

  const handleAction = (actionLabel: string) => {
    if (actionLabel === "Descargar Comprobante") {
      if (order.paymentProof?.url) {
        // Crear enlace temporal para descargar
        const link = document.createElement('a');
        link.href = order.paymentProof.url;
        link.download = order.paymentProof.fileName;
        link.target = '_blank';
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        
        toast.success("Descarga iniciada", {
          description: `Descargando ${order.paymentProof.fileName}`
        });
      } else {
        toast.error("No se pudo descargar el comprobante");
      }
    } else {
      toast.success(`Acción ejecutada: ${actionLabel}`, {
        description: `Se ha ${actionLabel.toLowerCase()} para el pedido #${order.id}`
      });
    }
  };

  if (actionButtons.length === 0) {
    return null;
  }

  return (
    <div className="fixed bottom-0 left-0 right-0 p-3 backdrop-blur-md bg-background/95 border-t border-border/50">
      <div className={`flex gap-2 ${actionButtons.length > 2 ? 'flex-col' : 'flex-row'}`}>
        {actionButtons.map((action, index) => {
          const IconComponent = action.icon;
          const isDownloadAction = action.label.includes("Descargar");
          
          return (
            <Button
              key={index}
              variant={action.variant}
              className={`${actionButtons.length <= 2 ? 'flex-1' : 'w-full'} rounded-xl ${
                isDownloadAction ? 'h-10' : 'h-12'
              } font-medium text-xs sm:text-sm ${
                action.variant === "default" ? "shadow-lg" : ""
              }`}
              onClick={() => handleAction(action.label)}
            >
              <IconComponent className="h-4 w-4 mr-1.5 flex-shrink-0" />
              <span className={`${isDownloadAction ? 'text-xs' : 'text-sm'} leading-tight`}>
                {action.label === "Descargar Comprobante" ? "Comp. Pago" : 
                 action.label === "Descargar Factura" ? "Factura" : 
                 action.label}
              </span>
            </Button>
          );
        })}
      </div>
    </div>
  );
}
