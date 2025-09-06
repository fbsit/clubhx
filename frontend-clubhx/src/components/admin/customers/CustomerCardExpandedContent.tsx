
import React from "react";
import { Button } from "@/components/ui/button";
import { formatCurrency, formatDate } from "@/utils/customerFormatters";

interface Customer {
  id: string;
  city: string;
  lastOrder: string;
  totalOrders: number;
  loyaltyPoints: number;
  totalSpent: number;
  email: string;
}

interface CustomerCardExpandedContentProps {
  customer: Customer;
  onViewDetails: (customerId: string, e: React.MouseEvent) => void;
}

export const CustomerCardExpandedContent: React.FC<CustomerCardExpandedContentProps> = ({
  customer,
  onViewDetails,
}) => {
  return (
    <div className="px-4 pb-4 pt-1 space-y-3 border-t">
      <div className="grid grid-cols-2 gap-2">
        <div>
          <p className="text-xs text-muted-foreground">Ciudad</p>
          <p className="text-sm">{customer.city}</p>
        </div>
        <div>
          <p className="text-xs text-muted-foreground">Última Compra</p>
          <p className="text-sm">{formatDate(customer.lastOrder)}</p>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-2">
        <div>
          <p className="text-xs text-muted-foreground">Total Órdenes</p>
          <p className="text-sm font-medium">{customer.totalOrders}</p>
        </div>
        <div>
          <p className="text-xs text-muted-foreground">Puntos</p>
          <p className="text-sm font-medium">{customer.loyaltyPoints}</p>
        </div>
      </div>
      
      <div>
        <p className="text-xs text-muted-foreground">Total Compras</p>
        <p className="text-sm font-medium">{formatCurrency(customer.totalSpent)}</p>
      </div>
      
      <div>
        <p className="text-xs text-muted-foreground">Email</p>
        <p className="text-sm break-all">{customer.email}</p>
      </div>
      
      <div className="pt-2 flex justify-end">
        <Button 
          variant="outline" 
          size="sm"
          onClick={(e) => onViewDetails(customer.id, e)}
        >
          Ver Detalles
        </Button>
      </div>
    </div>
  );
};
