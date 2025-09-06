import React from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { PieChart, Pie, Cell, Legend, ResponsiveContainer, Tooltip as RechartsTooltip } from "recharts";

// Datos simulados de canjes
const canjes = [
  { name: "Ampolla BC", value: 38 },
  { name: "Kit Blondme", value: 26 },
  { name: "Gift Card", value: 17 }
];

// Nuevo arreglo de colores con contraste mejorado para Gift Card
const COLORS = [
  "#9b87f5",  // Ampolla BC
  "#7E69AB",  // Kit Blondme
  "#1EAEDB"   // Gift Card - Bright Blue (antes era #E5DEFF)
];

const clientesTop = [
  { cliente: "Salón Look", puntos: 2150 },
  { cliente: "Peluquería Glam", puntos: 1730 }
];

export default function LoyaltySummary() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Actividad de Lealtad</CardTitle>
        <p className="text-muted-foreground text-xs mt-1">
          Premios más canjeados y clientes top del programa.
        </p>
      </CardHeader>
      <CardContent>
        <div className="flex flex-col gap-4">
          <div className="w-full h-40">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie 
                  data={canjes}
                  dataKey="value"
                  nameKey="name"
                  cx="50%" cy="50%" outerRadius={45}
                  innerRadius={22}
                  label={({ name, percent }) =>
                    `${name} (${(percent * 100).toFixed(0)}%)`
                  }
                >
                  {canjes.map((_, idx) => (
                    <Cell key={idx} fill={COLORS[idx % COLORS.length]} />
                  ))}
                </Pie>
                <Legend />
                <RechartsTooltip />
              </PieChart>
            </ResponsiveContainer>
          </div>
          <div className="mt-2">
            <div className="text-sm font-semibold mb-1">Clientes Top</div>
            <ul>
              {clientesTop.map(c => (
                <li key={c.cliente} className="flex justify-between">
                  <span>{c.cliente}</span>
                  <span className="font-semibold text-primary">{c.puntos} pts</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
