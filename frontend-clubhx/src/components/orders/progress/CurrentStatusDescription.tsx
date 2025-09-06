
import { OrderStatus } from "@/types/order";
import { statusConfig } from "@/config/orderStatusConfig";

interface CurrentStatusDescriptionProps {
  status: OrderStatus;
}

export function CurrentStatusDescription({ status }: CurrentStatusDescriptionProps) {
  return (
    <div className="bg-slate-50 dark:bg-slate-900/20 p-4 rounded-lg text-sm border-l-4 border-primary">
      <p className="font-medium mb-1">Estado actual: {statusConfig[status].label}</p>
      <p className="text-muted-foreground text-xs">{statusConfig[status].description}</p>
    </div>
  );
}
