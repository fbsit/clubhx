import React from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Area, AreaChart, XAxis, YAxis, CartesianGrid, ResponsiveContainer, Tooltip, Brush } from "recharts";

interface ClientsComparisonData {
  period: string;
  clients2023: number;
  clients2024: number;
  clients2025: number;
}

interface ClientsComparisonChartProps {
  selectedMonth: string;
  selectedYears: string[];
}

// Datos de ejemplo para clientes comparativos
const clientsComparisonData: ClientsComparisonData[] = [
  { period: "Ene", clients2023: 85, clients2024: 92, clients2025: 89 },
  { period: "Feb", clients2023: 88, clients2024: 95, clients2025: 91 },
  { period: "Mar", clients2023: 91, clients2024: 98, clients2025: 94 },
  { period: "Abr", clients2023: 87, clients2024: 94, clients2025: 90 },
  { period: "May", clients2023: 93, clients2024: 101, clients2025: 97 },
  { period: "Jun", clients2023: 96, clients2024: 104, clients2025: 100 },
  { period: "Jul", clients2023: 99, clients2024: 107, clients2025: 103 },
  { period: "Ago", clients2023: 97, clients2024: 105, clients2025: 101 },
  { period: "Sep", clients2023: 94, clients2024: 102, clients2025: 98 },
  { period: "Oct", clients2023: 91, clients2024: 99, clients2025: 95 },
  { period: "Nov", clients2023: 89, clients2024: 97, clients2025: 93 },
  { period: "Dic", clients2023: 102, clients2024: 110, clients2025: 106 },
];

const yearColors = {
  clients2023: "#8884d8",  // Azul
  clients2024: "#ff7c43",  // Naranja  
  clients2025: "#82ca9d",  // Gris verdoso
};

const yearLabels = {
  clients2023: "2023",
  clients2024: "2024", 
  clients2025: "2025",
};

export function ClientsComparisonChart({ selectedMonth, selectedYears }: ClientsComparisonChartProps) {
  const monthNames = {
    "01": "Enero", "02": "Febrero", "03": "Marzo", "04": "Abril",
    "05": "Mayo", "06": "Junio", "07": "Julio", "08": "Agosto",
    "09": "Septiembre", "10": "Octubre", "11": "Noviembre", "12": "Diciembre"
  };

  const formatTooltip = (value: number, name: string) => {
    const yearLabel = yearLabels[name as keyof typeof yearLabels];
    return [`${value} clientes`, yearLabel];
  };

  return (
    <Card>
      <CardHeader className="pb-3">
        <CardTitle className="text-base sm:text-lg">
          Comparativa Cantidad Clientes - {monthNames[selectedMonth as keyof typeof monthNames]} 2025
        </CardTitle>
        <CardDescription className="text-xs sm:text-sm">
          Evolución de clientes activos por año seleccionado
        </CardDescription>
      </CardHeader>
      <CardContent className="p-3 sm:p-6">
        <div className="h-[350px] sm:h-[400px] w-full">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={clientsComparisonData} margin={{ top: 20, right: 30, left: 20, bottom: 60 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
              <XAxis 
                dataKey="period" 
                fontSize={12}
                tick={{ fontSize: 10 }}
                stroke="hsl(var(--muted-foreground))"
              />
              <YAxis 
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
                  dataKey="clients2023"
                  stroke={yearColors.clients2023}
                  fill={yearColors.clients2023}
                  fillOpacity={0.2}
                  strokeWidth={2}
                  name="clients2023"
                />
              )}
              {selectedYears.includes("2024") && (
                <Area
                  type="monotone"
                  dataKey="clients2024"
                  stroke={yearColors.clients2024}
                  fill={yearColors.clients2024}
                  fillOpacity={0.2}
                  strokeWidth={2}
                  name="clients2024"
                />
              )}
              {selectedYears.includes("2025") && (
                <Area
                  type="monotone"
                  dataKey="clients2025"
                  stroke={yearColors.clients2025}
                  fill={yearColors.clients2025}
                  fillOpacity={0.2}
                  strokeWidth={2}
                  name="clients2025"
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