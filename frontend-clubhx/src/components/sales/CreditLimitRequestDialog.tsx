
import React, { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { CreditCard, AlertCircle } from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert";

interface CreditLimitRequestDialogProps {
  isOpen: boolean;
  onClose: () => void;
  customerName: string;
  currentLimit: number;
  customerId: string;
  onSubmit: (request: {
    customerId: string;
    currentLimit: number;
    requestedLimit: number;
    reason: string;
  }) => void;
}

export const CreditLimitRequestDialog: React.FC<CreditLimitRequestDialogProps> = ({
  isOpen,
  onClose,
  customerName,
  currentLimit,
  customerId,
  onSubmit,
}) => {
  const [requestedLimit, setRequestedLimit] = useState("");
  const [reason, setReason] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('es-CL', {
      style: 'currency',
      currency: 'CLP'
    }).format(amount);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    const requestedAmount = parseInt(requestedLimit.replace(/\D/g, ''));
    
    if (requestedAmount <= currentLimit) {
      toast({
        title: "Error",
        description: "El límite solicitado debe ser mayor al límite actual",
        variant: "destructive",
      });
      return;
    }

    if (!reason.trim()) {
      toast({
        title: "Error",
        description: "Debe proporcionar una justificación para el cambio",
        variant: "destructive",
      });
      return;
    }

    setIsSubmitting(true);
    
    try {
      await onSubmit({
        customerId,
        currentLimit,
        requestedLimit: requestedAmount,
        reason: reason.trim(),
      });

      toast({
        title: "Solicitud enviada",
        description: `La solicitud de cambio de límite para ${customerName} ha sido enviada para revisión.`,
      });

      // Reset form
      setRequestedLimit("");
      setReason("");
      onClose();
    } catch (error) {
      toast({
        title: "Error",
        description: "No se pudo enviar la solicitud. Intente nuevamente.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleLimitChange = (value: string) => {
    // Format as currency while typing
    const numericValue = value.replace(/\D/g, '');
    if (numericValue) {
      setRequestedLimit(numericValue);
    } else {
      setRequestedLimit("");
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <CreditCard className="h-5 w-5" />
            Solicitar Cambio de Límite de Crédito
          </DialogTitle>
        </DialogHeader>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label>Cliente</Label>
            <Input value={customerName} disabled />
          </div>

          <div className="space-y-2">
            <Label>Límite Actual</Label>
            <Input value={formatCurrency(currentLimit)} disabled />
          </div>

          <div className="space-y-2">
            <Label htmlFor="requestedLimit">Límite Solicitado *</Label>
            <Input
              id="requestedLimit"
              type="text"
              placeholder="Ingrese el nuevo límite"
              value={requestedLimit ? formatCurrency(parseInt(requestedLimit)) : ""}
              onChange={(e) => handleLimitChange(e.target.value)}
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="reason">Justificación *</Label>
            <Textarea
              id="reason"
              placeholder="Explique por qué es necesario este cambio de límite..."
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              rows={4}
              required
            />
          </div>

          <Alert>
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>
              Esta solicitud será enviada al administrador para su revisión y aprobación.
            </AlertDescription>
          </Alert>
        </form>

        <DialogFooter>
          <Button type="button" variant="outline" onClick={onClose}>
            Cancelar
          </Button>
          <Button 
            type="submit" 
            onClick={handleSubmit}
            disabled={isSubmitting}
          >
            {isSubmitting ? "Enviando..." : "Enviar Solicitud"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
