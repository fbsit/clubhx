
import { memo } from "react";
import { Button } from "@/components/ui/button";

interface FilterFooterProps {
  hasActiveFilters: boolean;
  activeFilterCount: number;
  onClose?: () => void;
}

const FilterFooter = memo(({ 
  hasActiveFilters, 
  activeFilterCount, 
  onClose 
}: FilterFooterProps) => {
  return (
    <div className="sticky bottom-0 bg-background border-t px-4 py-3 mt-auto flex justify-between items-center">
      <div className="text-sm text-muted-foreground">
        {hasActiveFilters ? (
          <span>{activeFilterCount} {activeFilterCount === 1 ? 'filtro' : 'filtros'} activo{activeFilterCount !== 1 ? 's' : ''}</span>
        ) : (
          <span>Sin filtros</span>
        )}
      </div>
      <Button 
        onClick={onClose} 
        className="px-6"
      >
        Aplicar Filtros
      </Button>
    </div>
  );
});

FilterFooter.displayName = "FilterFooter";
export default FilterFooter;
