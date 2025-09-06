
import React, { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { CreditLimitRequest } from "@/types/creditRequest";
import { Check, X, Clock, User, Calendar, CreditCard } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface CreditRequestDetailDialogProps {
  request: CreditLimitRequest | null;
  isOpen: boolean;
  onClose: () => void;
  onApprove: (request: CreditLimitRequest, notes?: string) => void;
  onReject: (request: CreditLimitRequest, notes?: string) => void;
}

export const CreditRequestDetailDialog: React.FC<CreditRequestDetailDialogProps> = ({
  request,
  isOpen,
  onClose,
  onApprove,
  onReject,
}) => {
  const [reviewNotes, setReviewNotes] = useState("");
  const { toast } = useToast();

  if (!request) return null;

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('es-CL', {
      style: 'currency',
      currency: 'CLP'
    }).format(amount);
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat('es-CL', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    }).format(date);
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'pending':
        return <Badge className="bg-amber-500"><Clock className="h-3 w-3 mr-1" />Pendiente</Badge>;
      case 'approved':
        return <Badge className="bg-green-500"><Check className="h-3 w-3 mr-1" />Aprobada</Badge>;
      case 'rejected':
        return <Badge className="bg-red-500"><X className="h-3 w-3 mr-1" />Rechazada</Badge>;
      default:
        return <Badge>Desconocido</Badge>;
    }
  };

  const handleApprove = () => {
    onApprove(request, reviewNotes);
    setReviewNotes("");
    onClose();
    toast({
      title: "Solicitud Aprobada",
      description: `La solicitud de ${request.customerName} ha sido aprobada.`,
    });
  };

  const handleReject = () => {
    if (!reviewNotes.trim()) {
      toast({
        title: "Notas requeridas",
        description: "Debe proporcionar una razón para rechazar la solicitud.",
        variant: "destructive",
      });
      return;
    }
    onReject(request, reviewNotes);
    setReviewNotes("");
    onClose();
    toast({
      title: "Solicitud Rechazada",
      description: `La solicitud de ${request.customerName} ha sido rechazada.`,
    });
  };

  const increaseAmount = request.requestedLimit - request.currentLimit;
  const increasePercentage = ((increaseAmount / request.currentLimit) * 100).toFixed(1);

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <div className="flex items-center justify-between">
            <DialogTitle>Solicitud de Límite de Crédito</DialogTitle>
            {getStatusBadge(request.status)}
          </div>
        </DialogHeader>
        
        <div className="space-y-6">
          {/* Customer Information */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label className="text-sm font-medium text-muted-foreground">Cliente</Label>
              <div className="flex items-center gap-2">
                <User className="h-4 w-4 text-muted-foreground" />
                <span className="font-medium">{request.customerName}</span>
              </div>
            </div>
            <div className="space-y-2">
              <Label className="text-sm font-medium text-muted-foreground">ID Cliente</Label>
              <span className="text-sm">{request.customerId}</span>
            </div>
          </div>

          {/* Credit Information */}
          <div className="bg-muted/50 p-4 rounded-lg">
            <h4 className="font-medium mb-3 flex items-center gap-2">
              <CreditCard className="h-4 w-4" />
              Información de Crédito
            </h4>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <Label className="text-sm text-muted-foreground">Límite Actual</Label>
                <p className="text-lg font-semibold">{formatCurrency(request.currentLimit)}</p>
              </div>
              <div>
                <Label className="text-sm text-muted-foreground">Límite Solicitado</Label>
                <p className="text-lg font-semibold text-blue-600">{formatCurrency(request.requestedLimit)}</p>
              </div>
              <div>
                <Label className="text-sm text-muted-foreground">Aumento</Label>
                <p className="text-lg font-semibold text-green-600">
                  +{formatCurrency(increaseAmount)} ({increasePercentage}%)
                </p>
              </div>
            </div>
          </div>

          {/* Request Information */}
          <div className="space-y-4">
            <div>
              <Label className="text-sm font-medium text-muted-foreground">Solicitado por</Label>
              <p className="mt-1">{request.requestedByName}</p>
            </div>
            <div>
              <Label className="text-sm font-medium text-muted-foreground">Fecha de Solicitud</Label>
              <div className="flex items-center gap-2 mt-1">
                <Calendar className="h-4 w-4 text-muted-foreground" />
                <span>{formatDate(request.requestDate)}</span>
              </div>
            </div>
            <div>
              <Label className="text-sm font-medium text-muted-foreground">Razón de la Solicitud</Label>
              <div className="mt-1 p-3 bg-muted/30 rounded-md">
                <p className="text-sm">{request.reason}</p>
              </div>
            </div>
          </div>

          {/* Review Information (if reviewed) */}
          {request.status !== 'pending' && request.reviewedBy && (
            <div className="border-t pt-4 space-y-3">
              <h4 className="font-medium">Información de Revisión</h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label className="text-sm text-muted-foreground">Revisado por</Label>
                  <p className="mt-1">{request.reviewedByName}</p>
                </div>
                <div>
                  <Label className="text-sm text-muted-foreground">Fecha de Revisión</Label>
                  <p className="mt-1">{request.reviewDate ? formatDate(request.reviewDate) : 'N/A'}</p>
                </div>
              </div>
              {request.reviewNotes && (
                <div>
                  <Label className="text-sm text-muted-foreground">Notas de Revisión</Label>
                  <div className="mt-1 p-3 bg-muted/30 rounded-md">
                    <p className="text-sm">{request.reviewNotes}</p>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Review Notes Input (for pending requests) */}
          {request.status === 'pending' && (
            <div className="space-y-2">
              <Label htmlFor="reviewNotes">Notas de Revisión</Label>
              <Textarea
                id="reviewNotes"
                placeholder="Agregue notas sobre su decisión..."
                value={reviewNotes}
                onChange={(e) => setReviewNotes(e.target.value)}
                rows={3}
              />
            </div>
          )}
        </div>

        {/* Actions */}
        <div className="flex justify-end gap-2 pt-4 border-t">
          <Button variant="outline" onClick={onClose}>
            Cerrar
          </Button>
          {request.status === 'pending' && (
            <>
              <Button variant="destructive" onClick={handleReject}>
                <X className="h-4 w-4 mr-1" />
                Rechazar
              </Button>
              <Button onClick={handleApprove}>
                <Check className="h-4 w-4 mr-1" />
                Aprobar
              </Button>
            </>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};
