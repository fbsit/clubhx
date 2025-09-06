import React, { useState } from "react";
import { Order, OrderStatus } from "@/types/order";
import OrderCard from "@/components/orders/OrderCard";
import EmptyOrdersState from "@/components/orders/EmptyOrdersState";
import OrdersSearch from "@/components/orders/OrdersSearch";
import { Button } from "@/components/ui/button";
import { Clock, Eye, Check, X } from "lucide-react";
import { toast } from "sonner";

interface ClientOrdersViewProps {
  filteredOrders: Order[];
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  currentStatus: "all" | OrderStatus | "vendor_created" | "vendor_edited";
  setCurrentStatus: (status: "all" | OrderStatus | "vendor_created" | "vendor_edited") => void;
  onSelectOrder: (order: Order) => void;
  onApproveOrder?: (orderId: string) => void;
  onRejectOrder?: (orderId: string) => void;
  showOldCompleted?: boolean;
  setShowOldCompleted?: (show: boolean) => void;
  hiddenCompletedCount?: number;
  onPaymentProofUploaded?: (orderId: string, paymentProof: any) => void;
}

export default function ClientOrdersView({
  filteredOrders,
  searchQuery,
  setSearchQuery,
  currentStatus,
  setCurrentStatus,
  onSelectOrder,
  onApproveOrder,
  onRejectOrder,
  showOldCompleted = false,
  setShowOldCompleted,
  hiddenCompletedCount = 0,
  onPaymentProofUploaded
}: ClientOrdersViewProps) {
  const [loadingActions, setLoadingActions] = useState<Record<string, boolean>>({});

  const handleApproveOrder = async (orderId: string) => {
    setLoadingActions(prev => ({ ...prev, [orderId]: true }));
    try {
      await onApproveOrder?.(orderId);
      toast.success("Pedido aprobado exitosamente");
    } catch (error) {
      toast.error("Error al aprobar el pedido");
    } finally {
      setLoadingActions(prev => ({ ...prev, [orderId]: false }));
    }
  };

  const handleRejectOrder = async (orderId: string) => {
    setLoadingActions(prev => ({ ...prev, [orderId]: true }));
    try {
      await onRejectOrder?.(orderId);
      toast.success("Pedido rechazado");
    } catch (error) {
      toast.error("Error al rechazar el pedido");
    } finally {
      setLoadingActions(prev => ({ ...prev, [orderId]: false }));
    }
  };

  return (
    <>
      {/* Search and filters */}
      <OrdersSearch 
        searchQuery={searchQuery} 
        setSearchQuery={setSearchQuery} 
        currentStatus={currentStatus}
        setCurrentStatus={setCurrentStatus}
      />

      {/* Orders requiring approval */}
      {filteredOrders.some(order => order.status === "pending_approval") && (
        <div className="mb-6 p-4 bg-orange-50 border border-orange-200 rounded-lg">
          <h3 className="font-semibold text-orange-800 mb-2">Pedidos esperando tu aprobación</h3>
          <p className="text-sm text-orange-700 mb-4">
            Los siguientes pedidos requieren tu aprobación antes de continuar con el proceso.
          </p>
          <div className="space-y-3">
            {filteredOrders
              .filter(order => order.status === "pending_approval")
              .map(order => {
                const isVendorCreated = order.createdBy === "sales";
                const isVendorEdited = order.modifiedBy && order.createdBy === "client";
                
                return (
                  <div key={order.id} className="bg-white p-4 rounded-lg border border-orange-200">
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <span className="font-medium">Pedido #{order.id}</span>
                          {isVendorCreated && (
                            <span className="px-2 py-1 text-xs bg-blue-100 text-blue-800 rounded-full font-medium">
                              Creado por Vendedor
                            </span>
                          )}
                          {isVendorEdited && (
                            <span className="px-2 py-1 text-xs bg-purple-100 text-purple-800 rounded-full font-medium">
                              Editado por Vendedor
                            </span>
                          )}
                        </div>
                        <span className="text-sm text-gray-600">
                          Total: ${order.total.toLocaleString()}
                        </span>
                        {order.salesNotes && (
                          <div className="mt-2 p-2 bg-gray-50 rounded text-sm text-gray-700">
                            <strong>Nota del vendedor:</strong> {order.salesNotes}
                          </div>
                        )}
                      </div>
                      <div className="flex items-center gap-2 ml-4">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => onSelectOrder(order)}
                        >
                          <Eye className="h-4 w-4 mr-1" />
                          Ver detalles
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleRejectOrder(order.id)}
                          disabled={loadingActions[order.id]}
                          className="text-red-600 border-red-200 hover:bg-red-50"
                        >
                          <X className="h-4 w-4 mr-1" />
                          Rechazar
                        </Button>
                        <Button
                          size="sm"
                          onClick={() => handleApproveOrder(order.id)}
                          disabled={loadingActions[order.id]}
                          className="bg-green-600 hover:bg-green-700"
                        >
                          <Check className="h-4 w-4 mr-1" />
                          Aprobar
                        </Button>
                      </div>
                    </div>
                    <div className="text-sm text-gray-600">
                      Fecha: {order.date} | {order.items.length} productos
                      {isVendorEdited && order.modifiedDate && (
                        <span className="ml-2">
                          | Modificado: {new Date(order.modifiedDate).toLocaleDateString()}
                        </span>
                      )}
                    </div>
                  </div>
                );
              })}
          </div>
        </div>
      )}

      {/* Show old completed orders toggle */}
      {hiddenCompletedCount > 0 && setShowOldCompleted && (
        <div className="flex items-center justify-between p-4 bg-muted/30 rounded-lg mt-4">
          <div className="flex items-center gap-2">
            <Clock className="h-4 w-4 text-muted-foreground" />
            <span className="text-sm text-muted-foreground">
              {hiddenCompletedCount} pedido{hiddenCompletedCount !== 1 ? 's' : ''} completado{hiddenCompletedCount !== 1 ? 's' : ''} oculto{hiddenCompletedCount !== 1 ? 's' : ''}
            </span>
          </div>
          <Button
            variant="outline"
            size="sm"
            onClick={() => setShowOldCompleted(!showOldCompleted)}
          >
            <Eye className="h-4 w-4 mr-2" />
            {showOldCompleted ? 'Ocultar' : 'Mostrar'} antiguos
          </Button>
        </div>
      )}
      
      {/* Orders list */}
      <div className="mt-4">
        {filteredOrders.length === 0 ? (
          <EmptyOrdersState />
        ) : (
          <div className="grid gap-4 sm:gap-6">
            {filteredOrders.map((order) => (
              <OrderCard 
                key={order.id}
                order={order}
                onSelectOrder={onSelectOrder}
                onPaymentProofUploaded={onPaymentProofUploaded}
              />
            ))}
          </div>
        )}
      </div>
    </>
  );
}