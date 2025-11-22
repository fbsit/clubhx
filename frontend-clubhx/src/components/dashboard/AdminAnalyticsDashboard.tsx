import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { 
  TrendingUp, 
  TrendingDown, 
  DollarSign, 
  Users, 
  FileText, 
  Target,
  ShoppingCart,
  BarChart3,
  Calendar,
  ArrowUpRight,
  ArrowDownRight
} from "lucide-react";
import { 
  LineChart, 
  Line, 
  AreaChart, 
  Area, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell
} from "recharts";
import { useIsMobile } from "@/hooks/use-mobile";
import { useEffect, useState } from "react";
import { getDashboardMetrics } from "@/services/dashboardApi";
import { formatCurrency } from "@/components/dashboard/dashboardUtils";

// Placeholder empty arrays (remove mocks)
const salesData: Array<{ month: string; ventas: number; objetivo: number }> = [];
const performanceData: Array<{ vendedor: string; ventas: string; objetivo: string; cumplimiento: number; clientes: number }> = [];
const quotesData: Array<{ name: string; value: number; color: string }> = [];

interface KPICardProps {
  title: string;
  value: string;
  change: string;
  trend: "up" | "down";
  icon: React.ComponentType<any>;
  description?: string;
  isMobile: boolean;
  loading?: boolean;
}

const KPICard = ({ title, value, change, trend, icon: Icon, description, isMobile, loading }: KPICardProps) => {
  const getCardStyles = (title: string) => {
    const styles = {
      "Ventas del Mes": "bg-card/50 border-border hover:shadow-lg",
      "Crecimiento": "bg-card/50 border-border hover:shadow-lg", 
      "Por Cobrar": "bg-card/50 border-border hover:shadow-lg",
      "Cotizaciones": "bg-card/50 border-border hover:shadow-lg"
    };
    return styles[title as keyof typeof styles] || "bg-card/50 border-border hover:shadow-lg";
  };

  const getIconStyles = (title: string) => {
    const styles = {
      "Ventas del Mes": "bg-primary/10 text-primary",
      "Crecimiento": "bg-secondary/10 text-secondary-foreground",
      "Por Cobrar": "bg-accent/10 text-accent-foreground", 
      "Cotizaciones": "bg-muted/10 text-muted-foreground"
    };
    return styles[title as keyof typeof styles] || "bg-primary/10 text-primary";
  };

  return (
    <Card className={`hover:shadow-lg transition-all duration-300 ${getCardStyles(title)}`}>
      <CardHeader className={`${isMobile ? 'pb-3 px-4 pt-4' : 'pb-2'}`}>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className={`p-2 rounded-lg ${getIconStyles(title)}`}>
              <Icon className="h-4 w-4" />
            </div>
            <CardTitle className={`${isMobile ? 'text-sm' : 'text-base'}`}>{title}</CardTitle>
          </div>
          {!loading && (
            <div className={`flex items-center gap-1 ${trend === 'up' ? 'text-green-600' : 'text-red-600'}`}>
              {trend === 'up' ? <ArrowUpRight className="h-3 w-3" /> : <ArrowDownRight className="h-3 w-3" />}
              <span className="text-xs font-medium">{change}</span>
            </div>
          )}
        </div>
      </CardHeader>
      <CardContent className={isMobile ? 'px-4 pb-4' : ''}>
        {loading ? (
          <div className="h-6 w-20 rounded bg-muted animate-pulse" />
        ) : (
          <p className={`font-bold ${isMobile ? 'text-xl mb-1' : 'text-2xl mb-2'}`}>{value}</p>
        )}
        {description && (
          <p className={`text-muted-foreground ${isMobile ? 'text-xs' : 'text-sm'}`}>{description}</p>
        )}
      </CardContent>
    </Card>
  );
};

import MobileAdminAnalyticsDashboard from "./MobileAdminAnalyticsDashboard";
import { AdminYearComparisonSection } from "./AdminYearComparisonSection";

