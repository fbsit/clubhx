import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Order } from "@/types/order";
import { listOrders } from "@/services/ordersApi";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { ArrowLeft, Download, Upload, Building2, Calendar, Package, User, CreditCard, Flag, Gift } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { useIsMobile } from "@/hooks/use-mobile";
import PaymentProofDialog from "@/components/orders/PaymentProofDialog";
import ReportOrderIssueDialog from "@/components/orders/ReportOrderIssueDialog";
import SalesOrderDetailView from "@/components/orders/sales/SalesOrderDetailView";
import { toast } from "sonner";

export default function OrderDetail() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [order, setOrder] = useState<Order | null>(null);
  const isMobile = useIsMobile();

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const data = await listOrders({ limit: 100 });
        const found = (data.results || []).find((o: any) => o.id === id) || null;
        if (!cancelled) setOrder(found);
      } catch {
        if (!cancelled) setOrder(null);
      }
    })();
    return () => { cancelled = true; };
  }, [id]);

  const handlePaymentProofUploaded = (orderId: string, paymentProof: any) => {
    if (order) {
      const updatedOrder = { ...order, status: "paid" as const, paymentProof };
      setOrder(updatedOrder);
      toast.success("Comprobante subido correctamente");
    }
  };

  const handlePaymentVerified = (orderId: string, verified: boolean) => {
    if (order) {
      const newStatus = verified ? "paid" : "payment_pending";
      setOrder({ ...order, status: newStatus });
    }
  };

  const handleStatusUpdate = (orderId: string, newStatus: any) => {
    if (order) {
      setOrder({ ...order, status: newStatus });
    }
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('es-CL', {
      style: 'currency',
      currency: 'CLP'
    }).format(amount);
  };

  const formatDate = (date: string) => {
    return new Date(date).toLocaleDateString('es-CL', {
      day: '2-digit',
      month: '2-digit', 
      year: 'numeric'
    });
  };

  const getStatusLabel = (status: string) => {
    const statusMap = {
      quotation: "Cotización",
      requested: "Solicitado",
      accepted: "Aceptado",
      invoiced: "Facturado",
      shipped: "Enviado",
      delivered: "Entregado",
      payment_pending: "Esperando Verificación",
      paid: "Pagado",
      completed: "Completado",
      rejected: "Rechazado",
      canceled: "Cancelado"
    };
    return statusMap[status as keyof typeof statusMap] || status;
  };

  const getStatusColor = (status: string) => {
    const colorMap = {
      quotation: "bg-gray-100 text-gray-800",
      requested: "bg-yellow-100 text-yellow-800", 
      accepted: "bg-blue-100 text-blue-800",
      invoiced: "bg-purple-100 text-purple-800",
      shipped: "bg-orange-100 text-orange-800",
      delivered: "bg-green-100 text-green-800",
      payment_pending: "bg-amber-100 text-amber-800",
      paid: "bg-green-100 text-green-800",
      completed: "bg-green-100 text-green-800",
      rejected: "bg-red-100 text-red-800",
      canceled: "bg-red-100 text-red-800"
    };
    return colorMap[status as keyof typeof colorMap] || "bg-gray-100 text-gray-800";
  };

  // Calculate loyalty points (base rule: 1 point per 1800 CLP, but can vary by product)
  const calculateLoyaltyPoints = (total: number) => {
    // Base calculation - in real app this would come from product-specific rules
    return Math.floor(total / 1800);
  };

  const shouldShowLoyaltyPoints = order?.status === "completed" || order?.status === "paid";

  if (!order) {
    return (
      <div className="container max-w-4xl py-8">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-4">Pedido no encontrado</h1>
          <Button onClick={() => navigate("/main/orders")} variant="outline">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Volver a Pedidos
          </Button>
        </div>
      </div>
    );
  }

  // Sales users get their dedicated management view
  if (user?.role === "sales") {
    return (
      <SalesOrderDetailView
        order={order}
        onPaymentVerified={handlePaymentVerified}
        onStatusUpdate={handleStatusUpdate}
      />
    );
  }

  if (isMobile) {
    return (
      <div className="min-h-screen bg-white pb-20">
        {/* Mobile Header */}
        <div className="sticky top-0 bg-white border-b border-gray-200 px-4 py-3 z-10">
          <div className="flex items-center justify-between">
            <Button 
              variant="ghost" 
              size="sm" 
              onClick={() => navigate("/main/orders")}
              className="p-2"
            >
              <ArrowLeft className="h-5 w-5" />
            </Button>
            <Badge className={getStatusColor(order.status)}>
              {getStatusLabel(order.status)}
            </Badge>
          </div>
          <div className="mt-2">
            <h1 className="text-lg font-bold">#{order.id}</h1>
            <p className="text-sm text-muted-foreground">{formatDate(order.date)}</p>
          </div>
        </div>

        {/* Mobile Content */}
        <div className="px-4 py-4 space-y-4">
          {/* Order Summary Card */}
          <div className="bg-gray-50 rounded-lg p-4">
            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-sm text-muted-foreground">Cliente</span>
                <span className="font-medium">{order.customer}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-muted-foreground">Total</span>
                <span className="font-bold text-lg">{formatCurrency(order.total)}</span>
              </div>
              {shouldShowLoyaltyPoints && (
                <div className="flex justify-between items-center p-2 bg-green-50 rounded">
                  <span className="text-sm text-green-700">Puntos ganados</span>
                  <span className="font-bold text-green-700">+{calculateLoyaltyPoints(order.total)}</span>
                </div>
              )}
            </div>
          </div>

          {/* Products */}
          <div className="space-y-3">
            <h3 className="font-medium">Productos</h3>
            {order.items.map((item, index) => (
              <div key={index} className="bg-white border border-gray-200 rounded-lg p-3">
                <div className="flex justify-between items-start">
                  <div className="flex-1 pr-3">
                    <p className="font-medium text-sm">{item.name}</p>
                    <p className="text-xs text-muted-foreground">Cantidad: {item.quantity}</p>
                  </div>
                  <div className="text-right">
                    <p className="font-semibold">{formatCurrency(item.price * item.quantity)}</p>
                    <p className="text-xs text-muted-foreground">{formatCurrency(item.price)} c/u</p>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Shipping & Payment Info */}
          {order.trackingInfo && (
            <div className="bg-white border border-gray-200 rounded-lg p-4">
              <h4 className="font-medium mb-2">Envío</h4>
              <div className="space-y-1">
                <p className="text-sm"><strong>Empresa:</strong> {order.trackingInfo.company}</p>
                <p className="text-sm"><strong>Tracking:</strong> {order.trackingInfo.trackingNumber}</p>
              </div>
            </div>
          )}

          {order.paymentProof && (
            <div className="bg-white border border-gray-200 rounded-lg p-4">
              <h4 className="font-medium mb-2">Comprobante</h4>
              <div className="space-y-2">
                <p className="text-sm">{order.paymentProof.fileName}</p>
                <p className="text-xs text-muted-foreground">{formatDate(order.paymentProof.uploadDate)}</p>
              </div>
            </div>
          )}

          {/* Mobile Actions */}
          <div className="space-y-2 pt-4">
            {(order.status === "invoiced" || order.status === "shipped" || 
              order.status === "delivered" || order.status === "payment_pending" || 
              order.status === "paid" || order.status === "completed") && (
              <Button variant="outline" className="w-full">
                <Download className="mr-2 h-4 w-4" />
                Ver Factura
              </Button>
            )}

            {order.status === "delivered" && !order.paymentProof && (
              <PaymentProofDialog 
                order={order}
                onPaymentProofUploaded={handlePaymentProofUploaded}
              >
                <Button className="w-full">
                  <Upload className="mr-2 h-4 w-4" />
                  Subir Comprobante
                </Button>
              </PaymentProofDialog>
            )}

            {!["quotation", "requested", "rejected", "canceled"].includes(order.status) && (
              <ReportOrderIssueDialog orderId={order.id}>
                <Button variant="outline" className="w-full">
                  <Flag className="mr-2 h-4 w-4" />
                  Reportar Problema
                </Button>
              </ReportOrderIssueDialog>
            )}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="container max-w-4xl py-6 space-y-6">
      {/* Header */}
      <div className="space-y-4">
        {/* First line: Back button and status badges */}
        <div className="flex items-center justify-between">
          <Button 
            variant="ghost" 
            size="sm" 
            onClick={() => navigate("/main/orders")}
          >
            <ArrowLeft className="mr-2 h-4 w-4" />
            Volver
          </Button>
          
          <div className="flex items-center gap-3">
            <Badge className={getStatusColor(order.status)}>
              {getStatusLabel(order.status)}
            </Badge>
            {order.status === "paid" && (
              <Badge className="bg-green-100 text-green-800 border-green-300">
                ✓ Pagado
              </Badge>
            )}
          </div>
        </div>
        
        {/* Second line: Order title and date */}
        <div>
          <h1 className="text-2xl font-bold">Pedido #{order.id}</h1>
          <p className="text-muted-foreground">
            Fecha: {formatDate(order.date)}
          </p>
        </div>
      </div>

      {/* Order Summary */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Package className="h-5 w-5" />
            Resumen del Pedido
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="flex items-center gap-3">
              <User className="h-4 w-4 text-muted-foreground" />
              <div>
                <p className="text-sm text-muted-foreground">Cliente</p>
                <p className="font-medium">{order.customer}</p>
              </div>
            </div>
            
            <div className="flex items-center gap-3">
              <Calendar className="h-4 w-4 text-muted-foreground" />
              <div>
                <p className="text-sm text-muted-foreground">Fecha</p>
                <p className="font-medium">{formatDate(order.date)}</p>
              </div>
            </div>
            
            <div className="flex items-center gap-3">
              <CreditCard className="h-4 w-4 text-muted-foreground" />
              <div>
                <p className="text-sm text-muted-foreground">Total</p>
                <p className="font-bold text-lg">{formatCurrency(order.total)}</p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Loyalty Points - Only for completed/paid orders */}
      {shouldShowLoyaltyPoints && (
        <Card className="border-green-200 bg-green-50/50">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-green-700">
              <Gift className="h-5 w-5" />
              Puntos de Lealtad Ganados
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-green-600">
                  Has ganado <span className="font-bold">{calculateLoyaltyPoints(order.total)} puntos</span> con este pedido
                </p>
                <p className="text-xs text-green-500 mt-1">
                  Puntos calculados según reglas específicas de cada producto
                </p>
              </div>
              <div className="text-2xl font-bold text-green-700">
                +{calculateLoyaltyPoints(order.total)}
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Products */}
      <Card>
        <CardHeader>
          <CardTitle>Productos</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {order.items.map((item, index) => (
              <div key={index}>
                <div className="flex justify-between items-center py-3">
                  <div className="flex-1">
                    <h4 className="font-medium">{item.name}</h4>
                    <p className="text-sm text-muted-foreground">
                      Cantidad: {item.quantity}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="font-medium">{formatCurrency(item.price)}</p>
                    <p className="text-sm text-muted-foreground">c/u</p>
                  </div>
                  <div className="text-right ml-4">
                    <p className="font-semibold">
                      {formatCurrency(item.price * item.quantity)}
                    </p>
                  </div>
                </div>
                {index < order.items.length - 1 && <Separator />}
              </div>
            ))}
            
            <Separator />
            <div className="flex justify-between items-center pt-3">
              <span className="text-lg font-semibold">Total:</span>
              <span className="text-xl font-bold">{formatCurrency(order.total)}</span>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Shipping Info */}
      {order.trackingInfo && (
        <Card>
          <CardHeader>
            <CardTitle>Información de Envío</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <p><strong>Empresa:</strong> {order.trackingInfo.company}</p>
              <p><strong>Número de tracking:</strong> {order.trackingInfo.trackingNumber}</p>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Payment Proof */}
      {order.paymentProof && (
        <Card>
          <CardHeader>
            <CardTitle>Comprobante de Pago</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <p><strong>Archivo:</strong> {order.paymentProof.fileName}</p>
              <p><strong>Fecha de subida:</strong> {formatDate(order.paymentProof.uploadDate)}</p>
              <Button variant="outline" size="sm">
                <Download className="mr-2 h-4 w-4" />
                Descargar Comprobante
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Actions */}
      <Card>
        <CardHeader>
          <CardTitle>Acciones</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-wrap gap-3">
            {/* Ver Factura */}
            {(order.status === "invoiced" || order.status === "shipped" || 
              order.status === "delivered" || order.status === "payment_pending" || 
              order.status === "paid" || order.status === "completed") && (
              <Button variant="outline">
                <Download className="mr-2 h-4 w-4" />
                Ver Factura
              </Button>
            )}

            {/* Datos Bancarios */}
            {(order.status === "delivered" && !order.paymentProof) && (
              <Button variant="outline">
                <Building2 className="mr-2 h-4 w-4" />
                Datos Bancarios
              </Button>
            )}

            {/* Subir Comprobante */}
            {order.status === "delivered" && !order.paymentProof && (
              <PaymentProofDialog 
                order={order}
                onPaymentProofUploaded={handlePaymentProofUploaded}
              >
                <Button>
                  <Upload className="mr-2 h-4 w-4" />
                  Subir Comprobante
                </Button>
              </PaymentProofDialog>
            )}

            {/* Report Issue - Available for most statuses except quotation/requested */}
            {!["quotation", "requested", "rejected", "canceled"].includes(order.status) && (
              <ReportOrderIssueDialog orderId={order.id}>
                <Button variant="outline">
                  <Flag className="mr-2 h-4 w-4" />
                  Reportar Problema
                </Button>
              </ReportOrderIssueDialog>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}