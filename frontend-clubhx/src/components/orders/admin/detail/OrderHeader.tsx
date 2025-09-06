
import React from "react";
import { Order } from "@/types/order";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ArrowLeft } from "lucide-react";

interface OrderHeaderProps {
  order: Order;
  onBack: () => void;
  getStatusColor: (status: string) => string;
  getStatusLabel: (status: string) => string;
}

export default function OrderHeader({ 
  order, 
  onBack, 
  getStatusColor, 
  getStatusLabel 
}: OrderHeaderProps) {
  return (
    <header className="sticky top-0 z-50 backdrop-blur-md bg-background/80 border-b border-border/50 px-4 py-3">
      <div className="flex items-center gap-3">
        <Button 
          variant="ghost" 
          size="icon" 
          onClick={onBack}
          className="rounded-full hover:bg-gray-100/50"
        >
          <ArrowLeft className="h-5 w-5" />
        </Button>
        <div className="flex-1">
          <h1 className="text-lg font-semibold">Pedido #{order.id}</h1>
          <p className="text-sm text-muted-foreground">{order.customer}</p>
        </div>
        <Badge
          className={`${getStatusColor(order.status)} text-white px-3 py-1 text-xs rounded-full font-medium`}
        >
          {getStatusLabel(order.status)}
        </Badge>
      </div>
    </header>
  );
}
