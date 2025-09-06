
import React from "react";
import { Order } from "@/types/order";
import { Separator } from "@/components/ui/separator";
import { Package } from "lucide-react";

interface ProductsListProps {
  order: Order;
}

export default function ProductsList({ order }: ProductsListProps) {
  return (
    <div className="bg-gray-50/80 backdrop-blur-sm rounded-2xl p-4 border border-gray-200/50">
      <h3 className="text-base font-semibold mb-4 flex items-center gap-2">
        <Package className="h-5 w-5 text-primary" />
        Productos ({order.items.length})
      </h3>
      <div className="space-y-3">
        {order.items.map((item, index) => (
          <div key={index} className="bg-white/70 rounded-xl p-3 border border-gray-200/30">
            <div className="flex justify-between items-start">
              <div className="flex-1">
                <h4 className="text-sm font-medium">{item.name}</h4>
                <p className="text-xs text-muted-foreground mt-1">
                  Cantidad: {item.quantity} • Precio unitario: ${item.price.toLocaleString("es-CL")}
                </p>
              </div>
              <div className="text-right">
                <p className="text-sm font-semibold">${(item.quantity * item.price).toLocaleString("es-CL")}</p>
              </div>
            </div>
          </div>
        ))}
      </div>
      
      <Separator className="my-4" />
      
      <div className="flex justify-between items-center">
        <span className="text-base font-semibold">Total</span>
        <span className="text-lg font-bold text-primary">${order.total.toLocaleString("es-CL")}</span>
      </div>
    </div>
  );
}
