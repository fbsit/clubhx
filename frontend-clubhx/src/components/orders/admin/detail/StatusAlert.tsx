
import React from "react";
import { OrderStatus } from "@/types/order";
import { AlertTriangle } from "lucide-react";

interface StatusAlertProps {
  status: OrderStatus;
}

export default function StatusAlert({ status }: StatusAlertProps) {
  if (status !== "canceled" && status !== "rejected") {
    return null;
  }

  return (
    <div className="bg-red-50 border border-red-200 rounded-xl p-4 flex items-center gap-3">
      <AlertTriangle className="h-5 w-5 text-red-500 flex-shrink-0" />
      <div>
        <p className="text-sm font-medium text-red-800">
          {status === "canceled" ? "Pedido Cancelado" : "Pedido Rechazado"}
        </p>
        <p className="text-xs text-red-600 mt-1">
          {status === "canceled" 
            ? "Este pedido fue cancelado por el cliente o administrador"
            : "Este pedido fue rechazado. Contactar al cliente para más información"
          }
        </p>
      </div>
    </div>
  );
}
