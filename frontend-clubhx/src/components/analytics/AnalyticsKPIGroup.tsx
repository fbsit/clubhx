
import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Users, TrendingUp, TrendingDown, User } from "lucide-react";

// Datos simulados
const kpis = [
  {
    icon: <Users className="h-6 w-6 text-primary" />,
    label: "Usuarios activos",
    value: 342,
    sub: "últimos 30 días"
  },
  {
    icon: <TrendingUp className="h-6 w-6 text-green-600" />,
    label: "Sesiones promedio",
    value: "3.2",
    sub: "por usuario"
  },
  {
    icon: <TrendingDown className="h-6 w-6 text-destructive" />,
    label: "Clientes inactivos",
    value: 17,
    sub: "sin cotizar 60+ días"
  },
  {
    icon: <User className="h-6 w-6 text-muted-foreground" />,
    label: "Recurrentes vs nuevos",
    value: "68% / 32%",
    sub: ""
  }
];

export default function AnalyticsKPIGroup() {
  return (
    <div className="grid gap-3">
      {kpis.map((kpi, idx) => (
        <Card key={kpi.label} className="p-3 flex items-center gap-3 shadow-none bg-muted/60">
          <div className="flex-shrink-0 rounded-full bg-muted p-2">{kpi.icon}</div>
          <div>
            <div className="text-lg font-semibold">{kpi.value}</div>
            <div className="text-muted-foreground text-sm">{kpi.label}</div>
            {kpi.sub && <div className="text-xs text-muted-foreground">{kpi.sub}</div>}
          </div>
        </Card>
      ))}
    </div>
  );
}
