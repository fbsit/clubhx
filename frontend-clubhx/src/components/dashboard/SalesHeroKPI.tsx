import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { TrendingUp, Target, DollarSign, Palette, Sparkles, Scissors, Beaker } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";

const categoryIcons = {
  Color: Palette,
  Cuidado: Sparkles,
  Styling: Scissors,
  Técnico: Beaker
};

interface SalesHeroKPIProps {
  dashboardData?: {
    currentMonthSales: number;
    monthlyGoal: number;
    goalCompletion: number;
    activeCustomers: number;
    newCustomersThisMonth: number;
    averageTicket: number;
    salesGrowth: number;
    topCategories: Array<{
      name: string;
      sales: number;
      percentage: number;
    }>;
  };
}

export function SalesHeroKPI({ dashboardData }: SalesHeroKPIProps) {
  const { user } = useAuth();
  
  console.log('SalesHeroKPI received dashboardData:', dashboardData);
  
  // Si no hay datos, mostrar un mensaje de carga
  if (!dashboardData) {
    return (
      <Card className="bg-gradient-to-br from-primary/5 to-primary/10 border-primary/20">
        <CardContent className="p-8">
          <div className="text-center">
            <p className="text-muted-foreground">Cargando datos del dashboard...</p>
          </div>
        </CardContent>
      </Card>
    );
  }
  
  const currentSales = dashboardData.currentMonthSales;
  const monthlyGoal = dashboardData.monthlyGoal;
  const progressPercentage = dashboardData.goalCompletion;
  const difference = currentSales - monthlyGoal;
  const isOverGoal = difference > 0;

  // Sales by category from dashboard data
  const salesByCategory = dashboardData?.topCategories.reduce((acc, cat) => {
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
  };
  
  const monthlyCategorySales = {
    Color: salesByCategory.Color,
    Cuidado: salesByCategory.Cuidado,
    Styling: salesByCategory.Styling,
    Técnico: salesByCategory.Técnico
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('es-CL', {
      style: 'currency',
      currency: 'CLP',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
  };

  const formatCurrencyShort = (amount: number) => {
    if (amount >= 1000000) {
      return `$${(amount / 1000000).toFixed(1)}M`;
    }
    return formatCurrency(amount);
  };

  return (
    <Card className="bg-gradient-to-br from-primary/5 to-primary/10 border-primary/20">
      <CardContent className="p-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main KPI */}
          <div className="lg:col-span-2">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h2 className="text-sm font-medium text-muted-foreground mb-2">
                  Ventas del Mes - Mayo 2024
                </h2>
                <p className="text-4xl font-bold text-foreground">
                  {formatCurrency(currentSales)}
                </p>
              </div>
              <div className="p-4 bg-primary/10 rounded-full">
                <DollarSign className="h-8 w-8 text-primary" />
              </div>
            </div>

            <div className="space-y-4">
              <div className="flex items-center justify-between text-sm">
                <span className="text-muted-foreground">Progreso hacia la meta</span>
                <span className={`font-semibold ${
                  progressPercentage >= 100 ? 'text-green-600' : 
                  progressPercentage >= 80 ? 'text-foreground' : 'text-red-600'
                }`}>
                  {progressPercentage}%
                </span>
              </div>
              
              {/* Barra de progreso personalizada */}
              <div className="relative">
                <div className="h-3 w-full bg-black/20 rounded-full overflow-hidden">
                  <div 
                    className={`h-full transition-all duration-500 ${
                      progressPercentage >= 100 ? 'bg-green-600' : 
                      progressPercentage >= 80 ? 'bg-amber-500' : 'bg-red-500'
                    }`}
                    style={{ width: `${Math.min(progressPercentage, 100)}%` }}
                  />
                </div>
                {/* Línea de meta al 100% */}
                <div className="absolute top-0 right-0 h-3 w-0.5 bg-black rounded-full" />
              </div>
              
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Target className="h-4 w-4 text-muted-foreground" />
                  <span className="text-sm text-muted-foreground">
                    Meta: {formatCurrency(monthlyGoal)}
                  </span>
                </div>
                <div className={`flex items-center gap-1 text-sm font-medium ${
                  isOverGoal ? 'text-green-600' : 
                  progressPercentage >= 80 ? 'text-amber-600' : 'text-red-600'
                }`}>
                  <TrendingUp className="h-4 w-4" />
                  {isOverGoal ? '+' : ''}{formatCurrency(difference)}
                </div>
              </div>
            </div>
          </div>

          {/* Category Breakdown */}
          <div className="border-l border-primary/20 pl-6">
            <h3 className="text-sm font-medium text-muted-foreground mb-4">
              Ventas por Categoría
            </h3>
            <div className="space-y-3">
              {Object.entries(monthlyCategorySales).map(([category, amount]) => {
                const IconComponent = categoryIcons[category as keyof typeof categoryIcons] || Palette;
                const percentage = currentSales > 0 ? (amount / currentSales) * 100 : 0;
                
                return (
                  <div key={category} className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <IconComponent className="h-4 w-4 text-primary" />
                      <span className="text-sm font-medium">{category}</span>
                    </div>
                    <div className="text-right">
                      <div className="text-sm font-semibold">{formatCurrencyShort(amount)}</div>
                      <div className="text-xs text-muted-foreground">{percentage.toFixed(1)}%</div>
                    </div>
                  </div>
                );
              })}
            </div>
            
            <div className="mt-4 pt-3 border-t border-primary/20">
              <div className="text-xs text-muted-foreground">
                Total categorías principales: {formatCurrencyShort(
                  Object.values(monthlyCategorySales).reduce((sum, amount) => sum + amount, 0)
                )}
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}