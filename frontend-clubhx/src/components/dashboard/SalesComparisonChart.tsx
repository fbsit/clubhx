import React from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Area, AreaChart, XAxis, YAxis, CartesianGrid, ResponsiveContainer, Tooltip, Brush } from "recharts";

interface SalesComparisonData {
  period: string;
  year2023: number;
  year2024: number;
  year2025: number;
}

interface SalesComparisonChartProps {
  selectedMonth: string;
  selectedYears: string[];
}

// Datos de ejemplo para ventas comparativas (en millones CLP)
const salesComparisonData: SalesComparisonData[] = [
  { period: "Ene", year2023: 45.2, year2024: 52.8, year2025: 48.1 },
  { period: "Feb", year2023: 48.7, year2024: 55.3, year2025: 51.2 },
  { period: "Mar", year2023: 52.1, year2024: 58.9, year2025: 54.7 },
  { period: "Abr", year2023: 49.8, year2024: 56.2, year2025: 52.3 },
  { period: "May", year2023: 54.3, year2024: 61.7, year2025: 57.8 },
  { period: "Jun", year2023: 57.6, year2024: 64.1, year2025: 60.2 },
  { period: "Jul", year2023: 60.2, year2024: 67.8, year2025: 63.5 },
  { period: "Ago", year2023: 58.9, year2024: 65.4, year2025: 61.8 },
  { period: "Sep", year2023: 55.7, year2024: 62.3, year2025: 58.9 },
  { period: "Oct", year2023: 53.2, year2024: 59.8, year2025: 56.1 },
  { period: "Nov", year2023: 51.8, year2024: 58.2, year2025: 54.7 },
  { period: "Dic", year2023: 59.4, year2024: 66.9, year2025: 62.3 },
];

const yearColors = {
  year2023: "#8884d8",  // Azul
  year2024: "#ff7c43",  // Naranja  
  year2025: "#82ca9d",  // Gris verdoso
};

const yearLabels = {
  year2023: "2023",
  year2024: "2024", 
  year2025: "2025",
};

export function SalesComparisonChart({ selectedMonth, selectedYears }: SalesComparisonChartProps) {
  const monthNames = {
    "01": "Enero", "02": "Febrero", "03": "Marzo", "04": "Abril",
    "05": "Mayo", "06": "Junio", "07": "Julio", "08": "Agosto",
    "09": "Septiembre", "10": "Octubre", "11": "Noviembre", "12": "Diciembre"
  };

  const formatTooltip = (value: number, name: string) => {
    const yearLabel = yearLabels[name as keyof typeof yearLabels];
    return [`$${value.toFixed(1)} MM`, yearLabel];
  };

  const formatYAxis = (value: number) => `$${value}MM`;

  return (
    <Card>
      <CardHeader className="pb-3">
        <CardTitle className="text-base sm:text-lg">
          Comparativa Ventas Totales ($ MM) - {monthNames[selectedMonth as keyof typeof monthNames]} 2025
        </CardTitle>
        <CardDescription className="text-xs sm:text-sm">
          Evolución de ventas por año seleccionado
        </CardDescription>
      </CardHeader>
      <CardContent className="p-3 sm:p-6">
        <div className="h-[350px] sm:h-[400px] w-full">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={salesComparisonData} margin={{ top: 20, right: 30, left: 20, bottom: 60 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
              <XAxis 
                dataKey="period" 
                fontSize={12}
                tick={{ fontSize: 10 }}
                stroke="hsl(var(--muted-foreground))"
              />
              <YAxis 
                tickFormatter={formatYAxis}
                fontSize={12}
                tick={{ fontSize: 10 }}
                stroke="hsl(var(--muted-foreground))"
              />
              <Tooltip 
                formatter={formatTooltip}
                contentStyle={{ 
                  fontSize: '12px',
                  backgroundColor: 'hsl(var(--background))',
                  border: '1px solid hsl(var(--border))',
                  borderRadius: '8px'
                }}
              />
              
              {/* Renderizar áreas solo para años seleccionados */}
              {selectedYears.includes("2023") && (
                <Area
                  type="monotone"
                  dataKey="year2023"
                  stroke={yearColors.year2023}
                  fill={yearColors.year2023}
                  fillOpacity={0.2}
                  strokeWidth={2}
                  name="year2023"
                />
              )}
              {selectedYears.includes("2024") && (
                <Area
                  type="monotone"
                  dataKey="year2024"
                  stroke={yearColors.year2024}
                  fill={yearColors.year2024}
                  fillOpacity={0.2}
                  strokeWidth={2}
                  name="year2024"
                />
              )}
              {selectedYears.includes("2025") && (
                <Area
                  type="monotone"
                  dataKey="year2025"
                  stroke={yearColors.year2025}
                  fill={yearColors.year2025}
                  fillOpacity={0.2}
                  strokeWidth={2}
                  name="year2025"
                />
              )}
              
              {/* Brush para navegación */}
              <Brush dataKey="period" height={30} stroke="hsl(var(--primary))" />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
}