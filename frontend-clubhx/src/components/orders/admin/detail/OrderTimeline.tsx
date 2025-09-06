
import React from "react";
import { Order } from "@/types/order";
import { Clock } from "lucide-react";

interface OrderTimelineProps {
  order: Order;
  getStatusLabel: (status: string) => string;
}

export default function OrderTimeline({ order, getStatusLabel }: OrderTimelineProps) {
  return (
    <div className="bg-gray-50/80 backdrop-blur-sm rounded-2xl p-4 border border-gray-200/50">
      <h3 className="text-base font-semibold mb-4 flex items-center gap-2">
        <Clock className="h-5 w-5 text-primary" />
        Historial
      </h3>
      <div className="space-y-3">
        <div className="flex items-center gap-3">
          <div className="w-2 h-2 bg-green-500 rounded-full flex-shrink-0"></div>
          <div className="flex-1">
            <p className="text-sm font-medium">Pedido {getStatusLabel(order.status).toLowerCase()}</p>
            <p className="text-xs text-muted-foreground">{order.date} - 14:30</p>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <div className="w-2 h-2 bg-blue-500 rounded-full flex-shrink-0"></div>
          <div className="flex-1">
            <p className="text-sm font-medium">Pedido creado</p>
            <p className="text-xs text-muted-foreground">{order.date} - 10:15</p>
          </div>
        </div>
      </div>
    </div>
  );
}
