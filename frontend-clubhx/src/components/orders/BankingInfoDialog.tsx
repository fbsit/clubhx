import React from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Copy, Building2, CreditCard, Hash } from "lucide-react";
import { toast } from "sonner";

interface BankingInfoDialogProps {
  children: React.ReactNode;
  orderTotal: number;
  orderId: string;
}

export default function BankingInfoDialog({ 
  children, 
  orderTotal,
  orderId 
}: BankingInfoDialogProps) {
  const bankingInfo = {
    bankName: "Banco de Chile",
    accountType: "Cuenta Corriente",
    accountNumber: "12345678-9",
    rut: "76.123.456-7",
    accountHolder: "CLUB HX LTDA",
    email: "pagos@clubhx.com"
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('es-CL', {
      style: 'currency',
      currency: 'CLP'
    }).format(amount);
  };

  const copyToClipboard = (text: string, label: string) => {
    navigator.clipboard.writeText(text).then(() => {
      toast.success(`${label} copiado al portapapeles`);
    });
  };

  return (
    <Dialog>
      <DialogTrigger asChild>
        {children}
      </DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Building2 className="h-5 w-5" />
            Datos para Transferencia
          </DialogTitle>
        </DialogHeader>
        
        <div className="space-y-4">
          {/* Order Info */}
          <Card className="bg-muted/30">
            <CardContent className="p-4 space-y-2">
              <div className="flex justify-between items-center">
                <span className="text-sm text-muted-foreground">Pedido:</span>
                <span className="font-medium">{orderId}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-muted-foreground">Monto a pagar:</span>
                <span className="font-bold text-lg">{formatCurrency(orderTotal)}</span>
              </div>
            </CardContent>
          </Card>

          {/* Banking Details */}
          <div className="space-y-3">
            <h4 className="font-medium flex items-center gap-2">
              <CreditCard className="h-4 w-4" />
              Información Bancaria
            </h4>
            
            <div className="space-y-3">
              <div className="flex justify-between items-center p-3 bg-muted/20 rounded-lg">
                <div>
                  <p className="text-sm text-muted-foreground">Banco</p>
                  <p className="font-medium">{bankingInfo.bankName}</p>
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => copyToClipboard(bankingInfo.bankName, "Nombre del banco")}
                >
                  <Copy className="h-4 w-4" />
                </Button>
              </div>

              <div className="flex justify-between items-center p-3 bg-muted/20 rounded-lg">
                <div>
                  <p className="text-sm text-muted-foreground">Tipo de cuenta</p>
                  <p className="font-medium">{bankingInfo.accountType}</p>
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => copyToClipboard(bankingInfo.accountType, "Tipo de cuenta")}
                >
                  <Copy className="h-4 w-4" />
                </Button>
              </div>

              <div className="flex justify-between items-center p-3 bg-muted/20 rounded-lg">
                <div>
                  <p className="text-sm text-muted-foreground">Número de cuenta</p>
                  <p className="font-medium font-mono">{bankingInfo.accountNumber}</p>
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => copyToClipboard(bankingInfo.accountNumber, "Número de cuenta")}
                >
                  <Copy className="h-4 w-4" />
                </Button>
              </div>

              <div className="flex justify-between items-center p-3 bg-muted/20 rounded-lg">
                <div>
                  <p className="text-sm text-muted-foreground">RUT</p>
                  <p className="font-medium font-mono">{bankingInfo.rut}</p>
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => copyToClipboard(bankingInfo.rut, "RUT")}
                >
                  <Copy className="h-4 w-4" />
                </Button>
              </div>

              <div className="flex justify-between items-center p-3 bg-muted/20 rounded-lg">
                <div>
                  <p className="text-sm text-muted-foreground">Titular</p>
                  <p className="font-medium">{bankingInfo.accountHolder}</p>
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => copyToClipboard(bankingInfo.accountHolder, "Titular")}
                >
                  <Copy className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </div>

          {/* Instructions */}
          <Card className="bg-blue-50/50 border-blue-200">
            <CardContent className="p-4">
              <h4 className="font-medium text-blue-800 mb-2">Instrucciones:</h4>
              <ul className="text-sm text-blue-700 space-y-1">
                <li>• Realiza la transferencia por el monto exacto</li>
                <li>• Incluye el número de pedido ({orderId}) en la glosa</li>
                <li>• Envía el comprobante usando el botón "Subir Pago"</li>
                <li>• Para consultas: {bankingInfo.email}</li>
              </ul>
            </CardContent>
          </Card>
        </div>
      </DialogContent>
    </Dialog>
  );
}