
import React from "react";
import { Card } from "@/components/ui/card";
import { CustomerCardHeader } from "./CustomerCardHeader";
import { CustomerCardExpandedContent } from "./CustomerCardExpandedContent";

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

interface CustomerMobileCardProps {
  customer: Customer;
  isExpanded: boolean;
  onToggleExpand: (customerId: string) => void;
  onViewDetails: (customerId: string, e: React.MouseEvent) => void;
}

export const CustomerMobileCard: React.FC<CustomerMobileCardProps> = ({
  customer,
  isExpanded,
  onToggleExpand,
  onViewDetails,
}) => {
  return (
    <Card className="overflow-hidden">
      <CustomerCardHeader 
        customer={customer}
        isExpanded={isExpanded}
        onToggleExpand={() => onToggleExpand(customer.id)}
      />

      {isExpanded && (
        <CustomerCardExpandedContent 
          customer={customer}
          onViewDetails={onViewDetails}
        />
      )}
    </Card>
  );
};
