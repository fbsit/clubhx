import React from "react";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { CategoryGoal } from "@/types/vendor";

interface CategoryGoalsFormProps {
  categoryGoals: CategoryGoal[];
  onCategoryGoalChange: (index: number, field: keyof CategoryGoal, value: string | number) => void;
}

const CATEGORIES = [
  { key: "Color", label: "Color", description: "Tintes, tonalizadores, decolorantes" },
  { key: "Cuidado", label: "Cuidado", description: "Shampoos, mascarillas, tratamientos" },
  { key: "Styling", label: "Styling", description: "Fijadores, cremas, aceites" },
  { key: "Técnico", label: "Técnico", description: "Productos profesionales especializados" }
] as const;

export default function CategoryGoalsForm({ categoryGoals, onCategoryGoalChange }: CategoryGoalsFormProps) {
  const formatCurrency = (value: string) => {
    const numericValue = value.replace(/\D/g, '');
    if (numericValue) {
      return new Intl.NumberFormat('es-CL').format(parseInt(numericValue));
    }
    return "";
  };

  const handleAmountChange = (index: number, value: string) => {
    const numericValue = parseInt(value.replace(/\D/g, '')) || 0;
    onCategoryGoalChange(index, 'amount', numericValue);
  };

  return (
    <div className="space-y-4">
      <div className="text-sm text-muted-foreground mb-4">
        Define metas específicas para cada categoría de productos. La suma total será tu meta anual.
      </div>
      
      {CATEGORIES.map((category, index) => {
        const goal = categoryGoals.find(g => g.category === category.key) || 
          { category: category.key as any, amount: 0 };
        
        return (
          <div key={category.key} className="space-y-2 p-4 border rounded-lg bg-muted/20">
            <div className="flex items-center justify-between">
              <div>
                <Label className="font-medium">{category.label}</Label>
                <p className="text-xs text-muted-foreground">{category.description}</p>
              </div>
              <div className="w-40">
                <Input
                  placeholder="0"
                  value={goal.amount > 0 ? formatCurrency(goal.amount.toString()) : ""}
                  onChange={(e) => handleAmountChange(index, e.target.value)}
                  className="text-right"
                />
              </div>
            </div>
          </div>
        );
      })}
      
      <div className="mt-4 p-3 bg-primary/5 rounded-lg">
        <div className="flex justify-between items-center">
          <span className="font-medium">Total Meta Anual:</span>
          <span className="text-lg font-bold text-primary">
            {new Intl.NumberFormat('es-CL', {
              style: 'currency',
              currency: 'CLP'
            }).format(categoryGoals.reduce((sum, goal) => sum + goal.amount, 0))}
          </span>
        </div>
      </div>
    </div>
  );
}