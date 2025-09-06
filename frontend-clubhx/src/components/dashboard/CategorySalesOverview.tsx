import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Palette, Sparkles, Scissors, Beaker, TrendingUp } from "lucide-react";

interface CategorySalesOverviewProps {
  salesByCategory: {
    Color: number;
    Cuidado: number;
    Styling: number;
    Técnico: number;
    Texturización: number;
    Accesorios: number;
  };
}

const categoryIcons = {
  Color: Palette,
  Cuidado: Sparkles,
  Styling: Scissors,
  Técnico: Beaker
};

export default function CategorySalesOverview({ salesByCategory }: CategorySalesOverviewProps) {
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('es-CL', {
      style: 'currency',
      currency: 'CLP',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(amount);
  };

  // Focus on main categories
  const mainCategories = [
    { key: "Color" as keyof typeof salesByCategory, name: "Color", sales: salesByCategory.Color },
    { key: "Cuidado" as keyof typeof salesByCategory, name: "Cuidado", sales: salesByCategory.Cuidado },
    { key: "Styling" as keyof typeof salesByCategory, name: "Styling", sales: salesByCategory.Styling },
    { key: "Técnico" as keyof typeof salesByCategory, name: "Técnico", sales: salesByCategory.Técnico }
  ];

  const totalSales = mainCategories.reduce((sum, cat) => sum + cat.sales, 0);

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <TrendingUp className="h-5 w-5 text-primary" />
          Ventas por Categoría
        </CardTitle>
        <p className="text-sm text-muted-foreground">
          No tienes metas específicas por categoría. Solicita metas personalizadas a tu administrador.
        </p>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {mainCategories.map((category) => {
            const IconComponent = categoryIcons[category.key] || Palette;
            const percentage = totalSales > 0 ? (category.sales / totalSales) * 100 : 0;

            return (
              <div key={category.key} className="flex items-center justify-between p-3 bg-muted/30 rounded-lg">
                <div className="flex items-center gap-3">
                  <IconComponent className="h-5 w-5 text-primary" />
                  <span className="font-medium">{category.name}</span>
                </div>
                <div className="text-right">
                  <div className="font-semibold">{formatCurrency(category.sales)}</div>
                  <div className="text-xs text-muted-foreground">{percentage.toFixed(1)}% del total</div>
                </div>
              </div>
            );
          })}
        </div>
        
        <div className="mt-4 pt-4 border-t">
          <div className="flex justify-between items-center">
            <span className="font-medium">Total</span>
            <span className="text-lg font-bold text-primary">{formatCurrency(totalSales)}</span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}