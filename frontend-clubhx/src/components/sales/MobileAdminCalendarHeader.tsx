
import React from "react";
import { SalesPersonMobileSelector } from "./SalesPersonMobileSelector";

type MobileAdminCalendarHeaderProps = {
  selectedSalesPerson: string;
  onSalesPersonChange: (value: string) => void;
};

export const MobileAdminCalendarHeader: React.FC<MobileAdminCalendarHeaderProps> = ({
  selectedSalesPerson,
  onSalesPersonChange,
}) => {
  return (
    <div className="bg-white border-b border-border px-4 py-3 sticky top-0 z-20 w-full overflow-hidden">
      <div className="flex items-center justify-between gap-3 w-full max-w-full min-w-0">
        <div className="flex-1 min-w-0 overflow-hidden">
          <h1 className="text-lg font-bold text-foreground truncate">
            Calendario Vendedores
          </h1>
          <p className="text-xs text-muted-foreground truncate">
            Actividades del equipo
          </p>
        </div>
        <div className="flex-shrink-0 min-w-0">
          <SalesPersonMobileSelector
            selectedSalesPerson={selectedSalesPerson}
            onSalesPersonChange={onSalesPersonChange}
          />
        </div>
      </div>
    </div>
  );
};
