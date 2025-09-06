import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { 
  TrendingUp, 
  TrendingDown, 
  DollarSign, 
  FileText, 
  Target,
  Calendar,
  ArrowUpRight,
  ArrowDownRight
} from "lucide-react";
import { 
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
import { useState } from "react";
import MobileYearComparisonSection from "./MobileYearComparisonSection";
// Mock data optimized for mobile
const salesData = [
  { month: "Ene", ventas: 12500000, objetivo: 15000000 },
  { month: "Feb", ventas: 14200000, objetivo: 15000000 },
  { month: "Mar", ventas: 16800000, objetivo: 15000000 },
  { month: "Abr", ventas: 15200000, objetivo: 15000000 },
  { month: "May", ventas: 18500000, objetivo: 15000000 },
  { month: "Jun", ventas: 19200000, objetivo: 15000000 },
];

const performanceData = [
  { vendedor: "Carlos M.", ventas: "$ 4.2M", cumplimiento: 105 },
  { vendedor: "Ana R.", ventas: "$ 3.8M", cumplimiento: 109 },
  { vendedor: "Luis C.", ventas: "$ 3.1M", cumplimiento: 103 },
  { vendedor: "Maria S.", ventas: "$ 2.9M", cumplimiento: 97 },
];

const quotesData = [
  { name: "Presencial", value: 35, color: "hsl(var(--chart-1))" },
  { name: "Web App", value: 25, color: "hsl(var(--chart-2))" },
  { name: "WhatsApp", value: 20, color: "hsl(var(--chart-3))" },
  { name: "Email", value: 12, color: "hsl(var(--chart-4))" },
  { name: "Teléfono", value: 8, color: "hsl(var(--chart-5))" },
];

interface MobileKPICardProps {
  title: string;
  value: string;
  change: string;
  trend: "up" | "down";
  icon: React.ComponentType<any>;
  description?: string;
}

const MobileKPICard = ({ title, value, change, trend, icon: Icon, description }: MobileKPICardProps) => {
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
    <Card className={`transition-all duration-300 ${getCardStyles(title)}`}>
      <CardContent className="p-4">
        <div className="flex items-center justify-between mb-2">
          <div className={`p-2 rounded-lg ${getIconStyles(title)}`}>
            <Icon className="h-4 w-4" />
          </div>
          <div className={`flex items-center gap-1 ${trend === 'up' ? 'text-green-600' : 'text-red-600'}`}>
            {trend === 'up' ? <ArrowUpRight className="h-3 w-3" /> : <ArrowDownRight className="h-3 w-3" />}
            <span className="text-xs font-medium">{change}</span>
          </div>
        </div>
        <div>
          <CardTitle className="text-sm mb-1">{title}</CardTitle>
          <p className="font-bold text-xl mb-1">{value}</p>
          {description && (
            <p className="text-muted-foreground text-xs">{description}</p>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default function MobileAdminAnalyticsDashboard() {
  const [selectedPeriod, setSelectedPeriod] = useState("30d");

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

  return (
    <div className="space-y-4 pb-24 px-4">
      {/* Header */}
      <div className="pt-2">
        <h1 className="font-semibold mb-1 text-xl">Dashboard Ejecutivo</h1>
        <p className="text-muted-foreground text-sm">Performance y métricas clave</p>
      </div>

      {/* Period Selector */}
      <Select value={selectedPeriod} onValueChange={setSelectedPeriod}>
        <SelectTrigger className="w-full bg-background border-border">
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

      {/* KPI Cards - 2x2 Grid */}
      <div className="grid grid-cols-2 gap-3">
        <MobileKPICard
          title="Ventas"
          value={currentData.sales}
          change="+12.5%"
          trend="up"
          icon={DollarSign}
          description="vs anterior"
        />
        <MobileKPICard
          title="Crecimiento"
          value={currentData.growth}
          change="+5.2%"
          trend="up"
          icon={TrendingUp}
          description="vs período ant."
        />
        <MobileKPICard
          title="Por Cobrar"
          value={currentData.receivables}
          change="-15%"
          trend="down"
          icon={Target}
          description="pendiente"
        />
        <MobileKPICard
          title="Cotizaciones"
          value={currentData.quotes}
          change="+8.3%"
          trend="up"
          icon={FileText}
          description="este período"
        />
      </div>

      {/* Sales Trend Chart */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-base">Tendencia de Ventas</CardTitle>
          <CardDescription className="text-sm">Ventas vs Objetivo (últimos 6 meses)</CardDescription>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={200}>
            <AreaChart data={salesData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="month" tick={{fontSize: 12}} />
              <YAxis tickFormatter={(value) => `$${(value / 1000000).toFixed(1)}M`} tick={{fontSize: 12}} />
              <Tooltip 
                formatter={(value: number) => [`$${(value / 1000000).toFixed(1)}M`, value === salesData[0].ventas ? 'Ventas' : 'Objetivo']}
              />
              <Area 
                type="monotone" 
                dataKey="objetivo" 
                stroke="hsl(var(--chart-2))" 
                fill="hsl(var(--chart-2))" 
                fillOpacity={0.2}
              />
              <Area 
                type="monotone" 
                dataKey="ventas" 
                stroke="hsl(var(--chart-1))" 
                fill="hsl(var(--chart-1))" 
                fillOpacity={0.4}
              />
            </AreaChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      {/* Comparación por Años (Mobile) */}
      <MobileYearComparisonSection />

      {/* Quotes by Channel */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-base">Cotizaciones por Canal</CardTitle>
          <CardDescription className="text-sm">Distribución mensual</CardDescription>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={180}>
            <PieChart>
              <Pie
                data={quotesData}
                cx="50%"
                cy="50%"
                outerRadius={60}
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
          <div className="space-y-2 mt-3">
            {quotesData.map((item, index) => (
              <div key={index} className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div 
                    className="w-3 h-3 rounded-full" 
                    style={{ backgroundColor: item.color }}
                  />
                  <span className="text-sm">{item.name}</span>
                </div>
                <span className="font-medium text-sm">{item.value}%</span>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Performance Table - Mobile Optimized */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-base">Performance del Equipo</CardTitle>
          <CardDescription className="text-sm">Top vendedores del mes</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {performanceData.map((vendedor, index) => (
              <div key={index} className="flex items-center justify-between p-3 bg-muted/30 rounded-lg">
                <div>
                  <p className="font-medium text-sm">{vendedor.vendedor}</p>
                  <p className="text-muted-foreground text-xs">{vendedor.ventas}</p>
                </div>
                <Badge 
                  className={
                    vendedor.cumplimiento >= 100 
                      ? "bg-green-100 text-green-800 hover:bg-green-100" 
                      : "bg-red-100 text-red-800 hover:bg-red-100"
                  }
                >
                  {vendedor.cumplimiento}%
                </Badge>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}