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

export default function VendorMobileYearComparisonSection() {
  const { user } = useAuth();
  const currentVendor = vendors.find((v) => v.email === user?.email);
  const vendorId = currentVendor?.id ?? "";

  const [view, setView] = useState<"monthly" | "annual">("annual");
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
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-base">Comparación por Años</CardTitle>
          <CardDescription className="text-sm">No se encontró el vendedor actual.</CardDescription>
        </CardHeader>
      </Card>
    );
  }

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

            <div className="h-[200px]">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={clientsData} margin={{ left: 8, right: 8, top: 8 }}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="day" tick={{ fontSize: 10 }} />
                  <YAxis tick={{ fontSize: 10 }} allowDecimals={false} />
                  <Tooltip formatter={(value) => [Number(value).toString(), "Clientes"]} labelFormatter={(l) => `Día ${l}`} />
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
      </CardContent>
    </Card>
  );
}
