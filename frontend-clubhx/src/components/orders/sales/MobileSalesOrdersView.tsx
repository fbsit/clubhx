import React, { useState } from "react";
import { Order, OrderStatus } from "@/types/order";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { 
  Select, 
  SelectTrigger, 
  SelectContent, 
  SelectItem,
  SelectValue 
} from "@/components/ui/select";
import { Search, FileDown, User, Plus, ChevronRight, LayoutGrid, Table } from "lucide-react";
import { exportFilteredOrders } from "@/utils/exportUtils";
import { toast } from "sonner";
import { SalesOrdersKPIHeader } from "./SalesOrdersKPIHeader";
import { EnhancedOrderCard } from "./EnhancedOrderCard";

interface MobileSalesOrdersViewProps {
  filteredOrders: Order[];
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  currentStatus: "all" | OrderStatus | "vendor_created" | "vendor_edited" | "collections";
  setCurrentStatus: (status: "all" | OrderStatus | "vendor_created" | "vendor_edited" | "collections") => void;
  onSelectOrder: (order: Order) => void;
  onPaymentVerified: (orderId: string, verified: boolean) => void;
  onStatusUpdate: (orderId: string, newStatus: OrderStatus) => void;
}

const STATUS_OPTIONS: { value: "all" | OrderStatus | "vendor_created" | "vendor_edited" | "collections"; label: string }[] = [
  { value: "all", label: "Todos" },
  { value: "requested", label: "Solicitados" },
  { value: "vendor_created", label: "Creado por Vendedor" },
  { value: "vendor_edited", label: "Editado por Vendedor" },
  { value: "payment_pending", label: "Pendiente verificación" },
  { value: "collections", label: "Cobranza" },
  { value: "accepted", label: "Aceptados" },
  { value: "shipped", label: "Enviados" },
  { value: "delivered", label: "Entregados" },
  { value: "completed", label: "Completados" },
];

const getStatusLabel = (status: OrderStatus) =>
  status === "completed"
    ? "Completado"
    : status === "delivered"
    ? "Entregado"
    : status === "shipped"
    ? "Enviado"
    : status === "processing"
    ? "En proceso"
    : "Solicitado";

