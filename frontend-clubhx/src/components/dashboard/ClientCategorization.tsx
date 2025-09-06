import React from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Crown, Users, AlertTriangle, AlertCircle } from "lucide-react";

const clientCategories = [
  {
    name: "Premium",
    count: 12,
    percentage: 27,
    description: "Alto volumen, pago puntual",
    icon: Crown,
    color: "bg-yellow-100 text-yellow-800",
    iconColor: "text-yellow-600"
  },
  {
    name: "Regulares",
    count: 24,
    percentage: 53,
    description: "Compras consistentes",
    icon: Users,
    color: "bg-green-100 text-green-800",
    iconColor: "text-green-600"
  },
  {
    name: "En Riesgo",
    count: 6,
    percentage: 13,
    description: "Disminución en compras",
    icon: AlertTriangle,
    color: "bg-orange-100 text-orange-800",
    iconColor: "text-orange-600"
  },
  {
    name: "Críticos",
    count: 3,
    percentage: 7,
    description: "Requieren atención inmediata",
    icon: AlertCircle,
    color: "bg-red-100 text-red-800",
    iconColor: "text-red-600"
  }
];

export function ClientCategorization() {
  const totalClients = clientCategories.reduce((sum, category) => sum + category.count, 0);

  return (
    <Card>
      <CardHeader className="pb-3">
        <CardTitle className="text-base sm:text-lg">Distribución de Clientes</CardTitle>
        <CardDescription className="text-xs sm:text-sm">Categorización por comportamiento de compra</CardDescription>
      </CardHeader>
      <CardContent className="p-3 sm:p-6">
        <div className="space-y-3 sm:space-y-4">
          {clientCategories.map((category) => {
            const Icon = category.icon;
            return (
              <div key={category.name} className="flex items-center justify-between p-3 rounded-lg border border-border/50">
                <div className="flex items-center gap-2 sm:gap-3 min-w-0 flex-1">
                  <div className="p-1.5 sm:p-2 bg-muted/50 rounded-full flex-shrink-0">
                    <Icon className={`h-4 w-4 sm:h-5 sm:w-5 ${category.iconColor}`} />
                  </div>
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <p className="font-medium text-sm sm:text-base text-foreground truncate">{category.name}</p>
                      <Badge variant="secondary" className={`${category.color} text-xs flex-shrink-0`}>
                        {category.count}
                      </Badge>
                    </div>
                    <p className="text-xs sm:text-sm text-muted-foreground">{category.description}</p>
                  </div>
                </div>
                <div className="text-right flex-shrink-0 ml-3">
                  <p className="text-xl sm:text-2xl font-bold text-foreground">{category.percentage}%</p>
                  <p className="text-xs text-muted-foreground">del total</p>
                </div>
              </div>
            );
          })}
        </div>
        
        <div className="mt-4 sm:mt-6 pt-3 sm:pt-4 border-t border-border">
          <div className="flex items-center justify-between">
            <span className="text-xs sm:text-sm font-medium text-muted-foreground">Total de Clientes</span>
            <span className="text-base sm:text-lg font-bold text-foreground">{totalClients}</span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}