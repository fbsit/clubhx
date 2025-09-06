import React from "react";
import { Badge } from "@/components/ui/badge";

interface ClientPotentialBadgeProps {
  potential: "Alto" | "Medio" | "Bajo";
  className?: string;
}

export function ClientPotentialBadge({ potential, className }: ClientPotentialBadgeProps) {
  const getVariant = () => {
    switch (potential) {
      case "Alto":
        return "bg-green-100 text-green-800 hover:bg-green-100";
      case "Medio":
        return "bg-yellow-100 text-yellow-800 hover:bg-yellow-100";
      case "Bajo":
        return "bg-red-100 text-red-800 hover:bg-red-100";
      default:
        return "bg-gray-100 text-gray-800 hover:bg-gray-100";
    }
  };

  return (
    <Badge 
      className={`${getVariant()} border-0 font-medium ${className}`}
      variant="secondary"
    >
      {potential}
    </Badge>
  );
}