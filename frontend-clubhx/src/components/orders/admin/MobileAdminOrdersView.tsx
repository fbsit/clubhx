
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
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Search, Filter, FileDown, User, ChevronRight, Calendar, DollarSign, Users } from "lucide-react";
import { toast } from "sonner";
import OrderDetailView from "./OrderDetailView";
import PeriodSelector from "./filters/PeriodSelector";
import VendorFilter from "./filters/VendorFilter";
import OrderMetricsCards from "./analytics/OrderMetricsCards";
import { usePeriodComparison } from "@/hooks/usePeriodComparison";
const mockOrders: any[] = [];

interface MobileAdminOrdersViewProps {
  filteredOrders: Order[];
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  currentStatus: "all" | OrderStatus | "vendor_created" | "vendor_edited";
  setCurrentStatus: (status: "all" | OrderStatus | "vendor_created" | "vendor_edited") => void;
  onSelectOrder: (order: Order) => void;
}

const STATUS_OPTIONS: { value: "all" | OrderStatus | "vendor_created" | "vendor_edited"; label: string }[] = [
  { value: "all", label: "Todos" },
  { value: "requested", label: "Solicitados" },
  { value: "vendor_created", label: "Creado por Vendedor" },
  { value: "vendor_edited", label: "Editado por Vendedor" },
  { value: "accepted", label: "Aceptados" },
  { value: "invoiced", label: "Facturados" },
  { value: "shipped", label: "Enviados" },
  { value: "completed", label: "Completados" },
  { value: "canceled", label: "Cancelados" },
];

const getStatusLabel = (status: OrderStatus) => {
  const statusMap = {
    requested: "Solicitado",
    accepted: "Aceptado", 
    invoiced: "Facturado",
    shipped: "Enviado",
    completed: "Completado",
    canceled: "Cancelado",
    rejected: "Rechazado"
  };
  return statusMap[status] || status;
};

const getStatusColor = (status: OrderStatus) => {
  const colorMap = {
    requested: "bg-yellow-500",
    accepted: "bg-blue-500",
    invoiced: "bg-purple-500", 
    shipped: "bg-orange-500",
    completed: "bg-green-500",
    canceled: "bg-red-500",
    rejected: "bg-red-500"
  };
  return colorMap[status] || "bg-gray-500";
};

