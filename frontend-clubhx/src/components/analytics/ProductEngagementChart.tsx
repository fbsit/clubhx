
import React from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { ChartContainer, ChartLegend, ChartTooltip } from "@/components/ui/chart";
import { Bar, XAxis, YAxis, Tooltip as RechartsTooltip, Legend as RechartsLegend, BarChart, ResponsiveContainer } from "recharts";

// Datos simulados: productos + vistos vs agregados a cotización
const data = [
  { name: "Color Mask", vistos: 504, cotizados: 68 },
  { name: "Blondme Dust", vistos: 421, cotizados: 118 },
  { name: "Chroma ID", vistos: 312, cotizados: 51 },
  { name: "BC Shampoo", vistos: 305, cotizados: 99 },
  { name: "OSiS+ Spray", vistos: 280, cotizados: 18 }
];

export default function ProductEngagementChart() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Productos más vistos vs. cotizados</CardTitle>
        <p className="text-muted-foreground text-xs mt-1">
          Detecta productos populares pero con baja conversión.
        </p>
      </CardHeader>
      <CardContent>
        <div className="w-full h-80">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={data}>
              <XAxis dataKey="name" />
              <YAxis />
              <RechartsTooltip />
              <RechartsLegend />
              <Bar dataKey="vistos" fill="#d6bcfa" name="Vistos" radius={[4, 4, 0, 0]} />
              <Bar dataKey="cotizados" fill="#9b87f5" name="Cotizados" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
}
