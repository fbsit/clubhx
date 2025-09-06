
import { memo } from "react";
import { Button } from "@/components/ui/button";
import { Filter } from "lucide-react";
import { Badge } from "@/components/ui/badge";

interface FilterHeaderProps {
  activeFilterCount: number;
  hasActiveFilters: boolean;
  clearAllFilters: () => void;
  isMobile?: boolean;
}

const FilterHeader = memo(({ 
  activeFilterCount, 
  hasActiveFilters, 
  clearAllFilters,
  isMobile
}: FilterHeaderProps) => {
  return (
    <div className="sticky top-0 bg-background z-10 px-4 py-3 flex items-center justify-between border-b">
      <h3 className="font-medium flex items-center gap-2">
        <Filter className="h-4 w-4" /> 
        Filtros
        {activeFilterCount > 0 && (
          <Badge variant="secondary" className="h-5 min-w-[1.25rem] flex items-center justify-center">
            {activeFilterCount}
          </Badge>
        )}
      </h3>
      <div className="flex items-center gap-2">
        {hasActiveFilters && (
          <Button 
            variant="outline" 
            size="sm" 
            onClick={clearAllFilters}
            className="text-sm h-8 px-2 hover:bg-muted/50"
          >
            Limpiar
          </Button>
        )}
      </div>
    </div>
  );
});

FilterHeader.displayName = "FilterHeader";
export default FilterHeader;
