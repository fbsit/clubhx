import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Order } from "@/types/order";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { 
  ArrowLeft, 
  Eye, 
  RefreshCw, 
  Phone, 
  Mail, 
  MessageCircle, 
  Download,
  AlertTriangle,
  Clock,
  DollarSign,
  Package,
  User
} from "lucide-react";
import PaymentVerificationDialog from "./PaymentVerificationDialog";
import OrderStatusUpdateDialog from "./OrderStatusUpdateDialog";
import { useIsMobile } from "@/hooks/use-mobile";

interface SalesOrderDetailViewProps {
  order: Order;
  onPaymentVerified: (orderId: string, verified: boolean) => void;
  onStatusUpdate: (orderId: string, newStatus: any) => void;
}

export default function SalesOrderDetailView({
  order,
  onPaymentVerified,
  onStatusUpdate,
}: SalesOrderDetailViewProps) {
  const navigate = useNavigate();
  const isMobile = useIsMobile();
  const [paymentDialogOpen, setPaymentDialogOpen] = useState(false);
  const [statusDialogOpen, setStatusDialogOpen] = useState(false);

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("es-CL", {
      style: "currency",
      currency: "CLP"
    }).format(amount);
  };

  const formatDate = (date: string) => {
    return new Date(date).toLocaleDateString("es-CL", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit"
    });
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

  const getStatusLabel = (status: string) => {
    const statusMap = {
      quotation: "Cotización",
      requested: "Solicitado",
      accepted: "Aceptado",
      invoiced: "Facturado",
      shipped: "Enviado",
      delivered: "Entregado",
      payment_pending: "Pendiente Verificación",
      paid: "Pagado",
      completed: "Completado",
      rejected: "Rechazado",
      canceled: "Cancelado"
    };
    return statusMap[status as keyof typeof statusMap] || status;
  };

  const needsAttention = ["payment_pending", "requested", "quotation"].includes(order.status);

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
            <div className="flex items-center gap-2">
              <Badge className={getStatusColor(order.status)}>
                {getStatusLabel(order.status)}
              </Badge>
              {needsAttention && (
                <AlertTriangle className="h-4 w-4 text-yellow-600" />
              )}
            </div>
          </div>
          <div className="mt-2">
            <h1 className="text-lg font-bold">Gestión #{order.id}</h1>
            <p className="text-sm text-muted-foreground">{order.customer}</p>
          </div>
        </div>

        {/* Mobile Management Actions */}
        <div className="px-4 py-3 bg-gray-50 border-b">
          <div className="flex gap-2">
            {order.status === "payment_pending" && order.paymentProof && (
              <Button 
                size="sm" 
                onClick={() => setPaymentDialogOpen(true)}
                className="flex-1"
              >
                <Eye className="h-4 w-4 mr-1" />
                Verificar
              </Button>
            )}
            {["requested", "accepted", "invoiced", "shipped", "delivered"].includes(order.status) && (
              <Button 
                variant="outline" 
                size="sm"
                onClick={() => setStatusDialogOpen(true)}
                className="flex-1"
              >
                <RefreshCw className="h-4 w-4 mr-1" />
                Estado
              </Button>
            )}
          </div>
        </div>

        {/* Mobile Content */}
        <div className="px-4 py-4 space-y-4">
          {/* Client Contact Card */}
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="flex items-center gap-2 text-base">
                <User className="h-4 w-4" />
                Información del Cliente
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex justify-between">
                <span className="text-sm text-muted-foreground">Cliente:</span>
                <span className="font-medium">{order.customer}</span>
              </div>
              <div className="flex gap-2">
                <Button variant="outline" size="sm" className="flex-1">
                  <Phone className="h-4 w-4 mr-1" />
                  Llamar
                </Button>
                <Button variant="outline" size="sm" className="flex-1">
                  <MessageCircle className="h-4 w-4 mr-1" />
                  WhatsApp
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Order Value */}
          <Card>
            <CardContent className="pt-4">
              <div className="text-center">
                <p className="text-sm text-muted-foreground">Valor Total</p>
                <p className="text-2xl font-bold text-primary">{formatCurrency(order.total)}</p>
                <p className="text-xs text-muted-foreground mt-1">
                  {order.items.length} producto(s)
                </p>
              </div>
            </CardContent>
          </Card>

          {/* Products List */}
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-base">Productos</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              {order.items.map((item, index) => (
                <div key={index} className="flex justify-between items-center p-2 bg-gray-50 rounded">
                  <div className="flex-1 pr-2">
                    <p className="text-sm font-medium">{item.name}</p>
                    <p className="text-xs text-muted-foreground">Qty: {item.quantity}</p>
                  </div>
                  <p className="text-sm font-semibold">{formatCurrency(item.price * item.quantity)}</p>
                </div>
              ))}
            </CardContent>
          </Card>

          {/* Management Info */}
          {order.trackingInfo && (
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-base">Tracking</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                <p className="text-sm"><strong>Empresa:</strong> {order.trackingInfo.company}</p>
                <p className="text-sm"><strong>Número:</strong> {order.trackingInfo.trackingNumber}</p>
              </CardContent>
            </Card>
          )}

          {order.paymentProof && (
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-base">Comprobante de Pago</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                <p className="text-sm">{order.paymentProof.fileName}</p>
                <p className="text-xs text-muted-foreground">{formatDate(order.paymentProof.uploadDate)}</p>
                <Button variant="outline" size="sm" className="w-full">
                  <Download className="h-4 w-4 mr-1" />
                  Descargar
                </Button>
              </CardContent>
            </Card>
          )}
        </div>

        {/* Dialogs */}
        <PaymentVerificationDialog
          open={paymentDialogOpen}
          onOpenChange={setPaymentDialogOpen}
          order={order}
          onVerify={onPaymentVerified}
        />

        <OrderStatusUpdateDialog
          open={statusDialogOpen}
          onOpenChange={setStatusDialogOpen}
          order={order}
          onStatusUpdate={onStatusUpdate}
        />
      </div>
    );
  }

  // Desktop version
  return (
    <div className="container max-w-6xl py-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Button 
            variant="ghost" 
            onClick={() => navigate("/main/orders")}
          >
            <ArrowLeft className="mr-2 h-4 w-4" />
            Volver a Pedidos
          </Button>
          <div>
            <h1 className="text-2xl font-bold">Gestión de Pedido #{order.id}</h1>
            <p className="text-muted-foreground">Cliente: {order.customer}</p>
          </div>
        </div>
        
        <div className="flex items-center gap-3">
          <Badge className={getStatusColor(order.status)}>
            {getStatusLabel(order.status)}
          </Badge>
          {needsAttention && (
            <Badge variant="destructive">
              <AlertTriangle className="mr-1 h-3 w-3" />
              Atención
            </Badge>
          )}
        </div>
      </div>

      {/* Quick Actions */}
      <Card>
        <CardHeader>
          <CardTitle>Acciones de Gestión</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex gap-3">
            {order.status === "payment_pending" && order.paymentProof && (
              <Button onClick={() => setPaymentDialogOpen(true)}>
                <Eye className="mr-2 h-4 w-4" />
                Verificar Pago
              </Button>
            )}
            {["requested", "accepted", "invoiced", "shipped", "delivered"].includes(order.status) && (
              <Button variant="outline" onClick={() => setStatusDialogOpen(true)}>
                <RefreshCw className="mr-2 h-4 w-4" />
                Actualizar Estado
              </Button>
            )}
            <Button variant="outline">
              <Phone className="mr-2 h-4 w-4" />
              Contactar Cliente
            </Button>
            <Button variant="outline">
              <Mail className="mr-2 h-4 w-4" />
              Enviar Email
            </Button>
          </div>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column - Order Details */}
        <div className="lg:col-span-2 space-y-6">
          {/* Order Summary */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Package className="h-5 w-5" />
                Resumen del Pedido
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-3 gap-4">
                <div className="text-center p-3 bg-muted rounded">
                  <DollarSign className="h-6 w-6 mx-auto mb-2 text-primary" />
                  <p className="text-2xl font-bold">{formatCurrency(order.total)}</p>
                  <p className="text-sm text-muted-foreground">Valor Total</p>
                </div>
                <div className="text-center p-3 bg-muted rounded">
                  <Package className="h-6 w-6 mx-auto mb-2 text-primary" />
                  <p className="text-2xl font-bold">{order.items.length}</p>
                  <p className="text-sm text-muted-foreground">Productos</p>
                </div>
                <div className="text-center p-3 bg-muted rounded">
                  <Clock className="h-6 w-6 mx-auto mb-2 text-primary" />
                  <p className="text-sm font-bold">{formatDate(order.date)}</p>
                  <p className="text-sm text-muted-foreground">Fecha Pedido</p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Products Table */}
          <Card>
            <CardHeader>
              <CardTitle>Productos del Pedido</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {order.items.map((item, index) => (
                  <div key={index}>
                    <div className="flex justify-between items-center py-3">
                      <div className="flex-1">
                        <h4 className="font-medium">{item.name}</h4>
                        <p className="text-sm text-muted-foreground">
                          Cantidad: {item.quantity} | Precio unitario: {formatCurrency(item.price)}
                        </p>
                      </div>
                      <div className="text-right">
                        <p className="font-bold text-lg">{formatCurrency(item.price * item.quantity)}</p>
                      </div>
                    </div>
                    {index < order.items.length - 1 && <Separator />}
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Additional Info */}
          {order.trackingInfo && (
            <Card>
              <CardHeader>
                <CardTitle>Información de Envío</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                <p><strong>Empresa transportista:</strong> {order.trackingInfo.company}</p>
                <p><strong>Número de seguimiento:</strong> {order.trackingInfo.trackingNumber}</p>
              </CardContent>
            </Card>
          )}
        </div>

        {/* Right Column - Client & Payment Info */}
        <div className="space-y-6">
          {/* Client Information */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <User className="h-5 w-5" />
                Información del Cliente
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <p className="font-medium text-lg">{order.customer}</p>
                <p className="text-sm text-muted-foreground">Cliente activo</p>
              </div>
              
              <div className="space-y-2">
                <Button variant="outline" className="w-full">
                  <Phone className="mr-2 h-4 w-4" />
                  Llamar Cliente
                </Button>
                <Button variant="outline" className="w-full">
                  <MessageCircle className="mr-2 h-4 w-4" />
                  WhatsApp
                </Button>
                <Button variant="outline" className="w-full">
                  <Mail className="mr-2 h-4 w-4" />
                  Enviar Email
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Payment Information */}
          {order.paymentProof && (
            <Card>
              <CardHeader>
                <CardTitle>Comprobante de Pago</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="space-y-2">
                  <p><strong>Archivo:</strong> {order.paymentProof.fileName}</p>
                  <p><strong>Subido:</strong> {formatDate(order.paymentProof.uploadDate)}</p>
                </div>
                <Button variant="outline" className="w-full">
                  <Download className="mr-2 h-4 w-4" />
                  Descargar Comprobante
                </Button>
                {order.status === "payment_pending" && (
                  <Button className="w-full" onClick={() => setPaymentDialogOpen(true)}>
                    <Eye className="mr-2 h-4 w-4" />
                    Verificar y Aprobar
                  </Button>
                )}
              </CardContent>
            </Card>
          )}

          {/* Management Notes */}
          <Card>
            <CardHeader>
              <CardTitle>Notas de Gestión</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">
                Historial de acciones y notas internas del pedido aparecerán aquí.
              </p>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Dialogs */}
      <PaymentVerificationDialog
        open={paymentDialogOpen}
        onOpenChange={setPaymentDialogOpen}
        order={order}
        onVerify={onPaymentVerified}
      />

      <OrderStatusUpdateDialog
        open={statusDialogOpen}
        onOpenChange={setStatusDialogOpen}
        order={order}
        onStatusUpdate={onStatusUpdate}
      />
    </div>
  );
}