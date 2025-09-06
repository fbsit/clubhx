
import React, { useState } from "react";
import { Order } from "@/types/order";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { TrendingUp, Target, Calendar, DollarSign, ShoppingCart } from "lucide-react";
import { DateRangeSelector } from "./DateRangeSelector";

interface SalesOrdersKPIHeaderProps {
  orders: Order[];
  onDateRangeChange?: (range: { from: Date | undefined; to: Date | undefined }) => void;
}

export const SalesOrdersKPIHeader: React.FC<SalesOrdersKPIHeaderProps> = ({ 
  orders, 
  onDateRangeChange 
}) => {
  const [dateRange, setDateRange] = useState<{ from: Date | undefined; to: Date | undefined }>({
    from: undefined,
    to: undefined,
  });

  const handleDateRangeChange = (range: { from: Date | undefined; to: Date | undefined }) => {
    setDateRange(range);
    onDateRangeChange?.(range);
  };

  // Calculate today's performance
  const today = new Date().toISOString().split('T')[0];
  const todayOrders = orders.filter(order => order.date === today);
  const todayValue = todayOrders.reduce((sum, order) => sum + order.total, 0);
  const dailyGoal = 500000; // CLP
  const dailyProgressPercent = Math.min((todayValue / dailyGoal) * 100, 100);

  // Calculate monthly performance
  const currentMonth = new Date().getMonth();
  const currentYear = new Date().getFullYear();
  const monthlyOrders = orders.filter(order => {
    const orderDate = new Date(order.date);
    return orderDate.getMonth() === currentMonth && orderDate.getFullYear() === currentYear;
  });
  const monthlyValue = monthlyOrders.reduce((sum, order) => sum + order.total, 0);
  const monthlyGoal = 12000000; // CLP
  const monthlyProgressPercent = Math.min((monthlyValue / monthlyGoal) * 100, 100);

  // Calculate total metrics for the period
  const totalValue = orders.reduce((sum, order) => sum + order.total, 0);
  const totalQuantity = orders.length;
  const avgOrderValue = totalQuantity > 0 ? totalValue / totalQuantity : 0;
  
  // Status counters con todos los estados (ordenados por importancia)
  const statusCounts = {
    quotation: orders.filter(o => o.status === "quotation").length,
    requested: orders.filter(o => o.status === "requested").length,
    accepted: orders.filter(o => o.status === "accepted").length,
    paid: orders.filter(o => o.status === "paid").length,
    payment_pending: orders.filter(o => o.status === "payment_pending").length,
    invoiced: orders.filter(o => o.status === "invoiced").length,
    processing: orders.filter(o => o.status === "processing").length, // Cobranza
    shipped: orders.filter(o => o.status === "shipped").length,
    delivered: orders.filter(o => o.status === "delivered").length,
    completed: orders.filter(o => o.status === "completed").length,
    rejected: orders.filter(o => o.status === "rejected").length,
    canceled: orders.filter(o => o.status === "canceled").length,
  };

  return (
    <div className="space-y-4">
      {/* Filtro de fechas */}
      <div className="flex items-center gap-4">
        <div className="flex items-center gap-2">
          <Calendar className="h-4 w-4 text-muted-foreground" />
          <span className="text-sm font-medium">Período:</span>
        </div>
        <DateRangeSelector
          dateRange={dateRange}
          onDateRangeChange={handleDateRangeChange}
        />
      </div>

      {/* Performance Cards Grid */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {/* Performance del Día */}
        <Card className="bg-gradient-to-r from-blue-50 to-blue-100 border-blue-200">
          <CardContent className="p-4">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                <Target className="h-5 w-5 text-blue-600" />
                <h3 className="font-semibold text-blue-900">Performance Hoy</h3>
              </div>
              <div className="text-right">
                <p className="text-xl font-bold text-blue-800">
                  ${todayValue.toLocaleString('es-CL')}
                </p>
                <p className="text-xs text-blue-600">
                  Meta: ${dailyGoal.toLocaleString('es-CL')}
                </p>
              </div>
            </div>
            
            {/* Progress bar */}
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-blue-700">Progreso</span>
                <span className="font-medium text-blue-800">{dailyProgressPercent.toFixed(1)}%</span>
              </div>
              <div className="w-full bg-blue-200 rounded-full h-2">
                <div 
                  className="bg-blue-600 h-2 rounded-full transition-all duration-300" 
                  style={{ width: `${dailyProgressPercent}%` }}
                />
              </div>
              <div className="flex justify-between text-xs text-blue-600">
                <span>{todayOrders.length} pedidos hoy</span>
                <span className="flex items-center gap-1">
                  <TrendingUp className="h-3 w-3" />
                  {dailyProgressPercent >= 80 ? "Excelente" : dailyProgressPercent >= 50 ? "En progreso" : "Impulsar"}
                </span>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Performance del Mes */}
        <Card className="bg-gradient-to-r from-green-50 to-green-100 border-green-200">
          <CardContent className="p-4">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                <Calendar className="h-5 w-5 text-green-600" />
                <h3 className="font-semibold text-green-900">Performance Mensual</h3>
              </div>
              <div className="text-right">
                <p className="text-xl font-bold text-green-800">
                  ${monthlyValue.toLocaleString('es-CL')}
                </p>
                <p className="text-xs text-green-600">
                  Meta: ${monthlyGoal.toLocaleString('es-CL')}
                </p>
              </div>
            </div>
            
            {/* Progress bar */}
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-green-700">Progreso</span>
                <span className="font-medium text-green-800">{monthlyProgressPercent.toFixed(1)}%</span>
              </div>
              <div className="w-full bg-green-200 rounded-full h-2">
                <div 
                  className="bg-green-600 h-2 rounded-full transition-all duration-300" 
                  style={{ width: `${monthlyProgressPercent}%` }}
                />
              </div>
              <div className="flex justify-between text-xs text-green-600">
                <span>{monthlyOrders.length} pedidos este mes</span>
                <span className="flex items-center gap-1">
                  <TrendingUp className="h-3 w-3" />
                  {monthlyProgressPercent >= 80 ? "Excelente" : monthlyProgressPercent >= 50 ? "En progreso" : "Impulsar"}
                </span>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Totales del Período */}
        <Card className="bg-gradient-to-r from-purple-50 to-purple-100 border-purple-200">
          <CardContent className="p-4">
            <div className="flex items-center gap-2 mb-3">
              <DollarSign className="h-5 w-5 text-purple-600" />
              <h3 className="font-semibold text-purple-900">Totales del Período</h3>
            </div>
            
            <div className="space-y-2">
              <div className="flex justify-between items-center">
                <span className="text-sm text-purple-700">Valor Total</span>
                <span className="text-lg font-bold text-purple-800">
                  ${totalValue.toLocaleString('es-CL')}
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-purple-700">Cantidad de Pedidos</span>
                <span className="text-lg font-bold text-purple-800">{totalQuantity}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-purple-700">Valor Promedio</span>
                <span className="text-sm font-medium text-purple-800">
                  ${avgOrderValue.toLocaleString('es-CL')}
                </span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Status Badges - Layout adaptativo para móvil */}
      <div className="flex flex-wrap gap-2 sm:gap-3 lg:hidden">
        {/* Vista móvil - Layout compacto 2x6 */}
        <div className="grid grid-cols-2 gap-2 w-full">
          <Badge variant="outline" className="flex flex-col items-center p-2 bg-gray-50 border-gray-200 text-gray-700 text-center">
            <span className="text-lg">✏️</span>
            <span className="text-xs font-medium truncate">Cotización</span>
            <span className="text-sm font-bold">{statusCounts.quotation}</span>
          </Badge>
          <Badge variant="outline" className="flex flex-col items-center p-2 bg-orange-50 border-orange-200 text-orange-800 text-center">
            <span className="text-lg">💬</span>
            <span className="text-xs font-medium truncate">Solicitado</span>
            <span className="text-sm font-bold">{statusCounts.requested}</span>
          </Badge>
          <Badge variant="outline" className="flex flex-col items-center p-2 bg-purple-50 border-purple-200 text-purple-800 text-center">
            <span className="text-lg">👍</span>
            <span className="text-xs font-medium truncate">Aceptado</span>
            <span className="text-sm font-bold">{statusCounts.accepted}</span>
          </Badge>
          <Badge variant="outline" className="flex flex-col items-center p-2 bg-green-50 border-green-200 text-green-800 text-center">
            <span className="text-lg">💳</span>
            <span className="text-xs font-medium truncate">Pagado</span>
            <span className="text-sm font-bold">{statusCounts.paid}</span>
          </Badge>
          <Badge variant="outline" className="flex flex-col items-center p-2 bg-yellow-50 border-yellow-200 text-yellow-800 text-center">
            <span className="text-lg">⏳</span>
            <span className="text-xs font-medium truncate">Pendiente</span>
            <span className="text-sm font-bold">{statusCounts.payment_pending}</span>
          </Badge>
          <Badge variant="outline" className="flex flex-col items-center p-2 bg-blue-50 border-blue-200 text-blue-800 text-center">
            <span className="text-lg">🧾</span>
            <span className="text-xs font-medium truncate">Facturado</span>
            <span className="text-sm font-bold">{statusCounts.invoiced}</span>
          </Badge>
          <Badge variant="outline" className="flex flex-col items-center p-2 bg-red-50 border-red-200 text-red-800 text-center">
            <span className="text-lg">💰</span>
            <span className="text-xs font-medium truncate">Cobranza</span>
            <span className="text-sm font-bold">{statusCounts.processing}</span>
          </Badge>
          <Badge variant="outline" className="flex flex-col items-center p-2 bg-indigo-50 border-indigo-200 text-indigo-800 text-center">
            <span className="text-lg">🚚</span>
            <span className="text-xs font-medium truncate">Enviado</span>
            <span className="text-sm font-bold">{statusCounts.shipped}</span>
          </Badge>
          <Badge variant="outline" className="flex flex-col items-center p-2 bg-cyan-50 border-cyan-200 text-cyan-800 text-center">
            <span className="text-lg">📦</span>
            <span className="text-xs font-medium truncate">Entregado</span>
            <span className="text-sm font-bold">{statusCounts.delivered}</span>
          </Badge>
          <Badge variant="outline" className="flex flex-col items-center p-2 bg-emerald-50 border-emerald-200 text-emerald-800 text-center">
            <span className="text-lg">✅</span>
            <span className="text-xs font-medium truncate">Completado</span>
            <span className="text-sm font-bold">{statusCounts.completed}</span>
          </Badge>
          <Badge variant="outline" className="flex flex-col items-center p-2 bg-red-50 border-red-200 text-red-700 text-center">
            <span className="text-lg">❌</span>
            <span className="text-xs font-medium truncate">Rechazado</span>
            <span className="text-sm font-bold">{statusCounts.rejected}</span>
          </Badge>
          <Badge variant="outline" className="flex flex-col items-center p-2 bg-gray-100 border-gray-300 text-gray-700 text-center">
            <span className="text-lg">⊘</span>
            <span className="text-xs font-medium truncate">Anulado</span>
            <span className="text-sm font-bold">{statusCounts.canceled}</span>
          </Badge>
        </div>
      </div>

      {/* Vista desktop/tablet */}
      <div className="hidden lg:flex flex-wrap gap-3">
        {/* Estados activos - Prioridad alta */}
        <Badge 
          variant="outline" 
          className="flex items-center justify-between p-3 bg-gray-50 border-gray-200 text-gray-700 min-w-[140px]"
        >
          <div className="flex items-center gap-2">
            <span className="text-base">✏️</span>
            <span className="text-sm font-medium">Cotización</span>
          </div>
          <span className="text-lg font-bold">{statusCounts.quotation}</span>
        </Badge>
        
        <Badge 
          variant="outline" 
          className="flex items-center justify-between p-3 bg-orange-50 border-orange-200 text-orange-800 min-w-[140px]"
        >
          <div className="flex items-center gap-2">
            <span className="text-base">💬</span>
            <span className="text-sm font-medium">Solicitado</span>
          </div>
          <span className="text-lg font-bold">{statusCounts.requested}</span>
        </Badge>
        
        <Badge 
          variant="outline" 
          className="flex items-center justify-between p-3 bg-purple-50 border-purple-200 text-purple-800 min-w-[140px]"
        >
          <div className="flex items-center gap-2">
            <span className="text-base">👍</span>
            <span className="text-sm font-medium">Aceptado</span>
          </div>
          <span className="text-lg font-bold">{statusCounts.accepted}</span>
        </Badge>
        
        <Badge 
          variant="outline" 
          className="flex items-center justify-between p-3 bg-green-50 border-green-200 text-green-800 min-w-[140px]"
        >
          <div className="flex items-center gap-2">
            <span className="text-base">💳</span>
            <span className="text-sm font-medium">Pagado</span>
          </div>
          <span className="text-lg font-bold">{statusCounts.paid}</span>
        </Badge>
        
        <Badge 
          variant="outline" 
          className="flex items-center justify-between p-3 bg-yellow-50 border-yellow-200 text-yellow-800 min-w-[140px]"
        >
          <div className="flex items-center gap-2">
            <span className="text-base">⏳</span>
            <span className="text-sm font-medium">Pendiente</span>
          </div>
          <span className="text-lg font-bold">{statusCounts.payment_pending}</span>
        </Badge>
        
        {/* Estados de proceso */}
        <Badge 
          variant="outline" 
          className="flex items-center justify-between p-3 bg-blue-50 border-blue-200 text-blue-800 min-w-[140px]"
        >
          <div className="flex items-center gap-2">
            <span className="text-base">🧾</span>
            <span className="text-sm font-medium">Facturado</span>
          </div>
          <span className="text-lg font-bold">{statusCounts.invoiced}</span>
        </Badge>
        
        <Badge 
          variant="outline" 
          className="flex items-center justify-between p-3 bg-red-50 border-red-200 text-red-800 min-w-[140px]"
        >
          <div className="flex items-center gap-2">
            <span className="text-base">💰</span>
            <span className="text-sm font-medium">Cobranza</span>
          </div>
          <span className="text-lg font-bold">{statusCounts.processing}</span>
        </Badge>
        
        <Badge 
          variant="outline" 
          className="flex items-center justify-between p-3 bg-indigo-50 border-indigo-200 text-indigo-800 min-w-[140px]"
        >
          <div className="flex items-center gap-2">
            <span className="text-base">🚚</span>
            <span className="text-sm font-medium">Enviado</span>
          </div>
          <span className="text-lg font-bold">{statusCounts.shipped}</span>
        </Badge>
        
        <Badge 
          variant="outline" 
          className="flex items-center justify-between p-3 bg-cyan-50 border-cyan-200 text-cyan-800 min-w-[140px]"
        >
          <div className="flex items-center gap-2">
            <span className="text-base">📦</span>
            <span className="text-sm font-medium">Entregado</span>
          </div>
          <span className="text-lg font-bold">{statusCounts.delivered}</span>
        </Badge>
        
        {/* Estados finales */}
        <Badge 
          variant="outline" 
          className="flex items-center justify-between p-3 bg-emerald-50 border-emerald-200 text-emerald-800 min-w-[140px]"
        >
          <div className="flex items-center gap-2">
            <span className="text-base">✅</span>
            <span className="text-sm font-medium">Completado</span>
          </div>
          <span className="text-lg font-bold">{statusCounts.completed}</span>
        </Badge>
        
        <Badge 
          variant="outline" 
          className="flex items-center justify-between p-3 bg-red-50 border-red-200 text-red-700 min-w-[140px]"
        >
          <div className="flex items-center gap-2">
            <span className="text-base">❌</span>
            <span className="text-sm font-medium">Rechazado</span>
          </div>
          <span className="text-lg font-bold">{statusCounts.rejected}</span>
        </Badge>
        
        <Badge 
          variant="outline" 
          className="flex items-center justify-between p-3 bg-gray-100 border-gray-300 text-gray-700 min-w-[140px]"
        >
          <div className="flex items-center gap-2">
            <span className="text-base">⊘</span>
            <span className="text-sm font-medium">Anulado</span>
          </div>
          <span className="text-lg font-bold">{statusCounts.canceled}</span>
        </Badge>
      </div>
    </div>
  );
};
