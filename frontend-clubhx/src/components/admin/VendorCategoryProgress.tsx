import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { VendorGoal } from "@/types/vendor";
const vendors: any[] = [];
import { TrendingUp, TrendingDown, Target } from "lucide-react";

interface VendorCategoryProgressProps {
  goals: VendorGoal[];
}

export default function VendorCategoryProgress({ goals }: VendorCategoryProgressProps) {
  const categoryGoals = goals.filter(goal => goal.type === "by_category" && goal.status === "active");
  
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('es-CL', {
      style: 'currency',
      currency: 'CLP',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(amount);
  };

  const getProgressColor = (progress: number) => {
    if (progress >= 100) return "text-green-600";
    if (progress >= 80) return "text-blue-600";
    if (progress >= 60) return "text-yellow-600";
    return "text-red-600";
  };

  if (categoryGoals.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Target className="h-5 w-5 text-primary" />
            Progreso por Categorías
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground text-center py-4">
            No hay vendedores con metas por categoría activas
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Target className="h-5 w-5 text-primary" />
          Progreso por Categorías
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-6">
          {categoryGoals.map((goal) => {
            const vendor = vendors.find(v => v.id === goal.vendorId);
            if (!vendor || !goal.categoryGoals) return null;

            return (
              <div key={goal.id} className="space-y-3">
                <div className="flex items-center justify-between">
                  <h4 className="font-medium">{vendor.name}</h4>
                  <Badge variant="outline">{vendor.region}</Badge>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  {goal.categoryGoals.map((categoryGoal) => {
                    const currentSales = vendor.salesByCategory?.[categoryGoal.category] || 0;
                    const progress = categoryGoal.amount > 0 ? (currentSales / categoryGoal.amount) * 100 : 0;
                    
                    return (
                      <div key={categoryGoal.category} className="p-3 border rounded-lg bg-muted/20">
                        <div className="flex items-center justify-between mb-2">
                          <div className="flex items-center gap-2">
                            <span className="text-sm font-medium">{categoryGoal.category}</span>
                            {progress >= 100 ? 
                              <TrendingUp className="h-3 w-3 text-green-600" /> : 
                              <TrendingDown className="h-3 w-3 text-red-600" />
                            }
                          </div>
                          <span className={`text-xs font-medium ${getProgressColor(progress)}`}>
                            {progress.toFixed(0)}%
                          </span>
                        </div>
                        
                        <Progress value={Math.min(progress, 100)} className="h-1.5 mb-2" />
                        
                        <div className="text-xs text-muted-foreground">
                          {formatCurrency(currentSales)} / {formatCurrency(categoryGoal.amount)}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
}