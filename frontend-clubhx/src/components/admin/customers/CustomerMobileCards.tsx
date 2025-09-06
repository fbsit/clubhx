
import React from "react";
import { CustomerMobileCard } from "./CustomerMobileCard";

interface Customer {
  id: string;
  name: string;
  contact: string;
  email: string;
  city: string;
  totalOrders: number;
  totalSpent: number;
  status: string;
  lastOrder: string;
  loyaltyPoints: number;
}

interface CustomerMobileCardsProps {
  customers: Customer[];
  expandedCustomers: string[];
  onToggleExpand: (customerId: string) => void;
  onViewDetails: (customerId: string, e: React.MouseEvent) => void;
}

export const CustomerMobileCards: React.FC<CustomerMobileCardsProps> = ({
  customers,
  expandedCustomers,
  onToggleExpand,
  onViewDetails,
}) => {
  const isExpanded = (customerId: string) => expandedCustomers.includes(customerId);

  return (
    <div className="space-y-3">
      {customers.map((customer) => (
        <CustomerMobileCard
          key={customer.id}
          customer={customer}
          isExpanded={isExpanded(customer.id)}
          onToggleExpand={onToggleExpand}
          onViewDetails={onViewDetails}
        />
      ))}

      {customers.length === 0 && (
        <div className="text-center py-8">
          <p className="text-muted-foreground">No se encontraron clientes</p>
        </div>
      )}
    </div>
  );
};
