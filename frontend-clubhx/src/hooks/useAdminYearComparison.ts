import { Order } from "@/types/order";
import { parseISO, getYear, getMonth, getDate, getDaysInMonth } from "date-fns";

export type ComparisonDimension = "vendor" | "client";

export type YearKey = "y2023" | "y2024" | "y2025";

export interface ComparisonPoint {
  day: string; // "01".."31"
  y2023?: number;
  y2024?: number;
  y2025?: number;
}

export interface BuildParams {
  selectedMonth: string; // "01".."12"
  selectedYears: string[]; // ["2023", ...]
  dimension: ComparisonDimension;
  selectedId: string; // "all" | vendorId | customer (name or id)
}

export interface BuiltComparisonData {
  salesData: ComparisonPoint[];
  clientsData: ComparisonPoint[];
}

export const getVendorsFromOrders = (orders: Order[]) => {
  const set = new Set<string>();
  orders.forEach(o => o.vendorId && set.add(o.vendorId));
  return Array.from(set).sort();
};

export const getClientsFromOrders = (orders: Order[]) => {
  const set = new Set<string>();
  orders.forEach(o => o.customer && set.add(o.customer));
  return Array.from(set).sort();
};

export function buildYearlyComparisonData(
  orders: Order[],
  { selectedMonth, selectedYears, dimension, selectedId }: BuildParams
): BuiltComparisonData {
  const monthIdx = Math.max(0, Math.min(11, Number(selectedMonth) - 1));

  // Determine which years to include and build mapping to keys
  const years: number[] = selectedYears
    .map(y => Number(y))
    .filter(y => y >= 2000 && y <= 2100)
    .sort();

  // Pre-filter orders by dimension/entity and month
  const relevantOrders = orders.filter(o => {
    try {
      const d = parseISO(o.date);
      const m = getMonth(d);
      const matchMonth = m === monthIdx;
      if (!matchMonth) return false;

      if (dimension === "vendor") {
        if (selectedId === "all") return true;
        return o.vendorId === selectedId;
      }
      // client
      if (selectedId === "all") return true;
      return (o.customer === selectedId || o.customerId === selectedId);
    } catch {
      return false;
    }
  });

  // Build a map: year -> day -> { sales, clientsSet }
  type DayAgg = { sales: number; clients: Set<string> };
  const byYearDay = new Map<number, Map<number, DayAgg>>();

  relevantOrders.forEach(o => {
    try {
      const d = parseISO(o.date);
      const y = getYear(d);
      const m = getMonth(d);
      if (m !== monthIdx) return;
      const day = getDate(d);

      if (!byYearDay.has(y)) byYearDay.set(y, new Map());
      const dayMap = byYearDay.get(y)!;
      if (!dayMap.has(day)) dayMap.set(day, { sales: 0, clients: new Set() });
      const agg = dayMap.get(day)!;

      agg.sales += o.total || 0;
      // unique client by name/id if available
      const clientKey = o.customerId || o.customer || "unknown";
      agg.clients.add(clientKey);
    } catch {
      // ignore
    }
  });

  // Determine max days for the selected month (use current year as reference)
  const refYear = years[0] || new Date().getFullYear();
  const daysInMonth = getDaysInMonth(new Date(refYear, monthIdx, 1));

  const salesData: ComparisonPoint[] = [];
  const clientsData: ComparisonPoint[] = [];

  for (let day = 1; day <= daysInMonth; day++) {
    const pointSales: ComparisonPoint = { day: String(day).padStart(2, "0") };
    const pointClients: ComparisonPoint = { day: String(day).padStart(2, "0") };

    years.forEach(y => {
      const dayMap = byYearDay.get(y);
      const agg = dayMap?.get(day);
      const key = ("y" + y) as YearKey;
      if (agg) {
        pointSales[key] = agg.sales;
        pointClients[key] = agg.clients.size;
      } else {
        pointSales[key] = 0;
        pointClients[key] = 0;
      }
    });

    salesData.push(pointSales);
    clientsData.push(pointClients);
  }

  return { salesData, clientsData };
}

export interface AnnualYearSummary {
  year: string;
  sales: number;
  clients: number;
}

export function buildAnnualComparisonTotals(
  orders: Order[],
  {
    selectedYears,
    dimension,
    selectedId,
  }: { selectedYears: string[]; dimension: ComparisonDimension; selectedId: string }
): AnnualYearSummary[] {
  const years = selectedYears
    .map((y) => Number(y))
    .filter((y) => y >= 2000 && y <= 2100)
    .sort();

  type YearAgg = { sales: number; clients: Set<string> };
  const byYear = new Map<number, YearAgg>();

  orders.forEach((o) => {
    try {
      const d = parseISO(o.date);
      const y = getYear(d);
      if (!years.includes(y)) return;

      if (dimension === "vendor") {
        if (!(selectedId === "all" || o.vendorId === selectedId)) return;
      } else {
        if (!(selectedId === "all" || o.customer === selectedId || o.customerId === selectedId)) return;
      }

      if (!byYear.has(y)) byYear.set(y, { sales: 0, clients: new Set() });
      const agg = byYear.get(y)!;
      agg.sales += o.total || 0;
      const clientKey = o.customerId || o.customer || "unknown";
      agg.clients.add(clientKey);
    } catch {
      // ignore bad rows
    }
  });

  const result: AnnualYearSummary[] = years.map((y) => {
    const agg = byYear.get(y);
    return {
      year: String(y),
      sales: agg?.sales ?? 0,
      clients: agg?.clients.size ?? 0,
    };
  });

  return result;
}
