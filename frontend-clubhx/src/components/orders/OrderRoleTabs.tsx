
import { useState } from "react";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card } from "@/components/ui/card";
import { Order, OrderStatus } from "@/types/order";
import OrderCard from "./OrderCard";
import { useIsMobile } from "@/hooks/use-mobile";

interface OrderRoleTabsProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  orders: Order[];
  filteredOrders: Order[];
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  currentStatus: "all" | OrderStatus;
  setCurrentStatus: (status: "all" | OrderStatus) => void;
  onSelectOrder: (order: Order) => void;
  userRole?: string;
}

export default function OrderRoleTabs({
  activeTab,
  setActiveTab,
  orders,
  filteredOrders,
  searchQuery,
  setSearchQuery,
  currentStatus,
  setCurrentStatus,
  onSelectOrder,
  userRole
}: OrderRoleTabsProps) {
  const isMobile = useIsMobile();
  
  // Count orders by status
  const countByStatus = {
    all: orders.length,
    requested: orders.filter(order => order.status === "requested").length,
    accepted: orders.filter(order => order.status === "accepted").length,
    invoiced: orders.filter(order => order.status === "invoiced").length,
    shipped: orders.filter(order => order.status === "shipped").length,
    completed: orders.filter(order => order.status === "completed").length,
    canceled: orders.filter(order => order.status === "canceled" || order.status === "rejected").length
  };
  
  // Handle role-specific tabs
  const showAdminTabs = userRole === "admin";
  const showSalesTabs = userRole === "sales";
  
  return (
    <>
      <div className="flex flex-col md:flex-row gap-4 md:items-center justify-between mb-6">
        <div className="w-full max-w-sm">
          <Input
            placeholder="Buscar por ID de orden..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full"
          />
        </div>
        
        <div className="flex gap-2">
          <Select
            value={currentStatus}
            onValueChange={(value) => setCurrentStatus(value as "all" | OrderStatus)}
          >
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Todos los estados" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Todos ({countByStatus.all})</SelectItem>
              <SelectItem value="requested">Solicitados ({countByStatus.requested})</SelectItem>
              <SelectItem value="accepted">Aceptados ({countByStatus.accepted})</SelectItem>
              <SelectItem value="invoiced">Facturados ({countByStatus.invoiced})</SelectItem>
              <SelectItem value="shipped">Enviados ({countByStatus.shipped})</SelectItem>
              <SelectItem value="completed">Completados ({countByStatus.completed})</SelectItem>
              <SelectItem value="canceled">Cancelados ({countByStatus.canceled})</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>
      
      {(showAdminTabs || showSalesTabs) && (
        <Tabs value={activeTab} onValueChange={setActiveTab} className="mb-6">
          <TabsList>
            <TabsTrigger value="general">Cliente</TabsTrigger>
            {showAdminTabs && <TabsTrigger value="admin">Administración</TabsTrigger>}
            {showSalesTabs && <TabsTrigger value="sales">Ventas</TabsTrigger>}
          </TabsList>
        </Tabs>
      )}
      
      {filteredOrders.length > 0 ? (
        <div className="grid grid-cols-1 gap-4 mt-4">
          {filteredOrders.map((order) => (
            <OrderCard key={order.id} order={order} onSelectOrder={onSelectOrder} />
          ))}
        </div>
      ) : (
        <Card className="p-6 text-center">
          <p className="text-muted-foreground">No se encontraron órdenes que coincidan con los filtros.</p>
        </Card>
      )}
    </>
  );
}
