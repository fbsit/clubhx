
import React from "react";
import { Order } from "@/types/order";
import { Truck } from "lucide-react";

interface ShippingInfoProps {
  order: Order;
}

export default function ShippingInfo({ order }: ShippingInfoProps) {
  if (!order.trackingInfo || !["shipped", "delivered", "completed"].includes(order.status)) {
    return null;
  }

  return (
    <div className="bg-gray-50/80 backdrop-blur-sm rounded-2xl p-4 border border-gray-200/50">
      <h3 className="text-base font-semibold mb-4 flex items-center gap-2">
        <Truck className="h-5 w-5 text-primary" />
        Información de Envío
      </h3>
      <div className="space-y-3">
        <div>
          <p className="text-xs text-muted-foreground">Empresa de Envío</p>
          <p className="text-sm font-medium">{order.trackingInfo.company}</p>
        </div>
        <div>
          <p className="text-xs text-muted-foreground">Número de Seguimiento</p>
          <p className="text-sm font-mono bg-white/50 px-2 py-1 rounded border inline-block">
            {order.trackingInfo.trackingNumber}
          </p>
        </div>
      </div>
    </div>
  );
}
