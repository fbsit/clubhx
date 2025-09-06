
import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useAuth } from "@/contexts/AuthContext";
import { TrendingUp, TrendingDown, Users, Package, DollarSign, Target, Calendar, Award } from "lucide-react";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar, PieChart, Pie, Cell } from "recharts";
import { salesAnalyticsApi, type SalesDashboardData, type MonthlySalesData, type CategorySalesData, type TopCustomer } from "@/services/salesAnalyticsApi";
import { toast } from "sonner";

const COLORS = ['#8884d8', '#82ca9d', '#ffc658', '#ff7300'];

export default function SalesAnalytics() {
  const { user } = useAuth();
  const [dashboardData, setDashboardData] = useState<SalesDashboardData | null>(null);
  const [monthlyData, setMonthlyData] = useState<MonthlySalesData | null>(null);
  const [categoryData, setCategoryData] = useState<CategorySalesData | null>(null);
  const [topCustomers, setTopCustomers] = useState<TopCustomer[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        setError(null);
        
        const [dashboard, monthly, category, customers] = await Promise.all([
          salesAnalyticsApi.getDashboard(),
          salesAnalyticsApi.getMonthlySales(),
          salesAnalyticsApi.getCategorySales(),
          salesAnalyticsApi.getTopCustomers(5)
        ]);

        setDashboardData(dashboard);
        setMonthlyData(monthly);
        setCategoryData(category);
        setTopCustomers(customers.customers);
      } catch (err: any) {
        setError(err?.message || 'Error cargando datos de analytics');
        toast.error('Error cargando analytics', { description: err?.message });
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  if (loading) {
    return (
      <div className="container max-w-7xl py-6 animate-enter space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold">Analítica de Ventas</h1>
            <p className="text-muted-foreground">Panel de control para {user?.name}</p>
          </div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          {[...Array(4)].map((_, i) => (
            <Card key={i}>
              <CardHeader className="pb-2">
                <div className="h-5 w-32 bg-muted animate-pulse rounded" />
              </CardHeader>
              <CardContent>
                <div className="h-8 w-24 bg-muted animate-pulse rounded mb-2" />
                <div className="h-4 w-20 bg-muted animate-pulse rounded" />
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container max-w-7xl py-6 animate-enter space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold">Analítica de Ventas</h1>
            <p className="text-muted-foreground">Panel de control para {user?.name}</p>
          </div>
        </div>
        <Card>
          <CardContent className="p-6">
            <p className="text-center text-muted-foreground">{error}</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  const ventasMensuales = monthlyData?.monthlyData.map(item => ({
    mes: item.month,
    ventas: item.sales,
    meta: item.goal,
    clientes: item.customers
  })) || [];

  const ventasPorCategoria = categoryData?.categories.map(item => ({
    categoria: item.name,
    ventas: item.sales,
    porcentaje: item.percentage
  })) || [];

  const topClientes = topCustomers.map(customer => ({
    nombre: customer.name,
    ventas: customer.sales,
    pedidos: customer.orders,
    crecimiento: customer.growth
  }));
  
  return (
    <div className="container max-w-7xl py-6 animate-enter space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Analítica de Ventas</h1>
          <p className="text-muted-foreground">Panel de control para {user?.name}</p>
        </div>
        <Card className="bg-muted/30">
          <CardContent className="p-3">
            <p className="text-sm font-medium">Período: Mayo 2024</p>
          </CardContent>
        </Card>
      </div>
      
      {/* KPIs Principales */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-lg flex items-center gap-2">
              <DollarSign className="h-5 w-5 text-green-600" />
              Ventas del Mes
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold">$5,438,250</p>
            <p className="text-sm text-green-600 flex items-center gap-1">
              <TrendingUp className="h-4 w-4" />
              +21% vs meta (+$938,250)
            </p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-lg flex items-center gap-2">
              <Target className="h-5 w-5 text-blue-600" />
              Cumplimiento Meta
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold">121%</p>
            <p className="text-sm text-blue-600">Meta: $4,500,000</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-lg flex items-center gap-2">
              <Users className="h-5 w-5 text-purple-600" />
              Clientes Activos
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold">45</p>
            <p className="text-sm text-purple-600">+3 nuevos este mes</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-lg flex items-center gap-2">
              <Package className="h-5 w-5 text-orange-600" />
              Ticket Promedio
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold">$120,850</p>
            <p className="text-sm text-orange-600">+5% vs mes anterior</p>
          </CardContent>
        </Card>
      </div>

      {/* Gráficos */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Evolución de Ventas vs Meta</CardTitle>
            <CardDescription>Comparación mensual del rendimiento</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={ventasMensuales}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="mes" />
                <YAxis tickFormatter={(value) => `$${(value / 1000000).toFixed(1)}M`} />
                <Tooltip formatter={(value) => [`$${value.toLocaleString()}`, '']} />
                <Line type="monotone" dataKey="ventas" stroke="#8884d8" strokeWidth={3} name="Ventas Reales" />
                <Line type="monotone" dataKey="meta" stroke="#82ca9d" strokeWidth={2} strokeDasharray="5 5" name="Meta" />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Ventas por Categoría</CardTitle>
            <CardDescription>Distribución de ventas por tipo de producto</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={ventasPorCategoria}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={120}
                  paddingAngle={5}
                  dataKey="ventas"
                >
                  {ventasPorCategoria.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip formatter={(value) => [`$${value.toLocaleString()}`, '']} />
              </PieChart>
            </ResponsiveContainer>
            <div className="grid grid-cols-2 gap-2 mt-4">
              {ventasPorCategoria.map((item, index) => (
                <div key={item.categoria} className="flex items-center gap-2">
                  <div 
                    className="w-3 h-3 rounded-full" 
                    style={{ backgroundColor: COLORS[index % COLORS.length] }}
                  />
                  <span className="text-sm">{item.categoria}: {item.porcentaje}%</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Top Clientes */}
      <Card>
        <CardHeader>
          <CardTitle>Top 5 Clientes del Mes</CardTitle>
          <CardDescription>Clientes con mayor volumen de compras</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {topClientes.map((cliente, index) => (
              <div key={cliente.nombre} className="flex items-center justify-between p-4 border rounded-lg">
                <div className="flex items-center gap-4">
                  <div className="flex items-center justify-center w-8 h-8 bg-primary/10 rounded-full">
                    <span className="text-sm font-medium">#{index + 1}</span>
                  </div>
                  <div>
                    <p className="font-medium">{cliente.nombre}</p>
                    <p className="text-sm text-muted-foreground">{cliente.pedidos} pedidos</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="font-bold">${cliente.ventas.toLocaleString()}</p>
                  <p className={`text-sm flex items-center gap-1 ${
                    cliente.crecimiento >= 0 ? 'text-green-600' : 'text-red-600'
                  }`}>
                    {cliente.crecimiento >= 0 ? (
                      <TrendingUp className="h-3 w-3" />
                    ) : (
                      <TrendingDown className="h-3 w-3" />
                    )}
                    {cliente.crecimiento > 0 ? '+' : ''}{cliente.crecimiento}%
                  </p>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Métricas Adicionales */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-lg flex items-center gap-2">
              <Calendar className="h-5 w-5 text-indigo-600" />
              Visitas Programadas
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold">12</p>
            <p className="text-sm text-muted-foreground">Próximos 7 días</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-lg flex items-center gap-2">
              <Award className="h-5 w-5 text-yellow-600" />
              Tasa de Conversión
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold">87%</p>
            <p className="text-sm text-yellow-600">Cotizaciones → Ventas</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-lg flex items-center gap-2">
              <TrendingUp className="h-5 w-5 text-emerald-600" />
              Crecimiento Anual
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold">+18%</p>
            <p className="text-sm text-emerald-600">vs mismo período 2023</p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
