import React, { useMemo, useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
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
  YearKey,
} from "@/hooks/useAdminYearComparison";
import { useAuth } from "@/contexts/AuthContext";
const vendors: any[] = [];

interface VendorYearComparisonSectionProps {
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

export default function VendorYearComparisonSection({ className }: VendorYearComparisonSectionProps) {
  const { user } = useAuth();
  const currentVendor = vendors.find((v) => v.email === user?.email);
  const vendorId = currentVendor?.id ?? "";

  const [view, setView] = useState<"monthly" | "annual">("monthly");
  const [selectedMonth, setSelectedMonth] = useState<string>("07");
  const [selectedYears, setSelectedYears] = useState<string[]>(["2023", "2024", "2025"]);

  const { salesData, clientsData } = useMemo(() => {
    return buildYearlyComparisonData(mockOrders, {
      selectedMonth,
      selectedYears,
      dimension: "vendor",
      selectedId: vendorId || "all",
    });
  }, [selectedMonth, selectedYears, vendorId]);

  const annualSummaries = useMemo(() => {
    return buildAnnualComparisonTotals(mockOrders, {
      selectedYears,
      dimension: "vendor",
      selectedId: vendorId || "all",
    });
  }, [selectedYears, vendorId]);

  const annualSalesData = annualSummaries
    .filter((s) => selectedYears.includes(s.year))
    .map((s) => ({ year: s.year, total: s.sales }));

  const yearsToRender = selectedYears.filter((y) => {
    const key = YEAR_KEYS[y];
    return salesData.some((p: any) => (p as any)[key] && (p as any)[key] > 0);
  });

  if (!vendorId) {
    return (
      <Card className={className}>
        <CardHeader>
          <CardTitle>Comparación por Años</CardTitle>
          <CardDescription>No se encontró el vendedor actual.</CardDescription>
        </CardHeader>
      </Card>
    );
  }

  return (
    <Card className={className}>
      <CardHeader>
        <div className="flex items-center justify-between gap-4 flex-wrap">
          <div>
            <CardTitle>Comparación por Años</CardTitle>
            <CardDescription>Vista mensual y resumen anual de tus ventas</CardDescription>
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
        <PeriodYearSelector
          selectedMonth={selectedMonth}
          selectedYears={selectedYears}
          onMonthChange={setSelectedMonth}
          onYearToggle={(year) =>
            setSelectedYears((prev) => (prev.includes(year) ? prev.filter((y) => y !== year) : [...prev, year]))
          }
          hideMonth={view === "annual"}
        />

        <Tabs value={view} onValueChange={(v) => setView(v as any)} className="w-full">
          <TabsContent value="monthly" className="space-y-2">
            <Card className="border-border bg-card">
              <CardHeader className="pb-2">
                <CardTitle className="text-base">Ventas ($) - Comparación por Años</CardTitle>
                <CardDescription>Mes {selectedMonth} · CLP</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-[300px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={salesData} margin={{ left: 8, right: 8, top: 8 }}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="day" tick={{ fontSize: 12 }} />
                      <YAxis tick={{ fontSize: 12 }} tickFormatter={(v) => `$${Math.round((v as number) / 1000)}k`} />
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

            <Card className="border-border bg-card">
              <CardHeader className="pb-2">
                <CardTitle className="text-base">Clientes Activos - Comparación por Años</CardTitle>
                <CardDescription>Mes {selectedMonth} · Clientes únicos por día</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-[300px]">
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
          </TabsContent>

          <TabsContent value="annual" className="space-y-4">
            <div className="flex flex-wrap gap-2">
              {annualSalesData.map((item) => (
                <div key={item.year} className="inline-flex items-center gap-2 px-3 py-2 rounded-md border border-border">
                  <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: YEAR_COLORS[YEAR_KEYS[item.year]] }} />
                  <span className="text-sm font-medium">{item.year}</span>
                  <span className="text-sm text-muted-foreground">{formatCurrency(item.total)}</span>
                </div>
              ))}
            </div>

            <Card className="border-border bg-card">
              <CardHeader className="pb-2">
                <CardTitle className="text-base">Ventas Totales por Año</CardTitle>
                <CardDescription>Totales anuales · CLP</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-[320px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={annualSalesData} margin={{ left: 8, right: 8, top: 8 }}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="year" tick={{ fontSize: 12 }} />
                      <YAxis tick={{ fontSize: 12 }} tickFormatter={(v) => `$${Math.round((v as number) / 1000000)}M`} />
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
