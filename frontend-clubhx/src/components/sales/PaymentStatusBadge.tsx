import React from "react";
import { Badge } from "@/components/ui/badge";

interface PaymentStatusBadgeProps {
  status: "current" | "overdue" | "critical";
  className?: string;
}

export function PaymentStatusBadge({ status, className }: PaymentStatusBadgeProps) {
  const getVariant = () => {
    switch (status) {
      case "current":
        return "bg-green-100 text-green-800 hover:bg-green-100";
      case "overdue":
        return "bg-yellow-100 text-yellow-800 hover:bg-yellow-100";
      case "critical":
        return "bg-red-100 text-red-800 hover:bg-red-100";
      default:
        return "bg-gray-100 text-gray-800 hover:bg-gray-100";
    }
  };

  const getLabel = () => {
    switch (status) {
      case "current":
        return "Al Día";
      case "overdue":
        return "Vencido";
      case "critical":
        return "Crítico";
      default:
        return "Desconocido";
    }
  };

  return (
    <Badge 
      className={`${getVariant()} border-0 font-medium ${className}`}
      variant="secondary"
    >
      {getLabel()}
    </Badge>
  );
}