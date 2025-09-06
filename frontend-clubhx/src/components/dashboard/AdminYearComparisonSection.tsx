import React, { useMemo, useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { PeriodYearSelector } from "./PeriodYearSelector";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  BarChart,
  Bar,
  Cell,
} from "recharts";
const mockOrders: any[] = [];
import { formatCurrency } from "@/components/dashboard/dashboardUtils";
import {
  buildYearlyComparisonData,
  buildAnnualComparisonTotals,
  getVendorsFromOrders,
  getClientsFromOrders,
  ComparisonDimension,
  YearKey,
} from "@/hooks/useAdminYearComparison";

interface AdminYearComparisonSectionProps {
  className?: string;
}

const YEAR_KEYS: Record<string, YearKey> = {
  "2023": "y2023",
  "2024": "y2024",
  "2025": "y2025",
};

const YEAR_COLORS: Record<YearKey, string> = {
  y2023: "hsl(var(--chart-1))",
  y2024: "hsl(var(--chart-2))",
  y2025: "hsl(var(--chart-3))",
};

export function AdminYearComparisonSection({ className }: AdminYearComparisonSectionProps) {
  const [view, setView] = useState<"monthly" | "annual">("monthly");
  const [selectedMonth, setSelectedMonth] = useState<string>("07");
  const [selectedYears, setSelectedYears] = useState<string[]>(["2023", "2024", "2025"]);
  const [dimension, setDimension] = useState<ComparisonDimension>("vendor");
  const [selectedEntity, setSelectedEntity] = useState<string>("all");

  const vendors = useMemo(() => getVendorsFromOrders(mockOrders), []);
  const clients = useMemo(() => getClientsFromOrders(mockOrders), []);

  // Monthly (day-level) comparison
  const { salesData, clientsData } = useMemo(() => {
    return buildYearlyComparisonData(mockOrders, {
      selectedMonth,
      selectedYears,
      dimension,
      selectedId: selectedEntity,
    });
  }, [selectedMonth, selectedYears, dimension, selectedEntity]);

  // Annual totals by year
  const annualSummaries = useMemo(() => {
    return buildAnnualComparisonTotals(mockOrders, {
      selectedYears,
      dimension,
      selectedId: selectedEntity,
    });
  }, [selectedYears, dimension, selectedEntity]);

  // Detect years with no data for the current month/filter
  const emptyYears = useMemo(() => {
    const totalFor = (key: YearKey) =>
      salesData.reduce((acc, p) => acc + (p[key] || 0), 0) +
      clientsData.reduce((acc, p) => acc + (p[key] || 0), 0);
    return selectedYears.filter((y) => {
      const key = YEAR_KEYS[y];
      return totalFor(key) === 0;
    });
  }, [salesData, clientsData, selectedYears]);

  const yearsToRender = selectedYears.filter((y) => !emptyYears.includes(y));
  const currentEntities = dimension === "vendor" ? vendors : clients;

  const annualSalesData = annualSummaries
    .filter((s) => selectedYears.includes(s.year))
    .map((s) => ({ year: s.year, total: s.sales }));

  return (
    <Card className={className}>
      <CardHeader>
        <div className="flex items-center justify-between gap-4 flex-wrap">
          <div>
            <CardTitle>Comparación por Años</CardTitle>
            <CardDescription>
              Vista mensual y resumen anual de ventas; filtra por años y dimensión.
            </CardDescription>
          </div>
          <Tabs value={view} onValueChange={(v) => setView(v as any)} className="w-auto">
            <TabsList>
              <TabsTrigger value="monthly">Mensual</TabsTrigger>
              <TabsTrigger value="annual">Anual</TabsTrigger>
            </TabsList>
          </Tabs>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Controls */}
        <div className="space-y-4">
          <PeriodYearSelector
            selectedMonth={selectedMonth}
            selectedYears={selectedYears}
            onMonthChange={setSelectedMonth}
            onYearToggle={(year) =>
              setSelectedYears((prev) =>
                prev.includes(year) ? prev.filter((y) => y !== year) : [...prev, year]
              )
            }
            hideMonth={view === "annual"}
          />

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="flex flex-col gap-2">
              <label className="text-sm font-medium">Dimensión</label>
              <Select
                value={dimension}
                onValueChange={(v) => {
                  setDimension(v as ComparisonDimension);
                  setSelectedEntity("all");
                }}
              >
                <SelectTrigger className="w-full md:w-[220px]">
                  <SelectValue placeholder="Seleccionar dimensión" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="vendor">Vendedores</SelectItem>
                  <SelectItem value="client">Clientes</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="flex flex-col gap-2">
              <label className="text-sm font-medium">
                {dimension === "vendor" ? "Vendedor" : "Cliente"}
              </label>
              <Select value={selectedEntity} onValueChange={setSelectedEntity}>
                <SelectTrigger className="w-full md:w-[280px]">
                  <SelectValue placeholder="Filtrar" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Todos</SelectItem>
                  {currentEntities.map((idOrName) => (
                    <SelectItem key={idOrName} value={idOrName}>
                      {idOrName}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
        </div>

        {/* Monthly view */}
        <Tabs value={view} onValueChange={(v) => setView(v as any)} className="w-full">
          <TabsContent value="monthly" className="space-y-2">
            {emptyYears.length > 0 && (
              <p className="text-sm text-muted-foreground">
                Sin datos para: {emptyYears.join(", ")} (mes/filtro actual)
              </p>
            )}

            <div className="grid grid-cols-1 xl:grid-cols-2 gap-4">
              {/* Ventas */}
              <Card className="border-border bg-card">
                <CardHeader className="pb-2">
                  <CardTitle className="text-base">Ventas ($) - Comparación por Años</CardTitle>
                  <CardDescription>Mes {selectedMonth} · Valores en CLP</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="h-[280px]">
                    <ResponsiveContainer width="100%" height="100%">
                      <AreaChart data={salesData} margin={{ left: 8, right: 8, top: 8 }}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="day" tick={{ fontSize: 12 }} />
                        <YAxis
                          tick={{ fontSize: 12 }}
                          tickFormatter={(v) =>
                            `$${Math.round((v as number) / 1000).toLocaleString("es-CL")}k`
                          }
                        />
                        <Tooltip
                          formatter={(value, name) => {
                            const year = name.toString().slice(1);
                            return [formatCurrency(Number(value)), `Año ${year}`];
                          }}
                          labelFormatter={(label) => `Día ${label}`}
                        />
                        {yearsToRender.map((y) => {
                          const key = YEAR_KEYS[y];
                          return (
                            <Area
                              key={y}
                              type="monotone"
                              dataKey={key}
                              stroke={YEAR_COLORS[key]}
                              fill={YEAR_COLORS[key]}
                              fillOpacity={0.25}
                              strokeWidth={2}
                            />
                          );
                        })}
                      </AreaChart>
                    </ResponsiveContainer>
                  </div>
                </CardContent>
              </Card>

              {/* Clientes */}
              <Card className="border-border bg-card">
                <CardHeader className="pb-2">
                  <CardTitle className="text-base">Clientes Activos - Comparación por Años</CardTitle>
                  <CardDescription>Mes {selectedMonth} · Clientes únicos por día</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="h-[280px]">
                    <ResponsiveContainer width="100%" height="100%">
                      <AreaChart data={clientsData} margin={{ left: 8, right: 8, top: 8 }}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="day" tick={{ fontSize: 12 }} />
                        <YAxis tick={{ fontSize: 12 }} allowDecimals={false} />
                        <Tooltip
                          formatter={(value, name) => {
                            const year = name.toString().slice(1);
                            return [Number(value).toString(), `Año ${year}`];
                          }}
                          labelFormatter={(label) => `Día ${label}`}
                        />
                        {yearsToRender.map((y) => {
                          const key = YEAR_KEYS[y];
                          return (
                            <Area
                              key={y}
                              type="monotone"
                              dataKey={key}
                              stroke={YEAR_COLORS[key]}
                              fill={YEAR_COLORS[key]}
                              fillOpacity={0.25}
                              strokeWidth={2}
                            />
                          );
                        })}
                      </AreaChart>
                    </ResponsiveContainer>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* Annual view */}
          <TabsContent value="annual" className="space-y-4">
            {/* KPI chips */}
            <div className="flex flex-wrap gap-2">
              {annualSalesData.map((item) => {
                const color = YEAR_COLORS[YEAR_KEYS[item.year]];
                return (
                  <div key={item.year} className="inline-flex items-center gap-2 px-3 py-2 rounded-md border border-border">
                    <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: color }} />
                    <span className="text-sm font-medium">{item.year}</span>
                    <span className="text-sm text-muted-foreground">{formatCurrency(item.total)}</span>
                  </div>
                );
              })}
            </div>

            {/* Sales by Year */}
            <Card className="border-border bg-card">
              <CardHeader className="pb-2">
                <CardTitle className="text-base">Ventas Totales por Año</CardTitle>
                <CardDescription>Totales anuales · CLP</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-[300px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={annualSalesData} margin={{ left: 8, right: 8, top: 8 }}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="year" tick={{ fontSize: 12 }} />
                      <YAxis
                        tick={{ fontSize: 12 }}
                        tickFormatter={(v) =>
                          `$${Math.round((v as number) / 1000000).toLocaleString("es-CL")}M`
                        }
                      />
                      <Tooltip formatter={(value) => [formatCurrency(Number(value)), "Ventas"]} />
                      <Bar dataKey="total" radius={[6, 6, 0, 0]}>
                        {annualSalesData.map((item) => (
                          <Cell key={item.year} fill={YEAR_COLORS[YEAR_KEYS[item.year]]} />
                        ))}
                      </Bar>
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
}
