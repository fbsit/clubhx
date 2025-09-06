import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Order } from "@/types/order";
import { Download, Check, X, Eye, AlertTriangle } from "lucide-react";
import { toast } from "sonner";

interface PaymentVerificationDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  order: Order | null;
  onVerify: (orderId: string, verified: boolean) => void;
}

export default function PaymentVerificationDialog({
  open,
  onOpenChange,
  order,
  onVerify,
}: PaymentVerificationDialogProps) {
  const [isProcessing, setIsProcessing] = useState(false);

  if (!order) return null;

  const handleVerify = async (approved: boolean) => {
    setIsProcessing(true);
    
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    onVerify(order.id, approved);
    
    toast.success(
      approved ? "Pago aprobado correctamente" : "Pago rechazado",
      {
        description: approved 
          ? "El pedido ha sido marcado como pagado"
          : "Se ha notificado al cliente sobre el rechazo"
      }
    );
    
    setIsProcessing(false);
    onOpenChange(false);
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
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Eye className="h-5 w-5" />
            Verificar Comprobante de Pago
          </DialogTitle>
          <DialogDescription>
            Revisa el comprobante de pago del pedido #{order.id} y decide si aprobarlo o rechazarlo.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          {/* Order Info */}
          <div className="bg-muted/50 rounded-lg p-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-sm text-muted-foreground">Cliente</p>
                <p className="font-medium">{order.customer}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Total</p>
                <p className="font-bold text-lg">{formatCurrency(order.total)}</p>
              </div>
            </div>
          </div>

          {/* Payment Proof Details */}
          {order.paymentProof && (
            <div className="space-y-3">
              <h4 className="font-medium">Detalles del Comprobante</h4>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-muted-foreground">Archivo</p>
                  <p className="font-medium">{order.paymentProof.fileName}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Fecha de subida</p>
                  <p className="font-medium">{formatDate(order.paymentProof.uploadDate)}</p>
                </div>
              </div>
              
              <Button variant="outline" className="w-full" size="sm">
                <Download className="mr-2 h-4 w-4" />
                Descargar Comprobante
              </Button>
            </div>
          )}

          <Separator />

          {/* Warning */}
          <div className="flex items-start gap-3 p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
            <AlertTriangle className="h-5 w-5 text-yellow-600 mt-0.5" />
            <div className="flex-1">
              <p className="text-sm font-medium text-yellow-800">
                Verificación de Pago
              </p>
              <p className="text-sm text-yellow-700 mt-1">
                Asegúrate de revisar cuidadosamente el comprobante antes de aprobar. 
                Esta acción cambiará el estado del pedido.
              </p>
            </div>
          </div>
        </div>

        <DialogFooter className="flex gap-2">
          <Button 
            variant="outline" 
            onClick={() => onOpenChange(false)}
            disabled={isProcessing}
          >
            Cancelar
          </Button>
          <Button 
            variant="destructive" 
            onClick={() => handleVerify(false)}
            disabled={isProcessing}
          >
            <X className="mr-2 h-4 w-4" />
            {isProcessing ? "Rechazando..." : "Rechazar"}
          </Button>
          <Button 
            onClick={() => handleVerify(true)}
            disabled={isProcessing}
          >
            <Check className="mr-2 h-4 w-4" />
            {isProcessing ? "Aprobando..." : "Aprobar Pago"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}