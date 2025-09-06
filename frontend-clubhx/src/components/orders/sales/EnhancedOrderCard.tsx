import React from "react";
import { Order } from "@/types/order";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { 
  User, 
  ChevronRight, 
  AlertTriangle, 
  Truck, 
  Package, 
  CreditCard,
  Calendar,
  DollarSign
} from "lucide-react";

interface EnhancedOrderCardProps {
  order: Order;
  onSelectOrder: (order: Order) => void;
  onPaymentVerified?: (orderId: string, verified: boolean) => void;
  onStatusUpdate?: (orderId: string, newStatus: any) => void;
}

const getStatusInfo = (status: string) => {
  switch (status) {
    case "completed":
      return { label: "Completado", color: "bg-green-500", icon: "✓" };
    case "delivered":
      return { label: "Entregado", color: "bg-purple-500", icon: "📦" };
    case "shipped":
      return { label: "Enviado", color: "bg-blue-500", icon: "🚚" };
    case "payment_pending":
      return { label: "Verificando Pago", color: "bg-yellow-500", icon: "⏳" };
    case "accepted":
      return { label: "Aceptado", color: "bg-indigo-500", icon: "✅" };
    case "invoiced":
      return { label: "Facturado", color: "bg-cyan-500", icon: "🧾" };
    case "requested":
      return { label: "Solicitado", color: "bg-orange-500", icon: "📋" };
    case "quotation":
      return { label: "Cotización", color: "bg-amber-500", icon: "💰" };
    default:
      return { label: status, color: "bg-gray-500", icon: "•" };
  }
};

const isPriorityOrder = (order: Order) => {
  return ["requested", "payment_pending", "quotation"].includes(order.status);
};

export const EnhancedOrderCard: React.FC<EnhancedOrderCardProps> = ({
  order,
  onSelectOrder,
  onPaymentVerified,
  onStatusUpdate,
}) => {
  const statusInfo = getStatusInfo(order.status);
  const isUrgent = isPriorityOrder(order);
  
  const formatOrderId = (id: string) => {
    return id.replace('ORD-', '').replace('-', '-');
  };

  return (
    <div
      className={`w-full rounded-2xl border p-4 cursor-pointer transition-all duration-200 active:scale-[0.98] ${
        isUrgent 
          ? "bg-yellow-50 border-yellow-200 shadow-sm" 
          : "bg-white border-gray-200 hover:shadow-md"
      }`}
      onClick={() => onSelectOrder(order)}
    >
      <div className="space-y-3">
        {/* Header con Cliente y Prioridad */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2 flex-1 min-w-0">
            <div className="flex items-center gap-2 flex-1 min-w-0">
              <User className="h-4 w-4 text-primary flex-shrink-0" />
              <span className="font-medium text-sm truncate">{order.customer}</span>
            </div>
            {isUrgent && (
              <AlertTriangle className="h-4 w-4 text-yellow-600 flex-shrink-0" />
            )}
          </div>
          <ChevronRight className="h-4 w-4 text-muted-foreground flex-shrink-0" />
        </div>

        {/* Número de documento y fecha */}
        <div className="flex items-center justify-between text-xs text-muted-foreground">
          <div className="flex items-center gap-2">
            <span className="font-mono">#{formatOrderId(order.id)}</span>
            {order.trackingInfo && (
              <div className="flex items-center gap-1">
                <Truck className="h-3 w-3" />
                <span className="truncate max-w-[80px]">{order.trackingInfo.trackingNumber}</span>
              </div>
            )}
          </div>
          <div className="flex items-center gap-1">
            <Calendar className="h-3 w-3" />
            <span>{order.date}</span>
          </div>
        </div>
        
        {/* Monto y Estado */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-1">
            <DollarSign className="h-4 w-4 text-primary" />
            <span className="text-lg font-bold text-primary">
              ${order.total.toLocaleString("es-CL")}
            </span>
          </div>
          <Badge
            className={`text-white px-3 py-1 text-xs rounded-full font-medium ${statusInfo.color}`}
          >
            {statusInfo.icon} {statusInfo.label}
          </Badge>
        </div>

        {/* Información adicional */}
        <div className="flex items-center justify-between text-xs">
          <div className="flex items-center gap-2 text-muted-foreground">
            <Package className="h-3 w-3" />
            <span>{order.items.length} producto{order.items.length !== 1 ? 's' : ''}</span>
          </div>
          
          {/* Indicadores especiales */}
          <div className="flex items-center gap-2">
            {order.paymentProof && (
              <div className="flex items-center gap-1 text-green-600">
                <CreditCard className="h-3 w-3" />
                <span className="text-xs">Pago subido</span>
              </div>
            )}
            {isUrgent && (
              <span className="bg-yellow-100 text-yellow-800 px-2 py-1 rounded-full text-xs">
                Requiere atención
              </span>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};