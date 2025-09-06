import React, { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Area, AreaChart, Bar, BarChart, XAxis, YAxis, CartesianGrid, ResponsiveContainer, Tooltip } from "recharts";
import VendorYearComparisonSection from "./VendorYearComparisonSection";
import VendorMobileYearComparisonSection from "./VendorMobileYearComparisonSection";
import { BarChart3, TrendingUp } from "lucide-react";

const salesData = [
  { mes: "Ene", ventas: 3200000, meta: 3500000, nuevosClientes: 4 },
  { mes: "Feb", ventas: 3800000, meta: 3500000, nuevosClientes: 6 },
  { mes: "Mar", ventas: 4200000, meta: 4000000, nuevosClientes: 8 },
  { mes: "Abr", ventas: 3900000, meta: 4000000, nuevosClientes: 5 },
  { mes: "May", ventas: 5438250, meta: 4500000, nuevosClientes: 7 },
];

const categoriesData = [
  { categoria: "Color", ventas: 1800000, porcentaje: 33 },
  { categoria: "Cuidado", ventas: 1500000, porcentaje: 28 },
  { categoria: "Styling", ventas: 1200000, porcentaje: 22 },
  { categoria: "Técnico", ventas: 938250, porcentaje: 17 }
];

const chartConfig = {
  ventas: {
    label: "Ventas",
    color: "hsl(var(--primary))",
  },
  meta: {
    label: "Meta",
    color: "hsl(var(--muted-foreground))",
  },
  nuevosClientes: {
    label: "Nuevos Clientes",
    color: "hsl(var(--accent))",
  },
};

export function SalesChartsSection() {
  const [viewMode, setViewMode] = useState<"current" | "comparison">("current");

  return (
    <div className="space-y-6">
      {/* Toggle entre vista actual y comparativa */}
      <div className="flex items-center gap-2">
        <Button
          variant={viewMode === "current" ? "default" : "outline"}
          size="sm"
          onClick={() => setViewMode("current")}
          className="flex items-center gap-2"
        >
          <BarChart3 className="h-4 w-4" />
          Vista Actual
        </Button>
        <Button
          variant={viewMode === "comparison" ? "default" : "outline"}
          size="sm"
          onClick={() => setViewMode("comparison")}
          className="flex items-center gap-2"
        >
          <TrendingUp className="h-4 w-4" />
          Comparativa Anual
        </Button>
      </div>

      {viewMode === "comparison" ? (
        <>
          <div className="block md:hidden">
            <VendorMobileYearComparisonSection />
          </div>
          <div className="hidden md:block">
            <VendorYearComparisonSection />
          </div>
        </>
      ) : (
        <div className="grid grid-cols-1 xl:grid-cols-2 gap-4 sm:gap-6">
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-base sm:text-lg">Evolución de Ventas</CardTitle>
          <CardDescription className="text-xs sm:text-sm">Comparación mensual vs meta</CardDescription>
        </CardHeader>
        <CardContent className="p-3 sm:p-6">
          <div className="h-[250px] sm:h-[300px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={salesData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis 
                  dataKey="mes" 
                  fontSize={12}
                  tick={{ fontSize: 10 }}
                />
                <YAxis 
                  tickFormatter={(value) => `$${(value / 1000000).toFixed(1)}M`}
                  fontSize={12}
                  tick={{ fontSize: 10 }}
                />
                <Tooltip 
                  formatter={(value) => [`$${value.toLocaleString()}`, '']}
                  contentStyle={{ fontSize: '12px' }}
                />
                <Area
                  type="monotone"
                  dataKey="meta"
                  stroke="#82ca9d"
                  fill="#82ca9d"
                  fillOpacity={0.1}
                  strokeWidth={2}
                  strokeDasharray="5 5"
                  name="Meta"
                />
                <Area
                  type="monotone"
                  dataKey="ventas"
                  stroke="#8884d8"
                  fill="#8884d8"
                  fillOpacity={0.4}
                  strokeWidth={3}
                  name="Ventas Reales"
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-base sm:text-lg">Performance por Categoría</CardTitle>
          <CardDescription className="text-xs sm:text-sm">Ventas por tipo de producto</CardDescription>
        </CardHeader>
        <CardContent className="p-3 sm:p-6">
          <div className="h-[250px] sm:h-[300px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={categoriesData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis 
                  dataKey="categoria"
                  fontSize={12}
                  tick={{ fontSize: 10 }}
                  angle={-45}
                  textAnchor="end"
                  height={60}
                />
                <YAxis 
                  tickFormatter={(value) => `$${(value / 1000000).toFixed(1)}M`}
                  fontSize={12}
                  tick={{ fontSize: 10 }}
                />
                <Tooltip 
                  formatter={(value) => [`$${value.toLocaleString()}`, '']}
                  contentStyle={{ fontSize: '12px' }}
                />
                <Bar
                  dataKey="ventas"
                  fill="#8884d8"
                  radius={[4, 4, 0, 0]}
                />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>
        </div>
      )}
    </div>
  );
}