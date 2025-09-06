import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { DollarSign, Users, AlertTriangle, Clock } from "lucide-react";

interface CollectionsKPIHeaderProps {
  totalPendingAmount: number;
  clientsWithDebt: number;
  criticalClients: number;
  averageDaysOverdue: number;
}

function KPICard({ title, value, subtitle, icon, color, isAlert = false }: {
  title: string;
  value: string;
  subtitle?: string;
  icon: React.ReactNode;
  color?: string;
  isAlert?: boolean;
}) {
  return (
    <Card className="relative overflow-hidden">
      <CardContent className="p-6">
        <div className="flex items-center justify-between">
          <div className="space-y-1">
            <p className="text-sm font-medium text-muted-foreground">{title}</p>
            <p className={`text-2xl font-bold ${isAlert ? "text-red-600" : ""}`}>{value}</p>
            {subtitle && (
              <p className="text-xs text-muted-foreground">{subtitle}</p>
            )}
          </div>
          <div className={`p-3 rounded-full ${color || "bg-primary/10"}`}>
            {icon}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

export function CollectionsKPIHeader({ 
  totalPendingAmount, 
  clientsWithDebt, 
  criticalClients, 
  averageDaysOverdue 
}: CollectionsKPIHeaderProps) {
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('es-CL', {
      style: 'currency',
      currency: 'CLP',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
      <KPICard
        title="Total por Cobrar"
        value={formatCurrency(totalPendingAmount)}
        subtitle="Monto pendiente total"
        icon={<DollarSign className="h-6 w-6 text-red-600" />}
        color="bg-red-50"
        isAlert={true}
      />
      <KPICard
        title="Clientes con Deuda"
        value={clientsWithDebt.toString()}
        subtitle="Requieren seguimiento"
        icon={<Users className="h-6 w-6 text-orange-600" />}
        color="bg-orange-50"
      />
      <KPICard
        title="Casos Críticos"
        value={criticalClients.toString()}
        subtitle="Más de 30 días vencidos"
        icon={<AlertTriangle className="h-6 w-6 text-red-600" />}
        color="bg-red-50"
        isAlert={true}
      />
      <KPICard
        title="Promedio Días Vencidos"
        value={`${averageDaysOverdue} días`}
        subtitle="Tiempo promedio de atraso"
        icon={<Clock className="h-6 w-6 text-yellow-600" />}
        color="bg-yellow-50"
      />
    </div>
  );
}