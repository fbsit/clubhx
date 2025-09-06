
import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { CreditLimitRequest } from "@/types/creditRequest";
import { Eye, Check, X, Clock } from "lucide-react";
import { useIsMobile } from "@/hooks/use-mobile";

interface CreditRequestCardProps {
  request: CreditLimitRequest;
  onViewDetails: (request: CreditLimitRequest) => void;
  onApprove: (request: CreditLimitRequest) => void;
  onReject: (request: CreditLimitRequest) => void;
}

export const CreditRequestCard: React.FC<CreditRequestCardProps> = ({
  request,
  onViewDetails,
  onApprove,
  onReject,
}) => {
  const isMobile = useIsMobile();
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
      month: 'short',
      day: 'numeric'
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

  const isPending = request.status === 'pending';
  const showRejectButton = isPending;

  return (
    <Card>
      <CardHeader className="pb-3">
        <div className="flex justify-between items-start">
          <div>
            <CardTitle className="text-lg">{request.customerName}</CardTitle>
            <p className="text-sm text-muted-foreground">Solicitud #{request.id}</p>
          </div>
          {getStatusBadge(request.status)}
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Mobile optimized layout */}
        {isMobile ? (
          <>
            {/* Customer info row */}
            <div className="flex justify-between items-center">
              <div>
                <p className="text-sm text-muted-foreground">Actual</p>
                <p className="font-semibold">{formatCurrency(request.currentLimit)}</p>
              </div>
              <div className="text-right">
                <p className="text-sm text-muted-foreground">Solicitado</p>
                <p className="font-semibold text-blue-600">{formatCurrency(request.requestedLimit)}</p>
              </div>
            </div>
            
            <div>
              <p className="text-xs text-muted-foreground">Solicitado por {request.requestedByName}</p>
              <p className="text-xs text-muted-foreground">{formatDate(request.requestDate)}</p>
            </div>
            
            <div>
              <p className="text-xs text-muted-foreground mb-1">Razón</p>
              <p className="text-sm line-clamp-2">{request.reason}</p>
            </div>
            
            {/* Mobile button layout - stacked */}
            <div className="flex flex-col gap-2 pt-2">
              {isPending && (
                <div className="flex gap-2">
                  <Button className="flex-1" size="sm" onClick={() => onApprove(request)}>
                    <Check className="h-4 w-4 mr-1" />
                    Aprobar
                  </Button>
                  <Button variant="destructive" className="flex-1" size="sm" onClick={() => onReject(request)}>
                    <X className="h-4 w-4 mr-1" />
                    Rechazar
                  </Button>
                </div>
              )}
              <Button 
                variant="outline" 
                size="sm" 
                className="w-full"
                onClick={() => onViewDetails(request)}
              >
                <Eye className="h-4 w-4 mr-1" />
                Ver Detalles
              </Button>
            </div>
          </>
        ) : (
          /* Desktop layout - unchanged */
          <>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-sm text-muted-foreground">Límite Actual</p>
                <p className="font-semibold">{formatCurrency(request.currentLimit)}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Límite Solicitado</p>
                <p className="font-semibold text-blue-600">{formatCurrency(request.requestedLimit)}</p>
              </div>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Solicitado por</p>
              <p className="text-sm">{request.requestedByName} - {formatDate(request.requestDate)}</p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Razón</p>
              <p className="text-sm line-clamp-2">{request.reason}</p>
            </div>
            <div className="flex gap-2 pt-2">
              {/* Use eye icon only when reject button is present */}
              <Button 
                variant="outline" 
                size={showRejectButton ? "icon" : "sm"}
                onClick={() => onViewDetails(request)}
              >
                <Eye className="h-4 w-4" />
                {!showRejectButton && <span className="ml-1">Ver Detalles</span>}
              </Button>
              {isPending && (
                <>
                  <Button size="sm" onClick={() => onApprove(request)}>
                    <Check className="h-4 w-4 mr-1" />
                    Aprobar
                  </Button>
                  <Button variant="destructive" size="sm" onClick={() => onReject(request)}>
                    <X className="h-4 w-4 mr-1" />
                    Rechazar
                  </Button>
                </>
              )}
            </div>
          </>
        )}
      </CardContent>
    </Card>
  );
};
