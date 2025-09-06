
import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Star } from "lucide-react";
import { useIsMobile } from "@/hooks/use-mobile";

interface CustomerStatsCardsProps {
  stats: {
    totalOrders: number;
    totalSpent: number;
    averageOrderValue: number;
    lastYearGrowth: number;
    outstandingBalance: number;
  };
  creditLimit: number;
  loyaltyPoints: number;
}

export const CustomerStatsCards: React.FC<CustomerStatsCardsProps> = ({
  stats,
  creditLimit,
  loyaltyPoints,
}) => {
  const isMobile = useIsMobile();

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('es-CL', {
      style: 'currency',
      currency: 'CLP'
    }).format(amount);
  };

  return (
    <div className={`grid gap-4 ${isMobile ? 'grid-cols-2' : 'md:grid-cols-4'} mb-6`}>
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className={`${isMobile ? 'text-xs' : 'text-sm'} font-medium`}>Total de Pedidos</CardTitle>
        </CardHeader>
        <CardContent>
          <div className={`${isMobile ? 'text-lg' : 'text-2xl'} font-bold`}>{stats.totalOrders}</div>
          <p className="text-xs text-muted-foreground">
            {stats.lastYearGrowth > 0 ? '+' : ''}{stats.lastYearGrowth}% vs año anterior
          </p>
        </CardContent>
      </Card>
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className={`${isMobile ? 'text-xs' : 'text-sm'} font-medium`}>Total de Ventas</CardTitle>
        </CardHeader>
        <CardContent>
          <div className={`${isMobile ? 'text-lg' : 'text-2xl'} font-bold`}>{formatCurrency(stats.totalSpent)}</div>
          <p className="text-xs text-muted-foreground">
            Promedio: {formatCurrency(stats.averageOrderValue)}
          </p>
        </CardContent>
      </Card>
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className={`${isMobile ? 'text-xs' : 'text-sm'} font-medium`}>Saldo Pendiente</CardTitle>
        </CardHeader>
        <CardContent>
          <div className={`${isMobile ? 'text-lg' : 'text-2xl'} font-bold`}>{formatCurrency(stats.outstandingBalance)}</div>
          <p className="text-xs text-muted-foreground">
            Límite: {formatCurrency(creditLimit)}
          </p>
        </CardContent>
      </Card>
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className={`${isMobile ? 'text-xs' : 'text-sm'} font-medium`}>Puntos de Lealtad</CardTitle>
        </CardHeader>
        <CardContent>
          <div className={`${isMobile ? 'text-lg' : 'text-2xl'} font-bold`}>{loyaltyPoints}</div>
          <div className="flex items-center mt-1">
            <Star className="h-3 w-3 text-amber-500 fill-amber-500 mr-1" />
            <Star className="h-3 w-3 text-amber-500 fill-amber-500 mr-1" />
            <Star className="h-3 w-3 text-amber-500 fill-amber-500 mr-1" />
            <Star className="h-3 w-3 text-amber-500 fill-amber-500 mr-1" />
            <Star className="h-3 w-3 text-gray-300" />
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
