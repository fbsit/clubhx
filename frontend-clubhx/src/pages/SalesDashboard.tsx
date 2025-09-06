
import { useState, useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { useAuth } from "@/contexts/AuthContext";
import { SalesHeroKPI } from "@/components/dashboard/SalesHeroKPI";
import { SalesChartsSection } from "@/components/dashboard/SalesChartsSection";
import { ClientCategorization } from "@/components/dashboard/ClientCategorization";
import { PerformanceWidgets } from "@/components/dashboard/PerformanceWidgets";
import CategoryGoalsKPI from "@/components/dashboard/CategoryGoalsKPI";
import CategorySalesOverview from "@/components/dashboard/CategorySalesOverview";
import { GeneralGoalKPI } from "@/components/dashboard/GeneralGoalKPI";
import { salesAnalyticsApi, type SalesDashboardData, type CategorySalesData } from "@/services/salesAnalyticsApi";
import { toast } from "sonner";

export default function SalesDashboard() {
  const { user } = useAuth();
  console.log('SalesDashboard: Current user:', user);
  console.log('SalesDashboard: User role:', user?.role);
  const [dashboardData, setDashboardData] = useState<SalesDashboardData | null>(null);
  const [categoryData, setCategoryData] = useState<CategorySalesData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        console.log('SalesDashboard: Starting to fetch data...');
        setLoading(true);
        setError(null);
        
        // Primero probar la conectividad
        console.log('SalesDashboard: Testing API connectivity...');
        try {
          await salesAnalyticsApi.test();
          console.log('SalesDashboard: API connectivity test passed');
        } catch (testError) {
          console.error('SalesDashboard: API connectivity test failed:', testError);
          throw new Error('No se puede conectar con el servidor. Verifica que el backend esté corriendo.');
        }
        
        console.log('SalesDashboard: Calling salesAnalyticsApi.getDashboard()...');
        const dashboard = await salesAnalyticsApi.getDashboard();
        console.log('SalesDashboard: Dashboard data received:', dashboard);
        
        console.log('SalesDashboard: Calling salesAnalyticsApi.getCategorySales()...');
        const category = await salesAnalyticsApi.getCategorySales();
        console.log('SalesDashboard: Category data received:', category);

        setDashboardData(dashboard);
        setCategoryData(category);
        console.log('SalesDashboard: Data set successfully');
      } catch (err: any) {
        console.error('SalesDashboard: Error fetching data:', err);
        setError(err?.message || 'Error cargando dashboard');
        toast.error('Error cargando dashboard', { description: err?.message });
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  if (loading) {
    return (
      <div className="container max-w-7xl py-6 animate-enter space-y-8">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold">Dashboard de Ventas</h1>
            <p className="text-muted-foreground">Panel de control para {user?.name}</p>
          </div>
          <Card className="bg-muted/30">
            <CardContent className="p-3">
              <p className="text-sm font-medium">Período: Mayo 2024</p>
            </CardContent>
          </Card>
        </div>
        <div className="h-64 bg-muted animate-pulse rounded" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="container max-w-7xl py-6 animate-enter space-y-8">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold">Dashboard de Ventas</h1>
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

  // Get current vendor's category goals and sales data
  const currentVendor = {
    id: 'sales-user-123',
    email: user?.email,
    salesByCategory: categoryData?.categories.reduce((acc, cat) => {
      acc[cat.name as keyof typeof acc] = cat.sales;
      return acc;
    }, {
      Color: 0,
      Cuidado: 0,
      Styling: 0,
      Técnico: 0,
      Texturización: 0,
      Accesorios: 0
    }) || {
      Color: 0,
      Cuidado: 0,
      Styling: 0,
      Técnico: 0,
      Texturización: 0,
      Accesorios: 0
    }
  };

  const vendorGoals = [
    {
      id: '1',
      type: 'by_category' as const,
      status: 'active' as const,
      categoryGoals: categoryData?.categories.map(cat => ({
        category: cat.name,
        goal: cat.goal,
        current: cat.sales
      })) || []
    }
  ];

  const activeCategoryGoal = vendorGoals.find(goal => goal.type === "by_category" && goal.status === "active");
  const activeGeneralGoal = vendorGoals.find(goal => goal.type === "general" && goal.status === "active");
  
  return (
    <div className="container max-w-7xl py-6 animate-enter space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Dashboard de Ventas</h1>
          <p className="text-muted-foreground mt-1">Panel de control para {user?.name}</p>
        </div>
        <Card className="bg-muted/30">
          <CardContent className="p-3">
            <p className="text-sm font-medium">Período: Mayo 2024</p>
          </CardContent>
        </Card>
      </div>
      
      {/* Hero KPI Section */}
      <SalesHeroKPI dashboardData={dashboardData} />
      
      {/* Category Goals Section - Most Prominent */}
      {activeCategoryGoal && currentVendor ? (
        <CategoryGoalsKPI 
          categoryGoals={activeCategoryGoal.categoryGoals || []}
          salesByCategory={currentVendor.salesByCategory || {
            Color: 0, Cuidado: 0, Styling: 0, Técnico: 0, Texturización: 0, Accesorios: 0
          }}
        />
      ) : activeGeneralGoal && currentVendor ? (
        <GeneralGoalKPI 
          goalAmount={activeGeneralGoal.amount || 0}
          currentSales={currentVendor.totalSales || 0}
        />
      ) : currentVendor ? (
        <CategorySalesOverview 
          salesByCategory={currentVendor.salesByCategory || {
            Color: 0, Cuidado: 0, Styling: 0, Técnico: 0, Texturización: 0, Accesorios: 0
          }}
        />
      ) : null}
      
      {/* Charts Section */}
      <SalesChartsSection />
      
      {/* Secondary Metrics */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <ClientCategorization />
        
        <Card>
          <CardContent className="p-6">
            <div className="grid grid-cols-3 gap-4 text-center">
              <div>
                <p className="text-2xl font-bold text-foreground">28</p>
                <p className="text-sm text-muted-foreground">Cotizaciones</p>
                <p className="text-xs text-green-600">+12% vs mes anterior</p>
              </div>
              <div>
                <p className="text-2xl font-bold text-foreground">87%</p>
                <p className="text-sm text-muted-foreground">Tasa Conversión</p>
                <p className="text-xs text-green-600">+3% vs mes anterior</p>
              </div>
              <div>
                <p className="text-2xl font-bold text-foreground">42</p>
                <p className="text-sm text-muted-foreground">Clientes Activos</p>
                <p className="text-xs text-blue-600">3 nuevos este mes</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
      
      {/* Performance Widgets */}
      <PerformanceWidgets />
    </div>
  );
}
