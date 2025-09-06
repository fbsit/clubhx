
import { useState } from "react";
import { FileSpreadsheet, History, Package } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { cn } from "@/lib/utils";

export type PurchaseMethod = "classic" | "excel" | "history";

interface PurchaseMethodSelectorProps {
  currentMethod: PurchaseMethod;
  onMethodChange: (method: PurchaseMethod) => void;
}

const purchaseMethods = [
  {
    id: "classic" as const,
    label: "Compra por Producto",
    description: "Navega y selecciona productos",
    icon: Package,
  },
  {
    id: "excel" as const,
    label: "Compra Fácil",
    description: "Sube tu Excel con productos",
    icon: FileSpreadsheet,
  },
  {
    id: "history" as const,
    label: "Compra por Historial",
    description: "Repite pedidos anteriores",
    icon: History,
  },
];

export default function PurchaseMethodSelector({ 
  currentMethod, 
  onMethodChange 
}: PurchaseMethodSelectorProps) {
  return (
    <Card className="p-4 mb-6 shadow-sm border border-border/40 rounded-xl bg-background/70">
      <div className="mb-3">
        <h3 className="text-lg font-semibold">Método de Compra</h3>
        <p className="text-sm text-muted-foreground">
          Elige cómo quieres realizar tu pedido
        </p>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
        {purchaseMethods.map((method) => {
          const Icon = method.icon;
          const isActive = currentMethod === method.id;
          
          return (
            <Button
              key={method.id}
              variant={isActive ? "default" : "outline"}
              onClick={() => onMethodChange(method.id)}
              className={cn(
                "h-auto p-4 flex flex-col items-center text-center space-y-2 transition-all duration-200",
                isActive 
                  ? "bg-primary text-primary-foreground shadow-md" 
                  : "hover:bg-muted/50"
              )}
            >
              <Icon className="h-6 w-6" />
              <div>
                <div className="font-medium text-sm">{method.label}</div>
                <div className={cn(
                  "text-xs",
                  isActive ? "text-primary-foreground/80" : "text-muted-foreground"
                )}>
                  {method.description}
                </div>
              </div>
            </Button>
          );
        })}
      </div>
    </Card>
  );
}
