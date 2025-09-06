
import React from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { ChartContainer } from "@/components/ui/chart";
import { Funnel, FunnelChart, Tooltip, LabelList, ResponsiveContainer } from "recharts";

// Datos simulados del funnel de conversión
const funnelData = [
  { name: "Visitas catálogo", value: 1200 },
  { name: "Producto visto", value: 860 },
  { name: "Agregado a cotización", value: 440 },
  { name: "Cotización enviada", value: 160 },
  { name: "Pedido concretado", value: 70 }
];

export default function AnalyticsFunnel() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Funnel de Conversión</CardTitle>
        <p className="text-muted-foreground text-xs mt-1">
          Visualiza dónde los usuarios avanzan y dónde abandonan el proceso.
        </p>
      </CardHeader>
      <CardContent>
        <div className="w-full h-64 flex items-center justify-center">
          <ResponsiveContainer width="100%" height="100%">
            <FunnelChart>
              <Tooltip />
              <Funnel
                dataKey="value"
                data={funnelData}
                isAnimationActive
                stroke="#9b87f5"
                fill="#e5deff"
              >
                <LabelList dataKey="name" position="right" fill="#6E59A5"/>
              </Funnel>
            </FunnelChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
}
