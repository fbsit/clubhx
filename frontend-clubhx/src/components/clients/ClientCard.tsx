
import React from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { Eye, Pencil, Phone } from "lucide-react";
import { useNavigate } from "react-router-dom";

export type Cliente = {
  id: string;
  name: string;
  contact: string;
  phone: string;
  email: string;
  city: string;
  lastOrder: string;
  nextVisit: string;
  status: "active" | "inactive" | "pending";
};

type ClientCardProps = {
  client: Cliente;
  onSelect: () => void;
  onEditNote: () => void;
  onCall: () => void;
  userRole?: string;
};

export const ClientCard: React.FC<ClientCardProps> = ({
  client,
  onSelect,
  onEditNote,
  onCall,
  userRole = "sales"
}) => {
  const navigate = useNavigate();

  // Definir color del badge según status
  let badgeClass = "bg-green-500";
  let badgeText = "Activo";
  if (client.status === "inactive") {
    badgeClass = "bg-amber-500";
    badgeText = "Inactivo";
  }
  if (client.status === "pending") {
    badgeClass = "bg-purple-500";
    badgeText = "Pendiente";
  }

  const handleViewDetails = () => {
    if (userRole === "admin") {
      navigate(`/main/admin/customers/${client.id}`);
    } else {
      navigate(`/main/sales/customers/${client.id}`);
    }
  };

  return (
    <div className="flex flex-col md:flex-row items-center md:items-stretch justify-between gap-3 md:gap-0 border-b last:border-0 py-3 px-2 transition-colors hover:bg-muted/40 group animate-fade-in">
      <div className="flex-1 min-w-0 cursor-pointer" onClick={handleViewDetails}>
        <div className="font-semibold text-base">{client.name}</div>
        <div className="text-xs text-muted-foreground">{client.city}</div>
      </div>
      <div>
        <Badge className={`${badgeClass} animate-pulse`}>{badgeText}</Badge>
      </div>
      <div className="hidden md:flex flex-col items-start min-w-[120px]">
        <span className="text-xs font-medium text-muted-foreground">
          Últ. Compra:
        </span>
        <span className="text-xs">{client.lastOrder}</span>
      </div>
      <div className="flex gap-2 items-center">
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <Button size="icon" variant="ghost" aria-label="Ver detalles" onClick={handleViewDetails}>
                <Eye className="h-4 w-4" />
              </Button>
            </TooltipTrigger>
            <TooltipContent>Ver detalles</TooltipContent>
          </Tooltip>
          <Tooltip>
            <TooltipTrigger asChild>
              <Button size="icon" variant="ghost" aria-label="Agregar nota" onClick={onEditNote}>
                <Pencil className="h-4 w-4" />
              </Button>
            </TooltipTrigger>
            <TooltipContent>Agregar nota</TooltipContent>
          </Tooltip>
          <Tooltip>
            <TooltipTrigger asChild>
              <Button size="icon" variant="ghost" aria-label="Llamar" onClick={onCall}>
                <Phone className="h-4 w-4" />
              </Button>
            </TooltipTrigger>
            <TooltipContent>Llamar</TooltipContent>
          </Tooltip>
        </TooltipProvider>
      </div>
    </div>
  );
};
