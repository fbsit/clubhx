
import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Star } from "lucide-react";

interface CustomerStats {
  totalOrders: number;
  totalSpent: number;
  averageOrderValue: number;
  lastYearGrowth: number;
}

interface CustomerStatsCardsProps {
  stats: CustomerStats;
  loyaltyPoints: number;
}

export const CustomerStatsCards: React.FC<CustomerStatsCardsProps> = ({
  stats,
  loyaltyPoints,
}) => {
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('es-CL', {
      style: 'currency',
      currency: 'CLP'
    }).format(amount);
  };

  return (
    <div className="grid gap-6 md:grid-cols-3 mb-6">
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-medium">Total de Pedidos</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{stats.totalOrders}</div>
          <p className="text-xs text-muted-foreground">
            {stats.lastYearGrowth > 0 ? '+' : ''}{stats.lastYearGrowth}% respecto al año anterior
          </p>
        </CardContent>
      </Card>
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-medium">Total de Ventas</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{formatCurrency(stats.totalSpent)}</div>
          <p className="text-xs text-muted-foreground">
            Promedio de {formatCurrency(stats.averageOrderValue)} por pedido
          </p>
        </CardContent>
      </Card>
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-medium">Puntos de Lealtad</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{loyaltyPoints}</div>
          <div className="flex items-center mt-1">
            <Star className="h-3 w-3 text-amber-500 fill-amber-500 mr-1" />
            <Star className="h-3 w-3 text-amber-500 fill-amber-500 mr-1" />
            <Star className="h-3 w-3 text-amber-500 fill-amber-500 mr-1" />
            <Star className="h-3 w-3 text-amber-500 fill-amber-500 mr-1" />
            <Star className="h-3 w-3 text-gray-300" />
            <span className="text-xs text-muted-foreground ml-1">Nivel Profesional</span>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
