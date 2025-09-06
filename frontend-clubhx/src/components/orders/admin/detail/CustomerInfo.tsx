
import React from "react";
import { Order } from "@/types/order";
import { User, Phone, Mail, MapPin } from "lucide-react";

interface CustomerInfoProps {
  order: Order;
}

export default function CustomerInfo({ order }: CustomerInfoProps) {
  return (
    <div className="bg-gray-50/80 backdrop-blur-sm rounded-2xl p-4 border border-gray-200/50">
      <h3 className="text-base font-semibold mb-4 flex items-center gap-2">
        <User className="h-5 w-5 text-primary" />
        Cliente
      </h3>
      <div className="space-y-3">
        <div>
          <p className="text-xs text-muted-foreground">Nombre</p>
          <p className="text-sm font-medium">{order.customer}</p>
        </div>
        <div>
          <p className="text-xs text-muted-foreground">Contacto</p>
          <div className="flex items-center gap-4 mt-1">
            <div className="flex items-center gap-1">
              <Phone className="h-4 w-4 text-muted-foreground" />
              <span className="text-sm">+56 9 1234 5678</span>
            </div>
            <div className="flex items-center gap-1">
              <Mail className="h-4 w-4 text-muted-foreground" />
              <span className="text-sm">cliente@email.com</span>
            </div>
          </div>
        </div>
        <div>
          <p className="text-xs text-muted-foreground">Dirección</p>
          <div className="flex items-start gap-2 mt-1">
            <MapPin className="h-4 w-4 text-muted-foreground mt-0.5 flex-shrink-0" />
            <span className="text-sm">Av. Providencia 1234, Providencia, Santiago</span>
          </div>
        </div>
      </div>
    </div>
  );
}
