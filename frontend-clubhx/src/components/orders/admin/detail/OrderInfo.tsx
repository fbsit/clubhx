
import React from "react";
import { Order } from "@/types/order";
import { Badge } from "@/components/ui/badge";
import { Package, FileCheck, Calendar } from "lucide-react";

interface OrderInfoProps {
  order: Order;
  getStatusColor: (status: string) => string;
  getStatusLabel: (status: string) => string;
}

export default function OrderInfo({ order, getStatusColor, getStatusLabel }: OrderInfoProps) {
  return (
    <div className="bg-gray-50/80 backdrop-blur-sm rounded-2xl p-4 border border-gray-200/50">
      <h3 className="text-base font-semibold mb-4 flex items-center gap-2">
        <Package className="h-5 w-5 text-primary" />
        Información General
      </h3>
      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-3">
          <div>
            <p className="text-xs text-muted-foreground">Fecha</p>
            <p className="text-sm font-medium">{order.date}</p>
          </div>
          <div>
            <p className="text-xs text-muted-foreground">Total</p>
            <p className="text-lg font-bold text-primary">${order.total.toLocaleString("es-CL")}</p>
          </div>
        </div>
        <div className="space-y-3">
          <div>
            <p className="text-xs text-muted-foreground">Productos</p>
            <p className="text-sm font-medium">{order.items.length} {order.items.length === 1 ? 'producto' : 'productos'}</p>
          </div>
          <div>
            <p className="text-xs text-muted-foreground">Estado</p>
            <Badge
              className={`${getStatusColor(order.status)} text-white px-2 py-1 text-xs rounded-full font-medium`}
            >
              {getStatusLabel(order.status)}
            </Badge>
          </div>
        </div>
      </div>
      
      {/* Comprobante de pago si existe */}
      {order.paymentProof && (
        <div className="mt-4 pt-4 border-t border-gray-200">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <FileCheck className="h-4 w-4 text-green-600" />
              <span className="text-sm font-medium text-green-700">Comprobante de Pago</span>
            </div>
            <div className="flex items-center gap-1 text-xs text-muted-foreground">
              <Calendar className="h-3 w-3" />
              {order.paymentProof.uploadDate}
            </div>
          </div>
          <p className="text-xs text-muted-foreground mt-1">{order.paymentProof.fileName}</p>
        </div>
      )}
    </div>
  );
}
