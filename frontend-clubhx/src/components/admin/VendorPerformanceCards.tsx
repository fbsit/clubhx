
import React from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Users, TrendingUp, Target, Calendar } from "lucide-react";

interface VendorPerformanceCardsProps {
  vendor: {
    customers: number;
    totalSales: number;
    salesTarget: number;
    targetCompletion: number;
    performance: {
      conversionRate: number;
    };
  };
}

export default function VendorPerformanceCards({ vendor }: VendorPerformanceCardsProps) {
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('es-CL', {
      style: 'currency',
      currency: 'CLP'
    }).format(amount);
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-sm font-medium flex items-center gap-2">
            <Users className="h-4 w-4 text-blue-600" />
            Clientes
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{vendor.customers}</div>
          <p className="text-xs text-muted-foreground mt-1">Total asignados</p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-sm font-medium flex items-center gap-2">
            <TrendingUp className="h-4 w-4 text-green-600" />
            Ventas Totales
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{formatCurrency(vendor.totalSales)}</div>
          <p className="text-xs text-muted-foreground mt-1">Este año</p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-sm font-medium flex items-center gap-2">
            <Target className="h-4 w-4 text-purple-600" />
            Meta Anual
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{vendor.targetCompletion}%</div>
          <div className="w-full bg-muted rounded-full h-2 mt-2">
            <div 
              className="bg-purple-600 h-2 rounded-full transition-all duration-300" 
              style={{ width: `${vendor.targetCompletion}%` }}
            ></div>
          </div>
          <p className="text-xs text-muted-foreground mt-1">
            {formatCurrency(vendor.salesTarget)} objetivo
          </p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-sm font-medium flex items-center gap-2">
            <Calendar className="h-4 w-4 text-orange-600" />
            Conversión
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{vendor.performance.conversionRate}%</div>
          <p className="text-xs text-muted-foreground mt-1">Tasa de cierre</p>
        </CardContent>
      </Card>
    </div>
  );
}
