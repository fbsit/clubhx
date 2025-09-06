
import { AlertTriangle } from "lucide-react";
import { OrderStatus } from "@/types/order";

interface RejectedOrCanceledStatusProps {
  status: OrderStatus;
}

export function RejectedOrCanceledStatus({ status }: RejectedOrCanceledStatusProps) {
  return (
    <div className="flex items-center justify-center py-6 px-4 bg-destructive/5 rounded-lg border border-destructive/20 animate-pulse">
      <div className="rounded-full bg-destructive/10 p-3 text-destructive">
        <AlertTriangle className="h-6 w-6" />
      </div>
      <div className="ml-4">
        <p className="font-medium text-destructive text-lg">
          {status === "rejected" ? "Cotización Rechazada" : "Orden Cancelada"}
        </p>
        <p className="text-muted-foreground">
          {status === "rejected" 
            ? "Tu cotización no fue aprobada. Contacta a tu vendedor para más información." 
            : "Esta orden ha sido cancelada. Contacta a soporte si necesitas ayuda."}
        </p>
      </div>
    </div>
  );
}
