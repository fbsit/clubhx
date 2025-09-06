
import React from "react";
import { Button } from "@/components/ui/button";
import { TrendingUp } from "lucide-react";
import { SalesPersonSelector } from "./SalesPersonSelector";

type CalendarHeaderProps = {
  selectedSalesPerson: string;
  onSalesPersonChange: (value: string) => void;
};

export const CalendarHeader: React.FC<CalendarHeaderProps> = ({
  selectedSalesPerson,
  onSalesPersonChange,
}) => {
  return (
    <div className="bg-white border-b border-border px-6 py-4">
      <div className="flex items-center justify-between gap-3 flex-wrap">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Calendario de Vendedores</h1>
          <p className="text-sm text-muted-foreground">
            Monitorea las actividades y rendimiento del equipo de ventas
          </p>
        </div>
        <div className="flex items-center gap-3">
          <Button variant="outline" size="sm" className="gap-2">
            <TrendingUp className="h-4 w-4" />
            Analítica General
          </Button>
          <SalesPersonSelector
            selectedSalesPerson={selectedSalesPerson}
            onSalesPersonChange={onSalesPersonChange}
          />
        </div>
      </div>
    </div>
  );
};
