
import React from "react";
import { Badge } from "@/components/ui/badge";
import { ChevronDown, ChevronRight } from "lucide-react";
import { getStatusBadge } from "@/utils/customerFormatters";

interface Customer {
  id: string;
  name: string;
  contact: string;
  status: string;
}

interface CustomerCardHeaderProps {
  customer: Customer;
  isExpanded: boolean;
  onToggleExpand: () => void;
}

export const CustomerCardHeader: React.FC<CustomerCardHeaderProps> = ({
  customer,
  isExpanded,
  onToggleExpand,
}) => {
  const statusBadge = getStatusBadge(customer.status);

  return (
    <div 
      className="flex items-center justify-between p-4 cursor-pointer"
      onClick={onToggleExpand}
    >
      <div className="flex-1">
        <h3 className="font-medium">{customer.name}</h3>
        <p className="text-sm text-muted-foreground">{customer.contact}</p>
      </div>

      <div className="flex items-center gap-2">
        <Badge className={statusBadge.className}>
          {statusBadge.label}
        </Badge>
        {isExpanded ? 
          <ChevronDown className="h-5 w-5 text-muted-foreground" /> : 
          <ChevronRight className="h-5 w-5 text-muted-foreground" />
        }
      </div>
    </div>
  );
};
