
import React from "react";
import { Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import { 
  Select, 
  SelectContent, 
  SelectGroup, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from "@/components/ui/select";
import { OrderStatus } from "@/types/order";
import { useIsMobile } from "@/hooks/use-mobile";

interface OrdersSearchProps {
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  currentStatus: "all" | OrderStatus | "vendor_created" | "vendor_edited";
  setCurrentStatus: (status: "all" | OrderStatus | "vendor_created" | "vendor_edited") => void;
}

export default function OrdersSearch({ 
  searchQuery, 
  setSearchQuery, 
  currentStatus, 
  setCurrentStatus 
}: OrdersSearchProps) {
  const isMobile = useIsMobile();
  
  return (
    <div className="flex flex-col md:flex-row gap-4 mb-6">
      <div className="relative flex-1">
        <Search className="absolute left-3 top-[50%] transform -translate-y-1/2] h-4 w-4 text-muted-foreground pointer-events-none" />
        <Input
          placeholder="Buscar pedidos por número..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="pl-9 h-11 shadow-sm focus:shadow"
        />
      </div>
      <div className={`w-full ${isMobile ? 'max-w-full' : 'md:w-64'}`}>
        <Select 
          value={currentStatus} 
          onValueChange={(value) => setCurrentStatus(value as "all" | OrderStatus | "vendor_created" | "vendor_edited")}
        >
          <SelectTrigger className="w-full h-11 shadow-sm hover:shadow">
            <SelectValue placeholder="Filtrar por estado" />
          </SelectTrigger>
          <SelectContent className="shadow-md" position="popper">
            <SelectGroup>
              <SelectItem value="all">Todos los pedidos</SelectItem>
              <SelectItem value="quotation">Cotización</SelectItem>
              <SelectItem value="requested">Solicitados</SelectItem>
              <SelectItem value="vendor_created">Creado por Vendedor</SelectItem>
              <SelectItem value="vendor_edited">Editado por Vendedor</SelectItem>
              <SelectItem value="accepted">Aceptados</SelectItem>
              <SelectItem value="invoiced">Facturados</SelectItem>
              <SelectItem value="shipped">Enviados</SelectItem>
              <SelectItem value="delivered">Entregados</SelectItem>
              <SelectItem value="payment_pending">Esperando Verificación</SelectItem>
              <SelectItem value="paid">Pagados</SelectItem>
              <SelectItem value="completed">Completados</SelectItem>
              <SelectItem value="canceled">Cancelados</SelectItem>
              <SelectItem value="rejected">Rechazados</SelectItem>
            </SelectGroup>
          </SelectContent>
        </Select>
      </div>
    </div>
  );
}
