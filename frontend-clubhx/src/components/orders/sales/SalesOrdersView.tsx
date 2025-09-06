
import React, { useState } from "react";
import { Order, OrderStatus } from "@/types/order";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { FileDown, Search, User, ChevronDown, Eye, Check, RefreshCw, AlertCircle, FileText, Edit, Send, Wrench } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useSalesQuotation } from "@/contexts/SalesQuotationContext";
import { exportFilteredOrders } from "@/utils/exportUtils";
import { toast } from "sonner";
import { useIsMobile } from "@/hooks/use-mobile";
import { usePagination } from "@/hooks/usePagination";
import { PaginationControls } from "@/components/ui/pagination-controls";
import MobileSalesOrdersView from "./MobileSalesOrdersView";
import PaymentVerificationDialog from "./PaymentVerificationDialog";
import OrderStatusUpdateDialog from "./OrderStatusUpdateDialog";
import { SalesOrdersKPIHeader } from "./SalesOrdersKPIHeader";

interface SalesOrdersViewProps {
  filteredOrders: Order[];
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  currentStatus: "all" | OrderStatus | "draft" | "vendor_created" | "vendor_edited" | "collections";
  setCurrentStatus: (status: "all" | OrderStatus | "draft" | "vendor_created" | "vendor_edited" | "collections") => void;
  onSelectOrder: (order: Order) => void;
  onPaymentVerified: (orderId: string, verified: boolean) => void;
  onStatusUpdate: (orderId: string, newStatus: OrderStatus) => void;
}

