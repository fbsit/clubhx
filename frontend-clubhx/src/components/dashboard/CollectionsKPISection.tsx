import React from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { DollarSign, Users, AlertTriangle, Clock, TrendingDown } from "lucide-react";

const collectionsData = {
  totalPending: 2850000,
  clientsWithDebt: 8,
  criticalClients: 3,
  averageDaysOverdue: 18,
  monthlyTrend: -12 // Mejora del 12% vs mes anterior
};

const criticalClients = [
  { name: "Salon Express", amount: 450000, daysOverdue: 45, status: "critical" },
  { name: "Beauty Zone", amount: 320000, daysOverdue: 38, status: "critical" },
  { name: "Hair Design", amount: 285000, daysOverdue: 32, status: "overdue" },
];

export function CollectionsKPISection() {
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('es-CL', {
      style: 'currency',
      currency: 'CLP',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
  };

  return (
    <div className="space-y-4 sm:space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <div className="min-w-0 flex-1">
          <h2 className="text-lg sm:text-xl font-semibold">Gestión de Cobranzas</h2>
          <p className="text-xs sm:text-sm text-muted-foreground">Seguimiento de pagos pendientes</p>
        </div>
        <Badge variant="secondary" className="bg-orange-100 text-orange-800 w-fit">
          {collectionsData.clientsWithDebt} clientes pendientes
        </Badge>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-3 sm:gap-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-xs sm:text-sm font-medium text-muted-foreground flex items-center gap-2">
              <DollarSign className="h-3 w-3 sm:h-4 sm:w-4 text-red-600" />
              <span className="truncate">Total por Cobrar</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="pb-3">
            <p className="text-lg sm:text-2xl font-bold text-red-600 truncate">{formatCurrency(collectionsData.totalPending)}</p>
            <p className="text-xs text-green-600 flex items-center gap-1 mt-1">
              <TrendingDown className="h-3 w-3" />
              -{Math.abs(collectionsData.monthlyTrend)}% vs mes anterior
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-xs sm:text-sm font-medium text-muted-foreground flex items-center gap-2">
              <Users className="h-3 w-3 sm:h-4 sm:w-4 text-orange-600" />
              <span className="truncate">Clientes con Deuda</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="pb-3">
            <p className="text-lg sm:text-2xl font-bold text-orange-600">{collectionsData.clientsWithDebt}</p>
            <p className="text-xs text-muted-foreground mt-1">Requieren seguimiento</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-xs sm:text-sm font-medium text-muted-foreground flex items-center gap-2">
              <AlertTriangle className="h-3 w-3 sm:h-4 sm:w-4 text-red-600" />
              <span className="truncate">Casos Críticos</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="pb-3">
            <p className="text-lg sm:text-2xl font-bold text-red-600">{collectionsData.criticalClients}</p>
            <p className="text-xs text-muted-foreground mt-1">Más de 30 días vencidos</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-xs sm:text-sm font-medium text-muted-foreground flex items-center gap-2">
              <Clock className="h-3 w-3 sm:h-4 sm:w-4 text-yellow-600" />
              <span className="truncate">Promedio Días Vencidos</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="pb-3">
            <p className="text-lg sm:text-2xl font-bold text-yellow-600">{collectionsData.averageDaysOverdue} días</p>
            <p className="text-xs text-muted-foreground mt-1">Tiempo promedio de atraso</p>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-base sm:text-lg">Clientes Prioritarios para Cobranza</CardTitle>
          <CardDescription className="text-xs sm:text-sm">Casos que requieren atención inmediata</CardDescription>
        </CardHeader>
        <CardContent className="p-3 sm:p-6">
          <div className="space-y-3">
            {criticalClients.map((client, index) => (
              <div key={index} className="flex items-center justify-between p-3 bg-muted/30 rounded-lg">
                <div className="flex items-center gap-3 min-w-0 flex-1">
                  <div className={`w-2 h-2 sm:w-3 sm:h-3 rounded-full flex-shrink-0 ${
                    client.status === 'critical' ? 'bg-red-500' : 'bg-orange-500'
                  }`} />
                  <div className="min-w-0 flex-1">
                    <p className="font-medium text-xs sm:text-sm truncate">{client.name}</p>
                    <p className="text-xs text-muted-foreground">{client.daysOverdue} días de atraso</p>
                  </div>
                </div>
                <div className="text-right flex-shrink-0 ml-3">
                  <p className="font-bold text-xs sm:text-sm">{formatCurrency(client.amount)}</p>
                  <Badge 
                    variant="secondary" 
                    className={`text-xs ${
                      client.status === 'critical' 
                        ? 'bg-red-100 text-red-800' 
                        : 'bg-orange-100 text-orange-800'
                    }`}
                  >
                    {client.status === 'critical' ? 'Crítico' : 'Vencido'}
                  </Badge>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}