export default function AdminAnalyticsDashboard() {
  const isMobile = useIsMobile();
  const [selectedPeriod, setSelectedPeriod] = useState("30d");
  const [metricsLoading, setMetricsLoading] = useState(false);
  const [metricsError, setMetricsError] = useState<string | null>(null);
  const [metrics, setMetrics] = useState<{ totalOrders: number; totalSales: number; pendingPayments: number; upcomingEvents: number } | null>(null);

  useEffect(() => {
    const mapPeriod = (p: string): 'day' | 'week' | 'month' => {
      if (p === '7d') return 'week';
      return 'month';
    };
    const load = async () => {
      try {
        setMetricsLoading(true);
        setMetricsError(null);
        const data = await getDashboardMetrics(mapPeriod(selectedPeriod));
        setMetrics({
          totalOrders: data.totalOrders ?? 0,
          totalSales: data.totalSales ?? 0,
          pendingPayments: data.pendingPayments ?? 0,
          upcomingEvents: data.upcomingEvents ?? 0,
        });
      } catch (e) {
        setMetricsError('No se pudieron cargar las métricas');
        setMetrics(null);
      } finally {
        setMetricsLoading(false);
      }
    };
    void load();
  }, [selectedPeriod]);

  // Use mobile-specific component for mobile devices
  if (isMobile) {
    return <MobileAdminAnalyticsDashboard />;
  }

  const getPeriodData = (period: string) => {
    const periodData = {
      "7d": {
        title: "Últimos 7 días",
        sales: "$2.8M",
        growth: "15%",
        receivables: "$1.2M",
        quotes: "28"
      },
      "30d": {
        title: "Últimos 30 días", 
        sales: "$19.2M",
        growth: "28%",
        receivables: "$8.4M",
        quotes: "156"
      },
      "90d": {
        title: "Últimos 3 meses",
        sales: "$54.8M", 
        growth: "32%",
        receivables: "$22.1M",
        quotes: "412"
      },
      "1y": {
        title: "Último año",
        sales: "$198.5M",
        growth: "18%", 
        receivables: "$45.2M",
        quotes: "1,580"
      }
    };
    return periodData[period as keyof typeof periodData] || periodData["30d"];
  };

  const currentData = getPeriodData(selectedPeriod);
  const ventasDelMes = metrics ? formatCurrency(Number.isFinite(metrics.totalSales) ? metrics.totalSales : 0) : currentData.sales;
  const cotizaciones = metrics ? String(metrics.totalOrders) : currentData.quotes;
  const porCobrar = metrics ? String(metrics.pendingPayments) : currentData.receivables;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-row items-center justify-between">
        <div>
          <h1 className="font-semibold mb-1 text-3xl">
            Dashboard Ejecutivo
          </h1>
          <p className="text-muted-foreground">
            Resumen de performance y métricas clave
          </p>
        </div>
        
        {/* Period Selector */}
        <Select value={selectedPeriod} onValueChange={setSelectedPeriod}>
          <SelectTrigger className="w-[180px] bg-background border-border">
            <Calendar className="h-4 w-4 mr-2" />
            <SelectValue placeholder="Seleccionar período" />
          </SelectTrigger>
          <SelectContent className="bg-background border-border z-50">
            <SelectItem value="7d">Últimos 7 días</SelectItem>
            <SelectItem value="30d">Últimos 30 días</SelectItem>
            <SelectItem value="90d">Últimos 3 meses</SelectItem>
            <SelectItem value="1y">Último año</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* KPI Cards */}
      <div className={`grid gap-4 ${
        isMobile 
          ? 'grid-cols-1 px-4' 
          : 'grid-cols-1 md:grid-cols-2 lg:grid-cols-4'
      }`}>
        <KPICard
          title="Ventas del Mes"
          value={ventasDelMes}
          change="+12.5%"
          trend="up"
          icon={DollarSign}
          description="vs mes anterior"
          isMobile={isMobile}
          loading={metricsLoading}
        />
        <KPICard
          title="Crecimiento"
          value={currentData.growth}
          change="+5.2%"
          trend="up"
          icon={TrendingUp}
          description="vs mismo período anterior"
          isMobile={isMobile}
          loading={metricsLoading}
        />
        <KPICard
          title="Por Cobrar"
          value={porCobrar}
          change="-15%"
          trend="down"
          icon={Target}
          description={metrics ? "pendiente(s)" : "pendiente de cobro"}
          isMobile={isMobile}
          loading={metricsLoading}
        />
        <KPICard
          title="Cotizaciones"
          value={cotizaciones}
          change="+8.3%"
          trend="up"
          icon={FileText}
          description="este mes"
          isMobile={isMobile}
          loading={metricsLoading}
        />
      </div>

      {/* Charts Section */}
      <div className={`grid gap-4 ${
        isMobile 
          ? 'grid-cols-1 px-4' 
          : 'grid-cols-1 lg:grid-cols-3'
      }`}>
        {/* Comparación por Años (Ventas & Clientes) */}
        <AdminYearComparisonSection className="lg:col-span-2" />

        {/* Quotes by Channel */}
        <Card>
          <CardHeader className={isMobile ? 'pb-3 px-4 pt-4' : ''}>
            <CardTitle className={isMobile ? 'text-base' : 'text-lg'}>Cotizaciones por Canal</CardTitle>
            <CardDescription>Distribución mensual</CardDescription>
          </CardHeader>
          <CardContent className={isMobile ? 'px-4 pb-4' : ''}>
            <ResponsiveContainer width="100%" height={isMobile ? 200 : 250}>
              <PieChart>
                <Pie
                  data={quotesData}
                  cx="50%"
                  cy="50%"
                  outerRadius={isMobile ? 60 : 80}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {quotesData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip formatter={(value) => [`${value}%`, 'Porcentaje']} />
              </PieChart>
            </ResponsiveContainer>
            <div className="space-y-2 mt-4">
              {quotesData.map((item, index) => (
                <div key={index} className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div 
                      className="w-3 h-3 rounded-full" 
                      style={{ backgroundColor: item.color }}
                    />
                    <span className={`${isMobile ? 'text-sm' : ''}`}>{item.name}</span>
                  </div>
                  <span className={`font-medium ${isMobile ? 'text-sm' : ''}`}>{item.value}%</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Performance Table */}
      <div className={isMobile ? 'px-4' : ''}>
        <Card>
          <CardHeader className={isMobile ? 'pb-3 px-4 pt-4' : ''}>
            <CardTitle className={isMobile ? 'text-base' : 'text-lg'}>Performance del Equipo de Ventas</CardTitle>
            <CardDescription>Resultados mensuales por vendedor</CardDescription>
          </CardHeader>
          <CardContent className={isMobile ? 'px-4 pb-4' : ''}>
            <div className="rounded-md border overflow-hidden">
              <div className={isMobile ? 'overflow-x-auto' : ''}>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead className={isMobile ? 'min-w-[120px]' : ''}>Vendedor</TableHead>
                      <TableHead className={isMobile ? 'min-w-[80px]' : ''}>Ventas</TableHead>
                      <TableHead className={isMobile ? 'min-w-[80px]' : ''}>Objetivo</TableHead>
                      <TableHead className={isMobile ? 'min-w-[100px]' : ''}>Cumplimiento</TableHead>
                      <TableHead className={isMobile ? 'min-w-[80px]' : ''}>Clientes</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {performanceData.map((vendedor, index) => (
                      <TableRow key={index}>
                        <TableCell className="font-medium">{vendedor.vendedor}</TableCell>
                        <TableCell>{vendedor.ventas}</TableCell>
                        <TableCell>{vendedor.objetivo}</TableCell>
                        <TableCell>
                          <Badge 
                            className={
                              vendedor.cumplimiento >= 100 
                                ? "bg-green-100 text-green-800 hover:bg-green-100" 
                                : "bg-red-100 text-red-800 hover:bg-red-100"
                            }
                          >
                            {vendedor.cumplimiento}%
                          </Badge>
                        </TableCell>
                        <TableCell>{vendedor.clientes}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}