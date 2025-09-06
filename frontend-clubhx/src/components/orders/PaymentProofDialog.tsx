import React, { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Upload, FileText, CheckCircle } from "lucide-react";
import { Order } from "@/types/order";
import { toast } from "sonner";

interface PaymentProofDialogProps {
  order: Order;
  onPaymentProofUploaded: (orderId: string, paymentProof: any) => void;
  children: React.ReactNode;
}

export default function PaymentProofDialog({ 
  order, 
  onPaymentProofUploaded, 
  children 
}: PaymentProofDialogProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [isUploading, setIsUploading] = useState(false);

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      // Validate file type (images and PDFs)
      const allowedTypes = ['image/jpeg', 'image/png', 'image/jpg', 'application/pdf'];
      if (!allowedTypes.includes(file.type)) {
        toast.error("Tipo de archivo no válido", {
          description: "Solo se permiten imágenes (JPG, PNG) y archivos PDF"
        });
        return;
      }
      
      // Validate file size (max 5MB)
      if (file.size > 5 * 1024 * 1024) {
        toast.error("Archivo muy grande", {
          description: "El archivo no puede superar los 5MB"
        });
        return;
      }
      
      setSelectedFile(file);
    }
  };

  const handleUpload = async () => {
    if (!selectedFile) return;
    
    setIsUploading(true);
    
    // Simulate upload delay
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    const paymentProof = {
      fileName: selectedFile.name,
      uploadDate: new Date().toISOString(),
      url: `#uploaded-${selectedFile.name}` // Mock URL
    };
    
    onPaymentProofUploaded(order.id, paymentProof);
    
    toast.success("Comprobante subido correctamente", {
      description: "Tu pago está siendo verificado por nuestro equipo"
    });
    
    setIsUploading(false);
    setIsOpen(false);
    setSelectedFile(null);
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('es-CL', {
      style: 'currency',
      currency: 'CLP'
    }).format(amount);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('es-CL', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric'
    });
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        {children}
      </DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Upload className="h-5 w-5" />
            Subir Comprobante de Pago
          </DialogTitle>
        </DialogHeader>
        
        <div className="space-y-6">
          {/* Order Summary */}
          <div className="bg-muted/30 p-4 rounded-lg space-y-2">
            <div className="flex justify-between items-center">
              <span className="text-sm text-muted-foreground">Pedido:</span>
              <span className="font-medium">{order.id}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm text-muted-foreground">Total:</span>
              <span className="font-semibold">{formatCurrency(order.total)}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm text-muted-foreground">Fecha entrega:</span>
              <span className="text-sm">{formatDate(order.date)}</span>
            </div>
          </div>

          {/* File Upload */}
          <div className="space-y-3">
            <Label htmlFor="payment-proof">Comprobante de Pago</Label>
            <div className="border-2 border-dashed border-muted-foreground/25 rounded-lg p-6 text-center">
              <Input
                id="payment-proof"
                type="file"
                accept=".jpg,.jpeg,.png,.pdf"
                onChange={handleFileSelect}
                className="hidden"
              />
              <Label 
                htmlFor="payment-proof" 
                className="cursor-pointer flex flex-col items-center gap-2"
              >
                {selectedFile ? (
                  <>
                    <FileText className="h-8 w-8 text-green-600" />
                    <span className="text-sm font-medium">{selectedFile.name}</span>
                    <span className="text-xs text-muted-foreground">
                      {(selectedFile.size / (1024 * 1024)).toFixed(1)} MB
                    </span>
                  </>
                ) : (
                  <>
                    <Upload className="h-8 w-8 text-muted-foreground" />
                    <span className="text-sm font-medium">Seleccionar archivo</span>
                    <span className="text-xs text-muted-foreground">
                      JPG, PNG o PDF (máx. 5MB)
                    </span>
                  </>
                )}
              </Label>
            </div>
          </div>

          {/* Actions */}
          <div className="flex gap-2">
            <Button 
              variant="outline" 
              onClick={() => setIsOpen(false)}
              className="flex-1"
            >
              Cancelar
            </Button>
            <Button 
              onClick={handleUpload}
              disabled={!selectedFile || isUploading}
              className="flex-1"
            >
              {isUploading ? (
                "Subiendo..."
              ) : (
                <>
                  <CheckCircle className="h-4 w-4 mr-2" />
                  Confirmar Pago
                </>
              )}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}