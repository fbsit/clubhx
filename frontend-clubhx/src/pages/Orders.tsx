
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Order, OrderStatus } from "@/types/order";
// import { mockOrders } from "@/data/mockOrders";
import { useAuth } from "@/contexts/AuthContext";
import OrderStyles from "@/components/orders/OrderStyles";
import { toast } from "sonner";
import ClientOrdersView from "@/components/orders/client/ClientOrdersView";
import AdminOrdersView from "@/components/orders/admin/AdminOrdersView";
import SalesOrdersView from "@/components/orders/sales/SalesOrdersView";
import { useIsMobile } from "@/hooks/use-mobile";
import { OrderStatusService } from "@/services/orderStatusService";
import { useEffect } from "react";
import { listOrders, listOrdersByClient, listOrdersBySeller } from "@/services/ordersApi";
import { usePagination } from "@/hooks/usePagination";
import { PaginationControls } from "@/components/ui/pagination-controls";
import { Loader2 } from "lucide-react";

export default function Orders() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [currentStatus, setCurrentStatus] = useState<"all" | OrderStatus | "draft" | "vendor_created" | "vendor_edited" | "collections">("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [showOldCompleted, setShowOldCompleted] = useState(false);
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchAdminOrders = async () => {
      try {
        setLoading(true);
        setError(null);
        const resp = await listOrders({ limit: 100, offset: 0 });
        const results = (resp as any).results ?? resp;
        setOrders(results as Order[]);
      } catch (e) {
        setOrders([]);
        setError(null);
      } finally {
        setLoading(false);
      }
    };
    const fetchClientOrders = async () => {
      try {
        setLoading(true);
        setError(null);
        const resp = await listOrdersByClient(user!.providerClientPk!, 1);
        const results = (resp as any).results ?? resp;
        setOrders(results as Order[]);
      } catch (e) {
        setOrders([]);
        setError(null);
      } finally {
        setLoading(false);
      }
    };
    const fetchSalesOrders = async () => {
      try {
        setLoading(true);
        setError(null);
        const resp = await listOrdersBySeller(user!.providerSellerPk!, 1);
        const results = (resp as any).results ?? resp;
        setOrders(results as Order[]);
      } catch (e) {
        setOrders([]);
        setError(null);
      } finally {
        setLoading(false);
      }
    };
    if (user?.role === "admin") fetchAdminOrders();
    if (user?.role === "client") fetchClientOrders();
    if (user?.role === "sales") fetchSalesOrders();
  }, [user?.role, user?.id]);
  const isMobile = useIsMobile();

  // Filter orders first, then apply pagination
  const allFilteredOrders = orders.filter(order => {
    // Filter by status and vendor action type
    if (currentStatus !== "all" && currentStatus !== "draft") {
      if (currentStatus === "vendor_created") {
        // Pedidos creados por vendedor (status pending_approval + createdBy sales)
        return order.status === "pending_approval" && order.createdBy === "sales";
      } else if (currentStatus === "vendor_edited") {
        // Pedidos editados por vendedor (status pending_approval + modifiedBy exists + createdBy client)
        return order.status === "pending_approval" && order.modifiedBy && order.createdBy === "client";
      } else if (currentStatus === "collections") {
        // Cobranza: estados relacionados a facturación/pago
        return ["payment_pending", "invoiced", "paid"].includes(order.status);
      } else {
        // Filtro por status normal
        return order.status === currentStatus;
      }
    }
    
    // Filter by search
    if (searchQuery && !order.id.toLowerCase().includes(searchQuery.toLowerCase())) return false;
    
    // Filter old completed orders unless explicitly shown
    if (!showOldCompleted && (order.status === "completed" || order.status === "paid")) {
      const completedDate = order.completedDate ? new Date(order.completedDate) : new Date(order.date);
      const daysSinceCompleted = Math.ceil((new Date().getTime() - completedDate.getTime()) / (1000 * 60 * 60 * 24));
      if (daysSinceCompleted > 30) return false;
    }
    
    return true;
  });

  // Apply pagination only for client view
  const [paginatedOrders, paginationState, paginationActions] = usePagination(
    allFilteredOrders,
    { 
      initialPageSize: user?.role === "client" ? 8 : allFilteredOrders.length,
      enableLoadMore: isMobile && user?.role === "client"
    }
  );
  
  // Use paginated orders for client, all filtered for admin/sales
  const filteredOrders = user?.role === "client" ? paginatedOrders : allFilteredOrders;
  
  // Filter orders based on search query, current status, and completed date - LEGACY CODE, keeping for non-client views

  // Count hidden old completed orders
  const hiddenCompletedCount = orders.filter(order => {
    if (showOldCompleted) return false;
    if (order.status !== "completed" && order.status !== "paid") return false;
    
    const completedDate = order.completedDate ? new Date(order.completedDate) : new Date(order.date);
    const daysSinceCompleted = Math.ceil((new Date().getTime() - completedDate.getTime()) / (1000 * 60 * 60 * 24));
    return daysSinceCompleted > 30;
  }).length;

  // Handle order selection
  const handleSelectOrder = (order: Order) => {
    setSelectedOrder(order);
    navigate(`/main/orders/${order.id}`, { state: { order } });
  };

  // Handle payment proof upload
  const handlePaymentProofUploaded = (orderId: string, paymentProof: any) => {
    setOrders(prevOrders => 
      prevOrders.map(order => {
        if (order.id === orderId) {
          return OrderStatusService.processPaymentProofUpload(order, paymentProof);
        }
        return order;
      })
    );
  };

  // Admin ve su vista específica directamente sin tabs
  if (user?.role === "admin") {
    return (
      <div className="container max-w-7xl py-6 sm:py-8 animate-enter px-3 sm:px-6">
        <h1 className="text-2xl sm:text-3xl font-bold mb-6 sm:mb-8">Gestión de Pedidos</h1>
        
        <AdminOrdersView 
          filteredOrders={filteredOrders}
          searchQuery={searchQuery}
          setSearchQuery={setSearchQuery}
          currentStatus={currentStatus === "draft" || currentStatus === "collections" ? "all" : currentStatus}
          setCurrentStatus={(status) => setCurrentStatus(status)}
          onSelectOrder={handleSelectOrder}
        />

        <OrderStyles />
      </div>
    );
  }

  // SALES: Vista de gestión de pedidos de clientes
  if (user?.role === "sales") {
    return (
      <div className="container max-w-7xl py-6 sm:py-8 animate-enter px-3 sm:px-6">
        {!isMobile && <h1 className="text-2xl sm:text-3xl font-bold mb-6 sm:mb-8">Gestión de Pedidos</h1>}
        
        <SalesOrdersView 
          filteredOrders={filteredOrders}
          searchQuery={searchQuery}
          setSearchQuery={setSearchQuery}
          currentStatus={currentStatus}
          setCurrentStatus={setCurrentStatus}
          onSelectOrder={handleSelectOrder}
          onPaymentVerified={(orderId, verified) => {
            setOrders(prevOrders => 
              prevOrders.map(order => {
                if (order.id === orderId) {
                  return OrderStatusService.processPaymentVerification(order, verified);
                }
                return order;
              })
            );
          }}
          onStatusUpdate={(orderId, newStatus) => {
            setOrders(prevOrders => 
              prevOrders.map(order => {
                if (order.id === orderId) {
                  return OrderStatusService.updateOrderStatus(order, newStatus);
                }
                return order;
              })
            );
          }}
        />

        <OrderStyles />
      </div>
    );
  }

  // Cliente por defecto
  return (
    <div className="container max-w-7xl py-6 sm:py-8 animate-enter px-3 sm:px-6">
      <h1 className="text-2xl sm:text-3xl font-bold mb-6 sm:mb-8">Mis Pedidos</h1>

        {loading ? (
          <div className="flex flex-col items-center justify-center py-16 gap-3 text-muted-foreground">
            <Loader2 className="h-8 w-8 animate-spin" />
            <p className="text-sm">Cargando tus pedidos...</p>
          </div>
        ) : (
        <ClientOrdersView 
          filteredOrders={filteredOrders}
          searchQuery={searchQuery}
          setSearchQuery={setSearchQuery}
          currentStatus={currentStatus === "draft" || currentStatus === "collections" ? "all" : currentStatus}
          setCurrentStatus={(status) => setCurrentStatus(status as any)}
          onSelectOrder={handleSelectOrder}
          onApproveOrder={(orderId) => {
            setOrders(prevOrders => 
              prevOrders.map(order => 
                order.id === orderId 
                  ? { ...order, status: "accepted" as OrderStatus }
                  : order
              )
            );
          }}
          onRejectOrder={(orderId) => {
            setOrders(prevOrders => 
              prevOrders.map(order => 
                order.id === orderId 
                  ? { ...order, status: "rejected" as OrderStatus }
                  : order
              )
            );
          }}
          showOldCompleted={showOldCompleted}
          setShowOldCompleted={setShowOldCompleted}
          hiddenCompletedCount={hiddenCompletedCount}
          onPaymentProofUploaded={handlePaymentProofUploaded}
        />
        )}

        {/* Pagination Controls for Client View (solo cuando no está cargando nueva data) */}
        {user?.role === "client" && !loading && allFilteredOrders.length > 0 && (
          <div className="mt-6">
            <PaginationControls
              state={paginationState}
              actions={paginationActions}
              showLoadMore={isMobile}
              className="border-t pt-4"
            />
          </div>
        )}

        <OrderStyles />
    </div>
  );
}
