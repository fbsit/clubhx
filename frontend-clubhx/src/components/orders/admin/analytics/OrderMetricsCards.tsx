import { useMemo } from "react";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Order } from "@/types/order";
import { TrendingUp, TrendingDown, DollarSign, Package, Calculator, Users } from "lucide-react";

interface OrderMetricsCardsProps {
  currentOrders: Order[];
  previousOrders: Order[];
  currentPeriod: string;
  previousPeriod: string;
}

export default function OrderMetricsCards({
  currentOrders,
  previousOrders,
  currentPeriod,
  previousPeriod
}: OrderMetricsCardsProps) {
  
  const metrics = useMemo(() => {
    const currentTotal = currentOrders.reduce((sum, order) => sum + order.total, 0);
    const previousTotal = previousOrders.reduce((sum, order) => sum + order.total, 0);
    const currentAvg = currentOrders.length > 0 ? currentTotal / currentOrders.length : 0;
    const previousAvg = previousOrders.length > 0 ? previousTotal / previousOrders.length : 0;
    
    const ordersChange = previousOrders.length > 0 
      ? ((currentOrders.length - previousOrders.length) / previousOrders.length) * 100 
      : 0;
    
    const revenueChange = previousTotal > 0 
      ? ((currentTotal - previousTotal) / previousTotal) * 100 
      : 0;
    
    const avgChange = previousAvg > 0 
      ? ((currentAvg - previousAvg) / previousAvg) * 100 
      : 0;

    const uniqueCustomers = new Set(currentOrders.map(order => order.customer)).size;
    const previousUniqueCustomers = new Set(previousOrders.map(order => order.customer)).size;
    const customersChange = previousUniqueCustomers > 0 
      ? ((uniqueCustomers - previousUniqueCustomers) / previousUniqueCustomers) * 100 
      : 0;

    return {
      orders: {
        current: currentOrders.length,
        previous: previousOrders.length,
        change: ordersChange
      },
      revenue: {
        current: currentTotal,
        previous: previousTotal,
        change: revenueChange
      },
      avgOrder: {
        current: currentAvg,
        previous: previousAvg,
        change: avgChange
      },
      customers: {
        current: uniqueCustomers,
        previous: previousUniqueCustomers,
        change: customersChange
      }
    };
  }, [currentOrders, previousOrders]);

  const getTrendIcon = (change: number) => {
    if (change > 0) return <TrendingUp className="h-4 w-4 text-green-500" />;
    if (change < 0) return <TrendingDown className="h-4 w-4 text-red-500" />;
    return null;
  };

  const getTrendColor = (change: number) => {
    if (change > 0) return "text-green-600";
    if (change < 0) return "text-red-600";
    return "text-gray-500";
  };

  const formatCurrency = (amount: number) => `$${amount.toLocaleString("es-CL")}`;

  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 mb-4">
      {/* Total Pedidos */}
      <Card className="p-4">
        <div className="flex items-center gap-2 mb-2">
          <Package className="h-4 w-4 text-blue-500" />
          <span className="text-xs font-medium text-muted-foreground">Pedidos</span>
        </div>
        <div className="space-y-1">
          <div className="text-2xl font-bold">{metrics.orders.current}</div>
          <div className="flex items-center gap-1">
            {getTrendIcon(metrics.orders.change)}
            <span className={`text-xs ${getTrendColor(metrics.orders.change)}`}>
              {metrics.orders.change > 0 ? '+' : ''}{metrics.orders.change.toFixed(1)}%
            </span>
          </div>
        </div>
      </Card>

      {/* Ingresos */}
      <Card className="p-4">
        <div className="flex items-center gap-2 mb-2">
          <DollarSign className="h-4 w-4 text-green-500" />
          <span className="text-xs font-medium text-muted-foreground">Ingresos</span>
        </div>
        <div className="space-y-1">
          <div className="text-lg font-bold">{formatCurrency(metrics.revenue.current)}</div>
          <div className="flex items-center gap-1">
            {getTrendIcon(metrics.revenue.change)}
            <span className={`text-xs ${getTrendColor(metrics.revenue.change)}`}>
              {metrics.revenue.change > 0 ? '+' : ''}{metrics.revenue.change.toFixed(1)}%
            </span>
          </div>
        </div>
      </Card>

      {/* Promedio por Pedido */}
      <Card className="p-4">
        <div className="flex items-center gap-2 mb-2">
          <Calculator className="h-4 w-4 text-purple-500" />
          <span className="text-xs font-medium text-muted-foreground">Promedio</span>
        </div>
        <div className="space-y-1">
          <div className="text-lg font-bold">{formatCurrency(metrics.avgOrder.current)}</div>
          <div className="flex items-center gap-1">
            {getTrendIcon(metrics.avgOrder.change)}
            <span className={`text-xs ${getTrendColor(metrics.avgOrder.change)}`}>
              {metrics.avgOrder.change > 0 ? '+' : ''}{metrics.avgOrder.change.toFixed(1)}%
            </span>
          </div>
        </div>
      </Card>

      {/* Clientes Únicos */}
      <Card className="p-4">
        <div className="flex items-center gap-2 mb-2">
          <Users className="h-4 w-4 text-orange-500" />
          <span className="text-xs font-medium text-muted-foreground">Clientes</span>
        </div>
        <div className="space-y-1">
          <div className="text-2xl font-bold">{metrics.customers.current}</div>
          <div className="flex items-center gap-1">
            {getTrendIcon(metrics.customers.change)}
            <span className={`text-xs ${getTrendColor(metrics.customers.change)}`}>
              {metrics.customers.change > 0 ? '+' : ''}{metrics.customers.change.toFixed(1)}%
            </span>
          </div>
        </div>
      </Card>
    </div>
  );
}