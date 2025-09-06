
import React from "react";
import { Order, OrderStatus } from "@/types/order";
import { useIsMobile } from "@/hooks/use-mobile";
import MobileAdminOrdersView from "./MobileAdminOrdersView";

interface AdminOrdersViewProps {
  filteredOrders: Order[];
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  currentStatus: "all" | OrderStatus | "vendor_created" | "vendor_edited";
  setCurrentStatus: (status: "all" | OrderStatus | "vendor_created" | "vendor_edited") => void;
  onSelectOrder: (order: Order) => void;
}

export default function AdminOrdersView({
  filteredOrders,
  searchQuery,
  setSearchQuery,
  currentStatus,
  setCurrentStatus,
  onSelectOrder,
}: AdminOrdersViewProps) {
  const isMobile = useIsMobile();

  // Siempre usar la vista móvil específica para admin
  return (
    <MobileAdminOrdersView
      filteredOrders={filteredOrders}
      searchQuery={searchQuery}
      setSearchQuery={setSearchQuery}
      currentStatus={currentStatus}
      setCurrentStatus={setCurrentStatus}
      onSelectOrder={onSelectOrder}
    />
  );
}
