
import React from "react";
import { Order, OrderStatus } from "@/types/order";
import OrderHeader from "./detail/OrderHeader";
import StatusAlert from "./detail/StatusAlert";
import OrderInfo from "./detail/OrderInfo";
import CustomerInfo from "./detail/CustomerInfo";
import ProductsList from "./detail/ProductsList";
import ShippingInfo from "./detail/ShippingInfo";
import OrderTimeline from "./detail/OrderTimeline";
import ActionButtons from "./detail/ActionButtons";

interface OrderDetailViewProps {
  order: Order;
  onBack: () => void;
}

const getStatusColor = (status: OrderStatus) => {
  const colorMap = {
    requested: "bg-yellow-500",
    accepted: "bg-blue-500",
    invoiced: "bg-purple-500", 
    shipped: "bg-orange-500",
    completed: "bg-green-500",
    canceled: "bg-red-500",
    rejected: "bg-red-500",
    quotation: "bg-gray-500",
    delivered: "bg-green-600",
    processing: "bg-blue-400"
  };
  return colorMap[status] || "bg-gray-500";
};

const getStatusLabel = (status: OrderStatus) => {
  const statusMap = {
    requested: "Solicitado",
    accepted: "Aceptado", 
    invoiced: "Facturado",
    shipped: "Enviado",
    completed: "Completado",
    canceled: "Cancelado",
    rejected: "Rechazado",
    quotation: "Cotización",
    delivered: "Entregado",
    processing: "En Proceso"
  };
  return statusMap[status] || status;
};

export default function OrderDetailView({ order, onBack }: OrderDetailViewProps) {
  return (
    <div className="w-full min-h-screen bg-background flex flex-col overflow-hidden">
      <OrderHeader 
        order={order} 
        onBack={onBack} 
        getStatusColor={getStatusColor}
        getStatusLabel={getStatusLabel}
      />

      {/* Content */}
      <div className="flex-1 overflow-y-auto pb-24">
        <div className="p-4 space-y-6">
          <StatusAlert status={order.status} />
          
          <OrderInfo 
            order={order} 
            getStatusColor={getStatusColor}
            getStatusLabel={getStatusLabel}
          />
          
          <CustomerInfo order={order} />
          
          <ProductsList order={order} />
          
          <ShippingInfo order={order} />
          
          <OrderTimeline 
            order={order} 
            getStatusLabel={getStatusLabel} 
          />
        </div>
      </div>

      <ActionButtons order={order} />
    </div>
  );
}
