
import React from "react";
import { Order } from "@/types/order";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Eye, Truck, Download, Star, Edit3, Upload, Clock, Building2 } from "lucide-react";
import OrderStatusProgress from "@/components/orders/OrderStatusProgress";
import PaymentProofDialog from "./PaymentProofDialog";
import BankingInfoDialog from "./BankingInfoDialog";
import { 
  Tooltip, 
  TooltipContent, 
  TooltipProvider, 
  TooltipTrigger 
} from "@/components/ui/tooltip";
import { useIsMobile } from "@/hooks/use-mobile";
import { useNavigate } from "react-router-dom";
import { useQuotation } from "@/contexts/QuotationContext";

interface OrderCardProps {
  order: Order;
  onSelectOrder: (order: Order) => void;
  onPaymentProofUploaded?: (orderId: string, paymentProof: any) => void;
}

export default function OrderCard({ order, onSelectOrder, onPaymentProofUploaded }: OrderCardProps) {
  const isMobile = useIsMobile();
  const navigate = useNavigate();
  const { clearQuotation, addItem } = useQuotation();

  // Debug logs (muted)
  // console.debug("OrderCard - Order:", order.id, "Status:", order.status, "PaymentProof:", !!order.paymentProof);
  
  const handleViewDetails = () => {
    navigate(`/main/orders/${order.id}`);
  };

  const handleModifyOrder = () => {
    // Clear current quotation
    clearQuotation();
    
    // Load order items into quotation context
    order.items.forEach(item => {
      // Cargar item mínimo en el carrito sin depender de mocks
      addItem({
        id: item.productId || `${item.name.toLowerCase().replace(/ /g, '-')}-001`,
        name: item.name,
        price: item.price,
        image: item.image || "",
        brand: item.brand || "",
        category: item.category || "",
        type: item.type || "",
        volume: item.volume || 0,
        volumeUnit: item.volumeUnit || "",
        description: item.description || item.name,
        stock: item.stock ?? 0,
        discount: item.discount ?? 0,
        isNew: false,
        isPopular: false,
        sku: item.sku || `SKU-${item.name.replace(/\s+/g, '-').toLowerCase()}`,
        loyaltyPoints: item.loyaltyPoints ?? 0
      } as any, item.quantity);
    });
    
    // Navigate to checkout with editing context
    navigate("/main/quotation-checkout");
  };
  const getDaysSinceDelivery = () => {
    if (order.status !== "delivered") return 0;
    const deliveryDate = new Date(order.date);
    const today = new Date();
    const diffTime = Math.abs(today.getTime() - deliveryDate.getTime());
    const days = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    // console.debug("Days since delivery for", order.id, ":", days);
    return days;
  };

  const daysSinceDelivery = getDaysSinceDelivery();
  const isPaymentOverdue = order.status === "delivered" && daysSinceDelivery > 30;
  
  return (
    <Card 
      key={order.id} 
      className="overflow-hidden border-0 shadow-sm transition-all hover:shadow-md 
      bg-white dark:bg-slate-950 order-card"
    >
      <CardHeader className="pb-2 bg-slate-50/80 dark:bg-slate-900/50 backdrop-blur-sm">
        <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-2">
          <div className="flex-1">
            <div className="flex items-center justify-between">
              <CardTitle className="text-lg font-medium"># {order.id}</CardTitle>
            {/* Estados en el área superior derecha */}
              {order.status === "paid" && (
                <Badge className="bg-green-50 text-green-700 border-green-200 shadow-sm">
                  ✓ Pagado
                </Badge>
              )}
              {order.status === "payment_pending" && (
                <Badge className="bg-amber-50 text-amber-700 border-amber-200 shadow-sm">
                  ⏳ Verificando Pago
                </Badge>
              )}
            </div>
            <p className="text-sm text-muted-foreground">
              {order.date} • 
              {order.items.length} {order.items.length === 1 ? 'producto' : 'productos'} • 
              ${order.total.toLocaleString('es-CL')}
            </p>
          </div>
          
          <div className="flex flex-wrap gap-2 sm:justify-end mt-2 sm:mt-0">
            <Button 
              variant="outline" 
              size={isMobile ? "sm" : "default"} 
              onClick={handleViewDetails}
              className="shadow-sm hover:shadow min-w-[110px]"
            >
              <Eye className="mr-2 h-4 w-4" />
              Ver Detalles
            </Button>
            
            {order.status === "shipped" && order.trackingInfo && (
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button 
                      variant="outline" 
                      size={isMobile ? "sm" : "default"}
                      className="shadow-sm hover:shadow min-w-[110px]"
                    >
                      <Truck className="mr-2 h-4 w-4" />
                      Tracking
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent side="top" align="end" className="max-w-sm">
                    <p className="text-sm font-medium">Información de envío:</p>
                    <p className="text-sm">
                      {order.trackingInfo.company} - {order.trackingInfo.trackingNumber}
                    </p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            )}
            
            {(order.status === "requested" || order.status === "quotation") && (
              <Button 
                variant="outline" 
                size={isMobile ? "sm" : "default"} 
                onClick={handleModifyOrder}
                className="text-blue-600 hover:text-blue-700 hover:bg-blue-50 shadow-sm hover:shadow min-w-[110px]"
              >
                <Edit3 className="mr-2 h-4 w-4" />
                Modificar
              </Button>
            )}
            
            {/* Ver Factura - también disponible cuando se puede subir pago */}
            {(order.status === "invoiced" || order.status === "shipped" || 
              order.status === "delivered" || order.status === "payment_pending" || 
              order.status === "paid" || order.status === "completed") && (
              <Button 
                variant="outline" 
                size={isMobile ? "sm" : "default"}
                className="shadow-sm hover:shadow min-w-[110px]"
              >
                <Download className="mr-2 h-4 w-4" />
                Ver Factura
              </Button>
            )}

            {/* Datos Bancarios - cuando está entregado pero no pagado */}
            {order.status === "delivered" && !order.paymentProof && (
              <BankingInfoDialog orderTotal={order.total} orderId={order.id}>
                <Button 
                  variant="outline" 
                  size={isMobile ? "sm" : "default"}
                  className="shadow-sm hover:shadow min-w-[110px] text-blue-600 hover:text-blue-700 hover:bg-blue-50"
                >
                  <Building2 className="mr-2 h-4 w-4" />
                  Datos Bancarios
                </Button>
              </BankingInfoDialog>
            )}
            
            {/* Subir Comprobante de Pago */}
            {order.status === "delivered" && !order.paymentProof && (
              <PaymentProofDialog 
                order={order}
                onPaymentProofUploaded={onPaymentProofUploaded || (() => {})}
              >
                <Button 
                  variant={isPaymentOverdue ? "default" : "outline"}
                  size={isMobile ? "sm" : "default"}
                  className={`shadow-sm hover:shadow min-w-[110px] ${
                    isPaymentOverdue 
                      ? "bg-amber-600 hover:bg-amber-700 text-white" 
                      : "text-blue-600 hover:text-blue-700 hover:bg-blue-50"
                  }`}
                >
                  <Upload className="mr-2 h-4 w-4" />
                  {isPaymentOverdue ? "¡Subir Pago!" : "Subir Pago"}
                </Button>
              </PaymentProofDialog>
            )}

            {/* Mostrar información del comprobante cuando ya está pagado o esperando verificación */}
            {order.paymentProof && (
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button 
                      variant="outline" 
                      size={isMobile ? "sm" : "default"}
                      className={`shadow-sm hover:shadow min-w-[110px] ${
                        order.status === "payment_pending" 
                          ? "text-amber-600 hover:text-amber-700 hover:bg-amber-50"
                          : "text-green-600 hover:text-green-700 hover:bg-green-50"
                      }`}
                    >
                      <Download className="mr-2 h-4 w-4" />
                      Ver Comprobante
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent side="top" align="end" className="max-w-sm">
                    <p className="text-sm font-medium">Comprobante subido:</p>
                    <p className="text-sm">{order.paymentProof.fileName}</p>
                    <p className="text-xs text-muted-foreground">
                      {new Date(order.paymentProof.uploadDate).toLocaleDateString('es-CL')}
                    </p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            )}
            
            {order.status === "delivered" && daysSinceDelivery > 0 && (
              <div className="flex items-center text-xs text-muted-foreground">
                <Clock className="h-3 w-3 mr-1" />
                {daysSinceDelivery} día{daysSinceDelivery !== 1 ? 's' : ''} desde entrega
              </div>
            )}
            
            
            {(order.status === "requested" || order.status === "quotation") && (
              <Button 
                variant="outline" 
                size={isMobile ? "sm" : "default"} 
                className="text-red-500 hover:text-red-600 hover:bg-red-50 shadow-sm hover:shadow min-w-[110px]"
              >
                Cancelar
              </Button>
            )}
          </div>
        </div>
      </CardHeader>
      
      <CardContent className={`pt-4 pb-4 ${isMobile ? 'px-3' : 'px-6'}`}>
        <OrderStatusProgress status={order.status} />
      </CardContent>
    </Card>
  );
}