export default function MobileAdminOrdersView({
  filteredOrders,
  searchQuery,
  setSearchQuery,
  currentStatus,
  setCurrentStatus,
  onSelectOrder,
}: MobileAdminOrdersViewProps) {
  const [dateRange, setDateRange] = useState({ from: "", to: "" });
  const [minAmount, setMinAmount] = useState("");
  const [maxAmount, setMaxAmount] = useState("");
  const [selectedClient, setSelectedClient] = useState("all");
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  
  // Period comparison state
  const [selectedPeriod, setSelectedPeriod] = useState("month");
  const [customRange, setCustomRange] = useState({ 
    from: new Date(new Date().getFullYear(), new Date().getMonth(), 1).toISOString().split('T')[0],
    to: new Date().toISOString().split('T')[0]
  });
  const [selectedVendor, setSelectedVendor] = useState("all");

  // Period comparison hook
  const { currentOrders, previousOrders, periodLabels } = usePeriodComparison({
    orders: mockOrders,
    currentPeriod: customRange,
    selectedVendor
  });

  // Si hay un pedido seleccionado, mostrar la vista de detalle
  if (selectedOrder) {
    return (
      <OrderDetailView 
        order={selectedOrder} 
        onBack={() => setSelectedOrder(null)} 
      />
    );
  }

  // Función para exportar a CSV
  const exportToCSV = () => {
    if (filteredOrders.length === 0) {
      toast.error("No hay pedidos para exportar");
      return;
    }

    const headers = ["ID", "Cliente", "Vendedor", "Fecha", "Estado", "Total", "Productos"];
    const csvContent = [
      headers.join(","),
      ...filteredOrders.map(order => [
        order.id,
        `"${order.customer}"`,
        order.vendorId || "Sin asignar",
        order.date,
        getStatusLabel(order.status),
        order.total,
        order.items.length
      ].join(","))
    ].join("\n");

    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const link = document.createElement("a");
    const url = URL.createObjectURL(blob);
    link.setAttribute("href", url);
    link.setAttribute("download", `pedidos_${selectedPeriod}_${new Date().toISOString().split('T')[0]}.csv`);
    link.style.visibility = "hidden";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    
    toast.success(`${filteredOrders.length} pedidos exportados a CSV`);
  };

  // Función para aplicar filtros avanzados
  const applyAdvancedFilters = () => {
    let hasFilters = false;
    let filterDescription = "Filtros aplicados:";

    if (dateRange.from || dateRange.to) {
      hasFilters = true;
      filterDescription += ` Fecha: ${dateRange.from || "desde inicio"} - ${dateRange.to || "hasta hoy"}`;
    }
    
    if (minAmount || maxAmount) {
      hasFilters = true;
      filterDescription += ` Monto: $${minAmount || "0"} - $${maxAmount || "∞"}`;
    }
    
    if (selectedClient && selectedClient !== "all") {
      hasFilters = true;
      filterDescription += ` Cliente: ${selectedClient}`;
    }

    if (hasFilters) {
      toast.info("Filtros avanzados aplicados", {
        description: filterDescription,
        duration: 3000
      });
    } else {
      toast.info("Sin filtros avanzados activos");
    }
  };

  // Limpiar filtros avanzados
  const clearAdvancedFilters = () => {
    setDateRange({ from: "", to: "" });
    setMinAmount("");
    setMaxAmount("");
    setSelectedClient("all");
    toast.success("Filtros avanzados limpiados");
  };

  // Obtener lista única de clientes
  const uniqueClients = [...new Set(filteredOrders.map(order => order.customer))];

  const handleOrderClick = (order: Order) => {
    setSelectedOrder(order);
    onSelectOrder(order);
  };

  return (
    <main className="w-full min-h-screen bg-background flex flex-col pb-28 overflow-x-hidden">
      {/* Header - SIN título duplicado */}
      <header className="flex items-center justify-between w-full pt-5 pb-2 bg-background px-3">
        <div className="flex gap-1.5 shrink-0 ml-auto">
          {/* Filtro avanzado */}
          <Popover>
            <PopoverTrigger asChild>
              <Button variant="outline" size="icon" className="rounded-lg">
                <Filter className="h-5 w-5" />
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-80 p-4" align="end">
              <div className="space-y-4">
                <div className="flex items-center gap-2 mb-3">
                  <Filter className="h-4 w-4" />
                  <h4 className="font-semibold">Filtros Avanzados</h4>
                </div>

                {/* Rango de fechas */}
                <div className="space-y-2">
                  <label className="text-sm font-medium flex items-center gap-2">
                    <Calendar className="h-4 w-4" />
                    Rango de Fechas
                  </label>
                  <div className="grid grid-cols-2 gap-2">
                    <Input
                      type="date"
                      placeholder="Desde"
                      value={dateRange.from}
                      onChange={(e) => setDateRange(prev => ({ ...prev, from: e.target.value }))}
                      className="text-xs"
                    />
                    <Input
                      type="date"
                      placeholder="Hasta"
                      value={dateRange.to}
                      onChange={(e) => setDateRange(prev => ({ ...prev, to: e.target.value }))}
                      className="text-xs"
                    />
                  </div>
                </div>

                {/* Rango de montos */}
                <div className="space-y-2">
                  <label className="text-sm font-medium flex items-center gap-2">
                    <DollarSign className="h-4 w-4" />
                    Rango de Montos
                  </label>
                  <div className="grid grid-cols-2 gap-2">
                    <Input
                      type="number"
                      placeholder="Mínimo"
                      value={minAmount}
                      onChange={(e) => setMinAmount(e.target.value)}
                      className="text-xs"
                    />
                    <Input
                      type="number"
                      placeholder="Máximo"
                      value={maxAmount}
                      onChange={(e) => setMaxAmount(e.target.value)}
                      className="text-xs"
                    />
                  </div>
                </div>

                {/* Vendedor */}
                <VendorFilter
                  selectedVendor={selectedVendor}
                  onVendorChange={setSelectedVendor}
                />

                {/* Período de comparación */}
                <PeriodSelector
                  selectedPeriod={selectedPeriod}
                  onPeriodChange={setSelectedPeriod}
                  customRange={customRange}
                  onCustomRangeChange={setCustomRange}
                />

                {/* Cliente específico */}
                <div className="space-y-2">
                  <label className="text-sm font-medium flex items-center gap-2">
                    <Users className="h-4 w-4" />
                    Cliente
                  </label>
                  <Select value={selectedClient} onValueChange={setSelectedClient}>
                    <SelectTrigger className="text-xs">
                      <SelectValue placeholder="Seleccionar cliente" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">Todos los clientes</SelectItem>
                      {uniqueClients.map(client => (
                        <SelectItem key={client} value={client}>
                          {client}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                {/* Botones de acción */}
                <div className="flex gap-2 pt-2">
                  <Button onClick={applyAdvancedFilters} size="sm" className="flex-1">
                    Aplicar
                  </Button>
                  <Button onClick={clearAdvancedFilters} variant="outline" size="sm" className="flex-1">
                    Limpiar
                  </Button>
                </div>
              </div>
            </PopoverContent>
          </Popover>

          {/* Botón de descarga */}
          <Button 
            variant="outline" 
            size="icon" 
            className="rounded-lg"
            onClick={exportToCSV}
          >
            <FileDown className="h-5 w-5" />
          </Button>
        </div>
      </header>

      {/* Métricas comparativas */}
      <section className="w-full mt-2 mb-4 px-3">
        <h3 className="text-base font-semibold mb-3">Análisis Comparativo</h3>
        <OrderMetricsCards
          currentOrders={currentOrders}
          previousOrders={previousOrders}
          currentPeriod={periodLabels.current}
          previousPeriod={periodLabels.previous}
        />
      </section>

      {/* Search */}
      <section className="w-full mt-1 px-3">
        <div className="relative w-full">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground pointer-events-none" />
          <Input
            placeholder="Buscar por ID o cliente..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10 h-11 rounded-xl bg-background text-base w-full border border-border shadow-none focus:bg-background"
            autoCorrect="off"
            autoCapitalize="none"
            spellCheck={false}
            style={{ minWidth: 0, borderRadius: 14 }}
          />
        </div>
      </section>

      {/* Estado selector */}
      <section className="w-full mt-2 px-3">
        <Select value={currentStatus} onValueChange={val => setCurrentStatus(val as "all" | OrderStatus | "vendor_created" | "vendor_edited")}>
          <SelectTrigger className="w-full h-10 rounded-full border border-border bg-background shadow-none text-sm px-3">
            <SelectValue placeholder="Filtrar por estado" />
          </SelectTrigger>
          <SelectContent className="z-50 bg-popover">
            {STATUS_OPTIONS.map(opt => (
              <SelectItem key={opt.value} value={opt.value}>
                {opt.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </section>

      {/* Order cards */}
      <div className="flex-1 flex flex-col gap-3 w-full mt-4 px-3 overflow-x-hidden">
        {filteredOrders.length === 0 ? (
          <div className="flex flex-col items-center justify-center min-h-[120px] text-muted-foreground w-full">
            <User className="mb-2 h-8 w-8" />
            <span>No se encontraron pedidos</span>
          </div>
        ) : (
          <ul className="w-full flex flex-col gap-3 px-0 m-0 overflow-x-hidden">
            {filteredOrders.map(order => (
              <li
                key={order.id}
                className="group relative w-full rounded-2xl bg-card border border-border flex flex-row items-center p-0 m-0 overflow-hidden cursor-pointer active:scale-[0.98] transition select-none shadow-sm"
                onClick={() => handleOrderClick(order)}
                role="button"
                tabIndex={0}
                style={{
                  minWidth: 0,
                  maxWidth: "100%",
                  boxSizing: "border-box",
                }}
              >
                <div className="flex flex-col w-full min-w-0 p-4 gap-3">
                  {/* Primera línea: ID y Cliente */}
                  <div className="flex items-center gap-2 w-full min-w-0">
                    <User className="h-5 w-5 text-primary flex-shrink-0" />
                    <div className="flex flex-col flex-1 min-w-0">
                      <span className="text-sm font-medium truncate">#{order.id}</span>
                      <span className="text-xs text-muted-foreground truncate">{order.customer}</span>
                    </div>
                  </div>
                  
                  {/* Segunda línea: Total y Estado */}
                  <div className="flex items-center justify-between gap-2 w-full min-w-0">
                    <span className="text-lg font-bold text-primary">${order.total.toLocaleString("es-CL")}</span>
                    <Badge
                      className={`${getStatusColor(order.status)} text-white px-2.5 py-1 text-xs rounded-full font-semibold flex-shrink-0`}
                    >
                      {getStatusLabel(order.status)}
                    </Badge>
                  </div>
                  
                  {/* Tercera línea: Fecha y productos */}
                  <div className="flex items-center justify-between text-xs text-muted-foreground w-full min-w-0">
                    <span>{order.date}</span>
                    <span>{order.items.length} {order.items.length === 1 ? 'producto' : 'productos'}</span>
                  </div>
                </div>
                
                <div className="px-2 flex items-center h-full self-stretch bg-gradient-to-l from-background to-transparent group-active:from-muted transition">
                  <ChevronRight className="h-6 w-6 text-muted-foreground opacity-60" />
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>
    </main>
  );
}
