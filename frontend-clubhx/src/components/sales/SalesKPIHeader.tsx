import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { TrendingUp, Users, Target, UserPlus } from "lucide-react";

interface KPICardProps {
  title: string;
  value: string;
  subtitle?: string;
  icon: React.ReactNode;
  trend?: number;
  color?: string;
}

function KPICard({ title, value, subtitle, icon, trend, color }: KPICardProps) {
  return (
    <Card className="relative overflow-hidden">
      <CardContent className="p-6">
        <div className="flex items-center justify-between">
          <div className="space-y-1">
            <p className="text-sm font-medium text-muted-foreground">{title}</p>
            <p className="text-2xl font-bold">{value}</p>
            {subtitle && (
              <p className="text-xs text-muted-foreground">{subtitle}</p>
            )}
          </div>
          <div className={`p-3 rounded-full ${color || "bg-primary/10"}`}>
            {icon}
          </div>
        </div>
        {trend !== undefined && (
          <div className="mt-4 flex items-center gap-1">
            <TrendingUp className={`h-4 w-4 ${trend >= 0 ? "text-green-600" : "text-red-600"}`} />
            <span className={`text-sm font-medium ${trend >= 0 ? "text-green-600" : "text-red-600"}`}>
              {trend >= 0 ? "+" : ""}{trend}%
            </span>
            <span className="text-xs text-muted-foreground ml-1">vs mes anterior</span>
          </div>
        )}
      </CardContent>
    </Card>
  );
}

interface SalesKPIHeaderProps {
  monthlyGoal: number;
  currentSales: number;
  activeClients: number;
  prospects: number;
}

export function SalesKPIHeader({ monthlyGoal, currentSales, activeClients, prospects }: SalesKPIHeaderProps) {
  const goalPercentage = Math.round((currentSales / monthlyGoal) * 100);
  const salesTrend = 8.5; // Mock trend data

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
        title="Meta Mensual"
        value={`${goalPercentage}%`}
        subtitle={`${formatCurrency(currentSales)} / ${formatCurrency(monthlyGoal)}`}
        icon={<Target className="h-6 w-6 text-primary" />}
        trend={salesTrend}
        color="bg-blue-50"
      />
      <KPICard
        title="Clientes Activos"
        value={activeClients.toString()}
        subtitle="Compraron en últimos 60 días"
        icon={<Users className="h-6 w-6 text-green-600" />}
        color="bg-green-50"
      />
      <KPICard
        title="Prospectos"
        value={prospects.toString()}
        subtitle="Clientes potenciales"
        icon={<UserPlus className="h-6 w-6 text-orange-600" />}
        color="bg-orange-50"
      />
      <KPICard
        title="Ventas del Mes"
        value={formatCurrency(currentSales)}
        subtitle="Facturación acumulada"
        icon={<TrendingUp className="h-6 w-6 text-purple-600" />}
        trend={salesTrend}
        color="bg-purple-50"
      />
    </div>
  );
}