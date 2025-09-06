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

export default function MobileYearComparisonSection() {
  const [view, setView] = useState<"monthly" | "annual">("annual");
  const [selectedMonth, setSelectedMonth] = useState<string>("07");
  const [selectedYears, setSelectedYears] = useState<string[]>(["2023", "2024", "2025"]);
  const [dimension, setDimension] = useState<ComparisonDimension>("vendor");
  const [selectedEntity, setSelectedEntity] = useState<string>("all");

  const vendors = useMemo(() => getVendorsFromOrders(mockOrders), []);
  const clients = useMemo(() => getClientsFromOrders(mockOrders), []);

  const { salesData } = useMemo(() => {
    return buildYearlyComparisonData(mockOrders, {
      selectedMonth,
      selectedYears,
      dimension,
      selectedId: selectedEntity,
    });
  }, [selectedMonth, selectedYears, dimension, selectedEntity]);

  const annualSummaries = useMemo(() => {
    return buildAnnualComparisonTotals(mockOrders, {
      selectedYears,
      dimension,
      selectedId: selectedEntity,
    });
  }, [selectedYears, dimension, selectedEntity]);

  const annualSalesData = annualSummaries
    .filter((s) => selectedYears.includes(s.year))
    .map((s) => ({ year: s.year, total: s.sales }));

  const currentEntities = dimension === "vendor" ? vendors : clients;

  // Monthly years with data
  const yearsToRender = selectedYears.filter((y) => {
    const key = YEAR_KEYS[y];
    return salesData.some((p: any) => (p as any)[key] && (p as any)[key] > 0);
  });

  return (
    <Card>
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="text-base">Comparación por Años</CardTitle>
            <CardDescription className="text-sm">Mensual vs Resumen Anual</CardDescription>
          </div>
          <Tabs value={view} onValueChange={(v) => setView(v as any)} className="w-auto">
            <TabsList className="h-8">
              <TabsTrigger value="monthly" className="text-xs">Mensual</TabsTrigger>
              <TabsTrigger value="annual" className="text-xs">Anual</TabsTrigger>
            </TabsList>
          </Tabs>
        </div>
      </CardHeader>
      <CardContent className="space-y-3">
        <PeriodYearSelector
          selectedMonth={selectedMonth}
          selectedYears={selectedYears}
          onMonthChange={setSelectedMonth}
          onYearToggle={(year) =>
            setSelectedYears((prev) => (prev.includes(year) ? prev.filter((y) => y !== year) : [...prev, year]))
          }
          hideMonth={view === "annual"}
        />

        <div className="grid grid-cols-1 gap-3">
          {/* Filters */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-medium">Dimensión</label>
              <Select
                value={dimension}
                onValueChange={(v) => {
                  setDimension(v as ComparisonDimension);
                  setSelectedEntity("all");
                }}
              >
                <SelectTrigger className="h-8 text-xs">
                  <SelectValue placeholder="Seleccionar dimensión" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="vendor">Vendedores</SelectItem>
                  <SelectItem value="client">Clientes</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-medium">{dimension === "vendor" ? "Vendedor" : "Cliente"}</label>
              <Select value={selectedEntity} onValueChange={setSelectedEntity}>
                <SelectTrigger className="h-8 text-xs">
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

          {/* Tabs content */}
          <Tabs value={view} onValueChange={(v) => setView(v as any)} className="w-full">
            <TabsContent value="monthly" className="space-y-2">
              <div className="h-[200px]">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={salesData} margin={{ left: 8, right: 8, top: 8 }}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="day" tick={{ fontSize: 10 }} />
                    <YAxis tick={{ fontSize: 10 }} tickFormatter={(v) => `$${Math.round((v as number) / 1000)}k`} />
                    <Tooltip formatter={(value) => [formatCurrency(Number(value)), "Ventas"]} labelFormatter={(l) => `Día ${l}`} />
                    {yearsToRender.map((y) => {
                      const key = YEAR_KEYS[y];
                      return (
                        <Area key={y} type="monotone" dataKey={key} stroke={YEAR_COLORS[key]} fill={YEAR_COLORS[key]} fillOpacity={0.25} strokeWidth={2} />
                      );
                    })}
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </TabsContent>

            <TabsContent value="annual" className="space-y-2">
              {/* KPI chips */}
              <div className="flex flex-wrap gap-2">
                {annualSalesData.map((item) => (
                  <div key={item.year} className="inline-flex items-center gap-2 px-2.5 py-1.5 rounded-md border border-border">
                    <span className="w-2 h-2 rounded-full" style={{ backgroundColor: YEAR_COLORS[YEAR_KEYS[item.year]] }} />
                    <span className="text-xs font-medium">{item.year}</span>
                    <span className="text-xs text-muted-foreground">{formatCurrency(item.total)}</span>
                  </div>
                ))}
              </div>
              <div className="h-[220px]">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={annualSalesData} margin={{ left: 8, right: 8, top: 8 }}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="year" tick={{ fontSize: 10 }} />
                    <YAxis tick={{ fontSize: 10 }} tickFormatter={(v) => `$${Math.round((v as number) / 1000000)}M`} />
                    <Tooltip formatter={(value) => [formatCurrency(Number(value)), "Ventas"]} />
                    <Bar dataKey="total" radius={[6, 6, 0, 0]}>
                      {annualSalesData.map((item) => (
                        <Cell key={item.year} fill={YEAR_COLORS[YEAR_KEYS[item.year]]} />
                      ))}
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </CardContent>
    </Card>
  );
}