export default function SalesOrdersView({
  filteredOrders,
  searchQuery,
  setSearchQuery,
  currentStatus,
  setCurrentStatus,
  onSelectOrder,
  onPaymentVerified,
  onStatusUpdate,
}: SalesOrdersViewProps) {
  const isMobile = useIsMobile();
  const navigate = useNavigate();
  const [paymentDialogOpen, setPaymentDialogOpen] = useState(false);
  const [statusDialogOpen, setStatusDialogOpen] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  
  // Check URL parameters to set initial view mode  
  const urlParams = new URLSearchParams(window.location.search);
  const initialStatus = urlParams.get('view') === 'drafts' ? 'draft' : 'all';
  
  // Set initial status from URL if coming from drafts view
  React.useEffect(() => {
    if (initialStatus === 'draft') {
      setCurrentStatus('draft');
    }
  }, [setCurrentStatus]);
  
  const { quotations, sendToCustomer, deleteQuotation, setSelectedCustomer, updateQuotation, clearItems, loadOrderForEditing } = useSalesQuotation();

  // Combine orders and quotations
  const allItems = React.useMemo(() => {
    const orderItems = filteredOrders.map(order => ({ ...order, type: "order" as const }));
    const quotationItems = quotations.map(quotation => ({
      id: quotation.id,
      customer: quotation.customerName,
      date: new Date(quotation.createdAt).toLocaleDateString(),
      total: quotation.items.reduce((total, item) => total + (item.product.price * item.quantity), 0),
      status: quotation.status,
      type: "quotation" as const
    }));

    let combined = [...orderItems, ...quotationItems];
    
    // Filter by status including drafts and collections
    if (currentStatus === "draft") {
      combined = combined.filter(item => item.type === "quotation" && item.status === "draft");
    } else if (currentStatus === "collections") {
      combined = combined.filter(item => item.type === "order" && ["payment_pending", "invoiced", "paid"].includes(item.status));
    } else if (currentStatus !== "all") {
      combined = combined.filter(item => 
        item.type === "order" && item.status === currentStatus
      );
    }

    return combined;
  }, [filteredOrders, quotations, currentStatus]);

  // Pagination setup
  const [paginatedItems, paginationState, paginationActions] = usePagination(allItems, {
    initialPageSize: 10,
    maxPageSize: 50,
  });

  // Get orders that need attention for priority display
  const ordersNeedingAttention = filteredOrders.filter(order => 
    order.status === "payment_pending" || 
    order.status === "requested" || 
    order.status === "quotation"
  );

  const handlePaymentVerification = (order: Order) => {
    setSelectedOrder(order);
    setPaymentDialogOpen(true);
  };

  const handleStatusUpdate = (order: Order) => {
    setSelectedOrder(order);
    setStatusDialogOpen(true);
  };

  const handleExportOrders = () => {
    try {
      const result = exportFilteredOrders(
        filteredOrders,
        { searchQuery, status: (currentStatus === 'draft' || currentStatus === 'vendor_created' || currentStatus === 'vendor_edited' || currentStatus === 'collections') ? 'all' : currentStatus },
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

  const handleContinueEditing = async (quotationId: string) => {
    try {
      const quotation = quotations.find(q => q.id === quotationId);
      if (!quotation) {
        toast.error("Cotización no encontrada");
        return;
      }

      // Find customer by name (you might want to improve this to use ID)
      const customer = { 
        id: quotation.customerId, 
        name: quotation.customerName,
        email: '', // You'd need to get this from your customer data
        contact: '', // You'd need to get this from your customer data
      };

      // Set the customer and navigate to products
      setSelectedCustomer(customer as any);
      
      // Clear current items and set the quotation items
      clearItems();
      
      // Add items from the quotation to the cart
      // Note: This would need to be implemented properly with the actual products
      quotation.items.forEach(item => {
        // You'd need to call addItem with the actual product data
        // For now, just navigate and let the user re-add items
      });

      toast.success("Continuando edición del borrador");
      navigate("/main/products");
    } catch (error) {
      toast.error("Error al continuar editando el borrador");
    }
  };

  const handleEditOrder = async (order: Order) => {
    try {
      // Find customer by name or ID - simplified for demo
      const customer = {
        id: order.customerId || order.customer,
        name: order.customer,
        email: '',
        contact: '',
        totalSpent: 0,
        totalOrders: 0,
        loyaltyPoints: 0,
        status: 'active' as const
      };

      // Update order status to processing to prevent multiple edits
      onStatusUpdate(order.id, "processing");
      
      // Load order for editing
      loadOrderForEditing(order, customer as any);
      
      // Navigate to products page
      navigate("/main/products");
    } catch (error) {
      toast.error("Error al editar el pedido");
    }
  };

  if (isMobile) {
    return (
      <MobileSalesOrdersView
        filteredOrders={filteredOrders}
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
        currentStatus={currentStatus === "draft" ? "all" : currentStatus}
        setCurrentStatus={(status) => setCurrentStatus(status)}
        onSelectOrder={onSelectOrder}
        onPaymentVerified={onPaymentVerified}
        onStatusUpdate={onStatusUpdate}
      />
    );
  }

  return (
    <div className="space-y-6">
      {/* KPI Header */}
      <SalesOrdersKPIHeader orders={filteredOrders} />
      
      <Card>
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>Pedidos de Clientes</CardTitle>
              <CardDescription>Gestiona los pedidos de tus clientes</CardDescription>
            </div>
            <div className="flex items-center gap-2">
              <Button 
                variant="outline" 
                size="sm"
                onClick={handleExportOrders}
                disabled={filteredOrders.length === 0}
              >
                <FileDown className="mr-2 h-4 w-4" />
                Exportar CSV ({filteredOrders.length})
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="flex items-center gap-3 mb-4">
            <div className="relative flex-grow max-w-md">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                type="search"
                placeholder="Buscar por cliente o ID..."
                className="pl-8"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            <Select 
              value={currentStatus}
              onValueChange={(value) => setCurrentStatus(value as "all" | OrderStatus | "draft" | "vendor_created" | "vendor_edited")}
            >
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Estado" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todos</SelectItem>
                <SelectItem value="draft">Borradores</SelectItem>
                <SelectItem value="requested">Solicitados</SelectItem>
                <SelectItem value="payment_pending">Pendiente verificación</SelectItem>
                <SelectItem value="collections">Cobranza</SelectItem>
                <SelectItem value="accepted">Aceptados</SelectItem>
                <SelectItem value="processing">En proceso</SelectItem>
                <SelectItem value="invoiced">Facturados</SelectItem>
                <SelectItem value="shipped">Enviados</SelectItem>
                <SelectItem value="delivered">Entregados</SelectItem>
                <SelectItem value="completed">Completados</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Priority alerts */}
          {ordersNeedingAttention.length > 0 && (
            <div className="mb-4 p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
              <div className="flex items-center gap-2">
                <AlertCircle className="h-4 w-4 text-yellow-600" />
                <span className="text-sm font-medium text-yellow-800">
                  {ordersNeedingAttention.length} pedido(s) necesitan tu atención
                </span>
              </div>
            </div>
          )}
          
          <div className="rounded-md border overflow-hidden">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Cliente</TableHead>
                  <TableHead>ID Pedido</TableHead>
                  <TableHead>Fecha</TableHead>
                  <TableHead>Monto</TableHead>
                  <TableHead>Estado</TableHead>
                  <TableHead className="text-right">Acciones</TableHead>
                </TableRow>
              </TableHeader>
               <TableBody>
                {paginatedItems.map((item) => (
                  <TableRow key={item.id} className="cursor-pointer hover:bg-muted/50">
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <div className="bg-muted rounded-full p-1">
                          {item.type === "quotation" ? <FileText className="h-4 w-4" /> : <User className="h-4 w-4" />}
                        </div>
                        <span>{item.customer}</span>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        {item.id}
                        {item.type === "quotation" && <Badge variant="outline" className="text-xs">Cotización</Badge>}
                      </div>
                    </TableCell>
                    <TableCell>{item.date}</TableCell>
                    <TableCell>${item.total.toLocaleString()}</TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <Badge
                          className={
                            item.type === "quotation" ? (
                              item.status === "draft" ? "bg-gray-600" :
                              item.status === "sent" ? "bg-blue-600" :
                              item.status === "approved" ? "bg-green-600" :
                              "bg-red-600"
                            ) : (
                               item.status === "completed" ? "bg-green-600" :
                               item.status === "delivered" ? "bg-blue-600" :
                               item.status === "shipped" ? "bg-amber-600" :
                               item.status === "payment_pending" ? "bg-yellow-600" :
                               item.status === "accepted" ? "bg-purple-600" :
                               item.status === "processing" ? "bg-blue-500" :
                               "bg-gray-600"
                            )
                          }
                        >
                          {item.type === "quotation" ? (
                            item.status === "draft" ? "Borrador" :
                            item.status === "sent" ? "Enviada" :
                            item.status === "approved" ? "Aprobada" :
                            "Rechazada"
                          ) : (
                             item.status === "completed" ? "Completado" :
                             item.status === "delivered" ? "Entregado" :
                             item.status === "shipped" ? "Enviado" :
                             item.status === "payment_pending" ? "Pendiente verificación" :
                             item.status === "accepted" ? "Aceptado" :
                             item.status === "requested" ? "Solicitado" :
                             item.status === "processing" ? "En proceso" :
                             item.status
                          )}
                        </Badge>
                      </div>
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex items-center gap-2 justify-end">
                        {item.type === "quotation" ? (
                          <>
                            {item.status === "draft" && (
                              <>
                                <Button 
                                  variant="outline" 
                                  size="sm"
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    handleContinueEditing(item.id);
                                  }}
                                >
                                  <Edit className="h-4 w-4 mr-1" />
                                  Editar
                                </Button>
                                <Button 
                                  variant="outline" 
                                  size="sm"
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    sendToCustomer(item.id);
                                  }}
                                >
                                  <Send className="h-4 w-4 mr-1" />
                                  Enviar
                                </Button>
                              </>
                            )}
                          </>
                        ) : (
                          <>
                            {item.status === "requested" && (
                              <Button 
                                variant="outline" 
                                size="sm"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  handleEditOrder(item as Order);
                                }}
                              >
                                <Wrench className="h-4 w-4 mr-1" />
                                Editar Pedido
                              </Button>
                            )}
                            {item.status === "payment_pending" && (item as any).paymentProof && (
                              <Button 
                                variant="outline" 
                                size="sm"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  handlePaymentVerification(item as Order);
                                }}
                              >
                                <Eye className="h-4 w-4 mr-1" />
                                Verificar
                              </Button>
                            )}
                            {["requested", "accepted", "invoiced", "shipped", "delivered"].includes(item.status) && (
                              <Button 
                                variant="outline" 
                                size="sm"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  handleStatusUpdate(item as Order);
                                }}
                              >
                                <RefreshCw className="h-4 w-4 mr-1" />
                                Estado
                              </Button>
                            )}
                          </>
                        )}
                        <Button 
                          variant="outline" 
                          size="sm"
                          onClick={(e) => {
                            e.stopPropagation();
                            if (item.type === "quotation") {
                              // Navigate to quotation detail
                              console.log("View quotation detail:", item.id);
                            } else {
                              navigate(`/main/orders/${item.id}`);
                            }
                          }}
                        >
                          Ver Detalle
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>

          {/* Pagination */}
          {paginationState.totalPages > 1 && (
            <div className="mt-6">
              <PaginationControls 
                state={paginationState}
                actions={paginationActions}
                className="flex justify-center"
              />
            </div>
          )}
        </CardContent>
      </Card>

      {/* Dialogs */}
      <PaymentVerificationDialog
        open={paymentDialogOpen}
        onOpenChange={setPaymentDialogOpen}
        order={selectedOrder}
        onVerify={onPaymentVerified}
      />

      <OrderStatusUpdateDialog
        open={statusDialogOpen}
        onOpenChange={setStatusDialogOpen}
        order={selectedOrder}
        onStatusUpdate={onStatusUpdate}
      />
    </div>
  );
}
