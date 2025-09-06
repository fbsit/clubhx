import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { CategoryGoal } from "@/types/vendor";
import { TrendingUp, TrendingDown, Target } from "lucide-react";

interface CategoryProgressChartProps {
  categoryGoals: CategoryGoal[];
  salesByCategory: {
    Color: number;
    Cuidado: number;
    Styling: number;
    Técnico: number;
    Texturización: number;
    Accesorios: number;
  };
}

export default function CategoryProgressChart({ categoryGoals, salesByCategory }: CategoryProgressChartProps) {
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('es-CL', {
      style: 'currency',
      currency: 'CLP',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(amount);
  };

  const getProgressColor = (progress: number) => {
    if (progress >= 100) return "bg-green-500";
    if (progress >= 80) return "bg-blue-500";
    if (progress >= 60) return "bg-yellow-500";
    return "bg-red-500";
  };

  const getProgressIcon = (progress: number) => {
    if (progress >= 100) return <TrendingUp className="h-4 w-4 text-green-600" />;
    if (progress >= 80) return <TrendingUp className="h-4 w-4 text-blue-600" />;
    return <TrendingDown className="h-4 w-4 text-red-600" />;
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Target className="h-5 w-5 text-primary" />
          Progreso por Categoría
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {categoryGoals.map((goal) => {
            const currentSales = salesByCategory[goal.category] || 0;
            const progress = goal.amount > 0 ? (currentSales / goal.amount) * 100 : 0;
            
            return (
              <div key={goal.category} className="space-y-2">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="font-medium">{goal.category}</span>
                    {getProgressIcon(progress)}
                  </div>
                  <div className="text-right">
                    <div className="text-sm font-medium">
                      {formatCurrency(currentSales)} / {formatCurrency(goal.amount)}
                    </div>
                    <div className="text-xs text-muted-foreground">
                      {progress.toFixed(1)}%
                    </div>
                  </div>
                </div>
                <Progress 
                  value={Math.min(progress, 100)} 
                  className="h-2"
                />
                <div className="flex justify-between text-xs text-muted-foreground">
                  <span>Meta: {formatCurrency(goal.amount)}</span>
                  {progress >= 100 ? (
                    <span className="text-green-600 font-medium">¡Meta superada!</span>
                  ) : (
                    <span>Faltan: {formatCurrency(goal.amount - currentSales)}</span>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
}