export default function MobileSalesOrdersView({
  filteredOrders,
  searchQuery,
  setSearchQuery,
  currentStatus,
  setCurrentStatus,
  onSelectOrder,
  onPaymentVerified,
  onStatusUpdate,
}: MobileSalesOrdersViewProps) {
  const [viewMode, setViewMode] = useState<"cards" | "compact">("cards");
  
  const handleExportOrders = () => {
    try {
      const result = exportFilteredOrders(
        filteredOrders,
        { searchQuery, status: (currentStatus === 'vendor_created' || currentStatus === 'vendor_edited' || currentStatus === 'collections') ? 'all' : currentStatus },
        "Sales Team"
      );
      
      toast.success(`Exportación completada`, {
        description: `${result.count} pedidos exportados a ${result.filename}`,
      });
    } catch (error) {
      toast.error("Error al exportar", {
        description: "No se pudo generar el archivo CSV",
      });
    }
  };

  const resumen = [
    { label: "Total Pedidos", value: 127 },
    { label: "Pendientes", value: 18 },
    { label: "Entregados", value: 93 },
    { label: "Valor Promedio", value: "$158.300" },
  ];

  return (
    <main className="w-full min-h-screen bg-white flex flex-col pb-28 overflow-x-hidden">
      {/* Header */}
      <header className="flex items-center justify-between w-full pt-5 pb-2 bg-white pl-3 pr-3 box-border">
        <h2 className="text-lg font-semibold truncate flex-1 min-w-0 pr-2">Pedidos de Clientes</h2>
        <div className="flex gap-1.5 flex-shrink-0">
          <Button 
            variant="outline" 
            size="icon" 
            className="rounded-lg w-10 h-10 flex-shrink-0" 
            onClick={() => setViewMode(viewMode === "cards" ? "compact" : "cards")}
            tabIndex={-1}
          >
            {viewMode === "cards" ? <Table className="h-4 w-4" /> : <LayoutGrid className="h-4 w-4" />}
          </Button>
          <Button 
            variant="outline" 
            size="icon" 
            className="rounded-lg w-10 h-10 flex-shrink-0" 
            onClick={handleExportOrders}
            disabled={filteredOrders.length === 0}
            tabIndex={-1}
          >
            <FileDown className="h-5 w-5" />
          </Button>
        </div>
      </header>

      {/* KPI Header */}
      <section className="w-full px-3 pb-2">
        <SalesOrdersKPIHeader orders={filteredOrders} />
      </section>

      {/* Search */}
      <section className="w-full mt-1 pl-3 pr-3 box-border">
        <div className="relative w-full max-w-full">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground pointer-events-none z-10" />
          <Input
            placeholder="Buscar cliente o pedido..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10 h-11 rounded-xl bg-white text-base w-full max-w-full border border-gray-200 shadow-none focus:bg-white box-border"
            autoCorrect="off"
            autoCapitalize="none"
            spellCheck={false}
          />
        </div>
      </section>

      {/* Estado selector */}
      <section className="w-full mt-2 pl-3 pr-3 box-border">
        <Select value={currentStatus} onValueChange={val => setCurrentStatus(val as "all" | OrderStatus | "vendor_created" | "vendor_edited" | "collections")}>
          <SelectTrigger className="w-full max-w-full h-10 rounded-full border border-gray-200 bg-white shadow-none text-sm px-3 box-border">
            <SelectValue placeholder="Filtrar por estado" />
          </SelectTrigger>
          <SelectContent className="z-50 bg-white max-w-full">
            {STATUS_OPTIONS.map(opt => (
              <SelectItem key={opt.value} value={opt.value}>
                {opt.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </section>

      {/* Order content */}
      <div className="flex-1 flex flex-col w-full max-w-full mt-4 pl-3 pr-3 box-border overflow-x-hidden">
        {filteredOrders.length === 0 ? (
          <div className="flex flex-col items-center justify-center min-h-[120px] text-muted-foreground w-full">
            <User className="mb-2 h-8 w-8" />
            <span className="text-center">No se encontraron pedidos</span>
          </div>
        ) : viewMode === "cards" ? (
          <div className="w-full max-w-full flex flex-col gap-3 overflow-x-hidden">
            {filteredOrders.slice(0, 8).map(order => (
              <EnhancedOrderCard
                key={order.id}
                order={order}
                onSelectOrder={() => onSelectOrder(order)}
                onPaymentVerified={onPaymentVerified}
                onStatusUpdate={onStatusUpdate}
              />
            ))}
          </div>
        ) : (
          <div className="w-full max-w-full flex flex-col gap-2 overflow-x-hidden">
            {filteredOrders.slice(0, 12).map(order => (
              <div
                key={order.id}
                className="w-full rounded-lg bg-gray-50 border border-gray-200 p-3 cursor-pointer active:scale-[0.98] transition select-none box-border"
                onClick={() => onSelectOrder(order)}
              >
                <div className="flex items-center justify-between w-full">
                  <div className="flex items-center gap-2 flex-1 min-w-0">
                    <div className="flex flex-col min-w-0 flex-1">
                      <span className="font-medium text-sm truncate">{order.customer}</span>
                      <span className="text-xs text-muted-foreground">#{order.id.replace('ORD-', '')}</span>
                    </div>
                  </div>
                  <div className="flex items-center gap-2 flex-shrink-0">
                    <span className="text-sm font-bold">${order.total.toLocaleString("es-CL")}</span>
                    <Badge
                      className="text-white px-2 py-1 text-xs rounded-full font-medium"
                      style={{
                        background:
                          order.status === "completed"
                            ? "#059669"
                            : order.status === "delivered"
                            ? "#2563eb"
                            : order.status === "shipped"
                            ? "#d97706"
                            : order.status === "payment_pending"
                            ? "#eab308"
                            : order.status === "accepted"
                            ? "#9333ea"
                            : "#52525b",
                      }}
                    >
                      {getStatusLabel(order.status)}
                    </Badge>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </main>
  );
}
