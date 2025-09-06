import React from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { TrendingUp, TrendingDown, Package, Bell, Calendar } from "lucide-react";

const topProducts = [
  { name: "IGORA Color", sales: 850000, growth: 15 },
  { name: "BC Repair", sales: 680000, growth: 8 },
  { name: "OSiS+ Texture", sales: 520000, growth: -3 },
  { name: "BlondMe", sales: 445000, growth: 22 },
  { name: "Fibreplex", sales: 380000, growth: 12 }
];

const growthClients = [
  { name: "Salon Belleza Pro", growth: 45, lastPurchase: "2 días" },
  { name: "Hair Design", growth: 38, lastPurchase: "1 semana" },
  { name: "Beauty Center", growth: 32, lastPurchase: "3 días" },
  { name: "Estética Moderna", growth: 28, lastPurchase: "5 días" }
];

const opportunities = [
  { type: "Restock", client: "Salon Express", message: "Productos habituales agotándose", priority: "high" },
  { type: "Upsell", client: "Beauty Zone", message: "Interés en línea premium", priority: "medium" },
  { type: "Follow-up", client: "Hair Studio", message: "Cotización pendiente por 5 días", priority: "high" }
];

const upcomingActivities = [
  { type: "Visita", client: "Salon Elegance", date: "Hoy 15:00", status: "confirmed" },
  { type: "Llamada", client: "Beauty Pro", date: "Mañana 10:00", status: "pending" },
  { type: "Presentación", client: "Hair Design", date: "Miércoles 14:00", status: "confirmed" }
];

export function PerformanceWidgets() {
  return (
    <div className="grid grid-cols-1 xl:grid-cols-2 gap-4 sm:gap-6">
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-base sm:text-lg flex items-center gap-2">
            <Package className="h-4 w-4 sm:h-5 sm:w-5" />
            Top Productos
          </CardTitle>
          <CardDescription className="text-xs sm:text-sm">Productos más vendidos este mes</CardDescription>
        </CardHeader>
        <CardContent className="p-3 sm:p-6">
          <div className="space-y-3">
            {topProducts.map((product, index) => (
              <div key={product.name} className="flex items-center justify-between">
                <div className="flex items-center gap-2 sm:gap-3 min-w-0 flex-1">
                  <div className="flex items-center justify-center w-5 h-5 sm:w-6 sm:h-6 bg-primary/10 rounded-full text-xs font-medium flex-shrink-0">
                    {index + 1}
                  </div>
                  <span className="font-medium text-xs sm:text-sm truncate">{product.name}</span>
                </div>
                <div className="flex items-center gap-2 flex-shrink-0">
                  <span className="text-xs sm:text-sm font-medium">${(product.sales / 1000).toFixed(0)}K</span>
                  <div className={`flex items-center gap-1 text-xs ${
                    product.growth >= 0 ? 'text-green-600' : 'text-red-600'
                  }`}>
                    {product.growth >= 0 ? (
                      <TrendingUp className="h-3 w-3" />
                    ) : (
                      <TrendingDown className="h-3 w-3" />
                    )}
                    <span className="hidden sm:inline">{product.growth > 0 ? '+' : ''}{product.growth}%</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-base sm:text-lg flex items-center gap-2">
            <TrendingUp className="h-4 w-4 sm:h-5 sm:w-5" />
            Clientes en Crecimiento
          </CardTitle>
          <CardDescription className="text-xs sm:text-sm">Mayor incremento en compras</CardDescription>
        </CardHeader>
        <CardContent className="p-3 sm:p-6">
          <div className="space-y-3">
            {growthClients.map((client) => (
              <div key={client.name} className="flex items-center justify-between">
                <div className="min-w-0 flex-1">
                  <p className="font-medium text-xs sm:text-sm truncate">{client.name}</p>
                  <p className="text-xs text-muted-foreground">Última compra: {client.lastPurchase}</p>
                </div>
                <Badge variant="secondary" className="bg-green-100 text-green-800 text-xs flex-shrink-0 ml-2">
                  +{client.growth}%
                </Badge>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-base sm:text-lg flex items-center gap-2">
            <Bell className="h-4 w-4 sm:h-5 sm:w-5" />
            Oportunidades
          </CardTitle>
          <CardDescription className="text-xs sm:text-sm">Alertas de venta importantes</CardDescription>
        </CardHeader>
        <CardContent className="p-3 sm:p-6">
          <div className="space-y-3">
            {opportunities.map((opportunity, index) => (
              <div key={index} className="flex items-start justify-between p-3 bg-muted/30 rounded-lg gap-3">
                <div className="flex-1 min-w-0">
                  <div className="flex flex-wrap items-center gap-2 mb-1">
                    <Badge variant="outline" className="text-xs">
                      {opportunity.type}
                    </Badge>
                    <span className="font-medium text-xs sm:text-sm truncate">{opportunity.client}</span>
                  </div>
                  <p className="text-xs text-muted-foreground">{opportunity.message}</p>
                </div>
                <div className={`w-2 h-2 rounded-full flex-shrink-0 mt-1 ${
                  opportunity.priority === 'high' ? 'bg-red-500' : 'bg-orange-500'
                }`} />
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-base sm:text-lg flex items-center gap-2">
            <Calendar className="h-4 w-4 sm:h-5 sm:w-5" />
            Próximas Actividades
          </CardTitle>
          <CardDescription className="text-xs sm:text-sm">Agenda de los próximos días</CardDescription>
        </CardHeader>
        <CardContent className="p-3 sm:p-6">
          <div className="space-y-3">
            {upcomingActivities.map((activity, index) => (
              <div key={index} className="flex items-center justify-between">
                <div className="min-w-0 flex-1">
                  <div className="flex flex-wrap items-center gap-2">
                    <Badge variant="outline" className="text-xs">
                      {activity.type}
                    </Badge>
                    <span className="font-medium text-xs sm:text-sm truncate">{activity.client}</span>
                  </div>
                  <p className="text-xs text-muted-foreground">{activity.date}</p>
                </div>
                <div className={`w-2 h-2 rounded-full flex-shrink-0 ml-2 ${
                  activity.status === 'confirmed' ? 'bg-green-500' : 'bg-orange-500'
                }`} />
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}