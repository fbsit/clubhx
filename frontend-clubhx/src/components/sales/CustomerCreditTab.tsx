
import React from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { CreditCard, TrendingUp, Clock, CheckCircle, XCircle } from "lucide-react";
import { CreditLimitRequest, CreditLimitHistory } from "@/types/creditRequest";

interface CustomerCreditTabProps {
  currentLimit: number;
  outstandingBalance: number;
  creditHistory: CreditLimitHistory[];
  pendingRequests: CreditLimitRequest[];
}

export const CustomerCreditTab: React.FC<CustomerCreditTabProps> = ({
  currentLimit,
  outstandingBalance,
  creditHistory,
  pendingRequests,
}) => {
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

  const availableCredit = currentLimit - outstandingBalance;
  const creditUsagePercentage = (outstandingBalance / currentLimit) * 100;

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "approved": return <CheckCircle className="h-4 w-4 text-green-600" />;
      case "rejected": return <XCircle className="h-4 w-4 text-red-600" />;
      case "pending": return <Clock className="h-4 w-4 text-amber-600" />;
      default: return <Clock className="h-4 w-4" />;
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "approved": return <Badge className="bg-green-600">Aprobado</Badge>;
      case "rejected": return <Badge className="bg-red-600">Rechazado</Badge>;
      case "pending": return <Badge className="bg-amber-600">Pendiente</Badge>;
      default: return <Badge>{status}</Badge>;
    }
  };

  return (
    <div className="space-y-6">
      {/* Credit Overview */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <CreditCard className="h-5 w-5" />
            Estado del Crédito
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-3">
            <div>
              <p className="text-sm text-muted-foreground">Límite de Crédito</p>
              <p className="text-2xl font-bold">{formatCurrency(currentLimit)}</p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Saldo Pendiente</p>
              <p className="text-2xl font-bold">{formatCurrency(outstandingBalance)}</p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Crédito Disponible</p>
              <p className="text-2xl font-bold text-green-600">{formatCurrency(availableCredit)}</p>
            </div>
          </div>
          
          <div className="mt-4">
            <div className="flex justify-between items-center mb-2">
              <span className="text-sm text-muted-foreground">Uso del Crédito</span>
              <span className="text-sm font-medium">{creditUsagePercentage.toFixed(1)}%</span>
            </div>
            <Progress value={creditUsagePercentage} className="h-2" />
          </div>
        </CardContent>
      </Card>

      {/* Pending Requests */}
      {pendingRequests.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Solicitudes Pendientes</CardTitle>
            <CardDescription>
              Solicitudes de cambio de límite en revisión
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {pendingRequests.map((request) => (
                <div key={request.id} className="flex items-center justify-between p-3 border rounded-lg">
                  <div className="flex items-center gap-3">
                    {getStatusIcon(request.status)}
                    <div>
                      <p className="font-medium">
                        Solicitud de {formatCurrency(request.requestedLimit)}
                      </p>
                      <p className="text-sm text-muted-foreground">
                        Solicitado el {formatDate(request.requestDate)}
                      </p>
                    </div>
                  </div>
                  {getStatusBadge(request.status)}
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Credit History */}
      <Card>
        <CardHeader>
          <CardTitle>Historial de Límite de Crédito</CardTitle>
          <CardDescription>
            Cambios realizados en el límite de crédito
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {creditHistory.map((entry) => (
              <div key={entry.id} className="flex items-start gap-4 border-b pb-4 last:border-0 last:pb-0">
                <div className="mt-1">
                  <div className="bg-primary/10 rounded-full p-2">
                    <TrendingUp className="h-4 w-4 text-primary" />
                  </div>
                </div>
                <div className="flex-1">
                  <div className="flex items-center justify-between">
                    <p className="font-medium">
                      Límite cambiado de {formatCurrency(entry.previousLimit)} a {formatCurrency(entry.newLimit)}
                    </p>
                    <span className="text-sm text-muted-foreground">{formatDate(entry.changeDate)}</span>
                  </div>
                  <p className="text-sm text-muted-foreground">
                    Por: {entry.changedByName} • {entry.method === 'direct' ? 'Cambio directo' : 'Solicitud aprobada'}
                  </p>
                  {entry.notes && (
                    <p className="text-sm text-muted-foreground mt-1">
                      Notas: {entry.notes}
                    </p>
                  )}
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
