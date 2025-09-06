
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardHeader, 
  CardTitle 
} from "@/components/ui/card";
import { User } from "@/types/auth";
import { SalesHeroKPI } from "@/components/dashboard/SalesHeroKPI";
import { SalesChartsSection } from "@/components/dashboard/SalesChartsSection";
import { ClientCategorization } from "@/components/dashboard/ClientCategorization";
import { PerformanceWidgets } from "@/components/dashboard/PerformanceWidgets";
import { CollectionsKPISection } from "@/components/dashboard/CollectionsKPISection";
import { PeriodSelector } from "@/components/dashboard/PeriodSelector";
import { useEffect, useState } from "react";
import CategoryGoalsKPI from "@/components/dashboard/CategoryGoalsKPI";
import CategorySalesOverview from "@/components/dashboard/CategorySalesOverview";
const getVendorGoals = (_vendorId: string) => [] as any[];
const vendors: any[] = [];
import { GeneralGoalKPI } from "@/components/dashboard/GeneralGoalKPI";
import { salesAnalyticsApi, type SalesDashboardData, type CategorySalesData } from "@/services/salesAnalyticsApi";
import { toast } from "sonner";

interface SalesDashboardProps {
  user: User | null;
}

export const SalesDashboard = ({ user }: SalesDashboardProps) => {
  const [selectedPeriod, setSelectedPeriod] = useState({ 
    start: new Date(), 
    end: new Date(), 
    label: "Mayo 2024" 
  });

  // Estado de datos reales del backend
  const [dashboardData, setDashboardData] = useState<SalesDashboardData | null>(null);
  const [categoryData, setCategoryData] = useState<CategorySalesData | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  // Fetch de métricas y ventas por categoría
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        setError(null);
        const [dashboard, category] = await Promise.all([
          salesAnalyticsApi.getDashboard(),
          salesAnalyticsApi.getCategorySales(),
        ]);
        setDashboardData(dashboard);
        setCategoryData(category);
      } catch (err: any) {
        const msg = err?.message || "Error cargando dashboard";
        setError(msg);
        toast.error("Error cargando dashboard", { description: msg });
      } finally {
        setLoading(false);
      }
    };
    if (user) fetchData();
  }, [user]);

  // Construcción de contexto a partir de la data real
  const currentVendor = {
    id: "sales-user-123",
    email: user?.email,
    salesByCategory: categoryData?.categories.reduce((acc, cat) => {
      (acc as any)[cat.name] = cat.sales;
      return acc;
    }, {
      Color: 0,
      Cuidado: 0,
      Styling: 0,
      Técnico: 0,
      Texturización: 0,
      Accesorios: 0,
    } as Record<string, number>) || {
      Color: 0,
      Cuidado: 0,
      Styling: 0,
      Técnico: 0,
      Texturización: 0,
      Accesorios: 0,
    },
    totalSales: dashboardData?.currentMonthSales || 0,
  };

  const vendorGoals = [
    {
      id: "1",
      type: "by_category" as const,
      status: "active" as const,
      categoryGoals: categoryData?.categories.map(cat => ({
        category: cat.name,
        goal: (cat as any).goal ?? 0,
        current: cat.sales,
      })) || [],
    },
  ];

  const activeCategoryGoal = vendorGoals.find(goal => goal.type === "by_category" && goal.status === "active");
  const activeGeneralGoal = vendorGoals.find(goal => goal.type === "general" && goal.status === "active");

  if (loading) {
    return (
      <div className="w-full max-w-7xl mx-auto px-3 sm:px-6 py-4 sm:py-6 animate-enter space-y-6 sm:space-y-8">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="min-w-0 flex-1">
            <h1 className="text-2xl sm:text-3xl font-bold truncate">Dashboard de Ventas</h1>
            <p className="text-sm text-muted-foreground mt-1 truncate">Panel de control para {user?.name}</p>
          </div>
        </div>
        <div className="h-64 bg-muted animate-pulse rounded" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="w-full max-w-7xl mx-auto px-3 sm:px-6 py-4 sm:py-6 animate-enter space-y-6 sm:space-y-8">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="min-w-0 flex-1">
            <h1 className="text-2xl sm:text-3xl font-bold truncate">Dashboard de Ventas</h1>
            <p className="text-sm text-muted-foreground mt-1 truncate">Panel de control para {user?.name}</p>
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

  return (
    <div className="w-full max-w-7xl mx-auto px-3 sm:px-6 py-4 sm:py-6 animate-enter space-y-6 sm:space-y-8">
      {/* Header - Mobile optimized */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="min-w-0 flex-1">
          <h1 className="text-2xl sm:text-3xl font-bold truncate">Dashboard de Ventas</h1>
          <p className="text-sm text-muted-foreground mt-1 truncate">
            Panel de control para {user?.name}
          </p>
        </div>
        
        {/* Period Selector */}
        <div className="w-full sm:w-auto">
          <PeriodSelector onPeriodChange={setSelectedPeriod} />
        </div>
      </div>
      
      {/* Hero KPI Section */}
      <SalesHeroKPI dashboardData={dashboardData || undefined} />
      
      {/* Category Goals Section */}
      {activeCategoryGoal && currentVendor ? (
        <CategoryGoalsKPI 
          categoryGoals={activeCategoryGoal.categoryGoals || []}
          salesByCategory={currentVendor.salesByCategory || { Color: 0, Cuidado: 0, Styling: 0, Técnico: 0, Texturización: 0, Accesorios: 0 }}
        />
      ) : activeGeneralGoal && currentVendor ? (
        <GeneralGoalKPI 
          goalAmount={activeGeneralGoal.amount || 0}
          currentSales={currentVendor.totalSales || 0}
        />
      ) : currentVendor ? (
        <CategorySalesOverview 
          salesByCategory={currentVendor.salesByCategory || { Color: 0, Cuidado: 0, Styling: 0, Técnico: 0, Texturización: 0, Accesorios: 0 }}
        />
      ) : null}
      
      {/* Charts Section - Mobile optimized */}
      <SalesChartsSection />
      
      {/* Collections KPI Section */}
      <CollectionsKPISection />
      
      {/* Client Categorization and Performance - Mobile optimized */}
      <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
        <ClientCategorization />
        <div className="space-y-6">
          <Card>
            <CardContent className="p-4 sm:p-6">
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-center">
                <div className="p-3 sm:p-0">
                  <p className="text-xl sm:text-2xl font-bold text-foreground">28</p>
                  <p className="text-xs sm:text-sm text-muted-foreground">Cotizaciones</p>
                  <p className="text-xs text-green-600">+12% vs mes anterior</p>
                </div>
                <div className="p-3 sm:p-0">
                  <p className="text-xl sm:text-2xl font-bold text-foreground">87%</p>
                  <p className="text-xs sm:text-sm text-muted-foreground">Tasa Conversión</p>
                  <p className="text-xs text-green-600">+3% vs mes anterior</p>
                </div>
                <div className="p-3 sm:p-0">
                  <p className="text-xl sm:text-2xl font-bold text-foreground">42</p>
                  <p className="text-xs sm:text-sm text-muted-foreground">Clientes Activos</p>
                  <p className="text-xs text-blue-600">3 nuevos este mes</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
      
      {/* Performance Widgets */}
      <PerformanceWidgets />
    </div>
  );
};

export default SalesDashboard;
