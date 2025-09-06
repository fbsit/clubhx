
import { memo } from "react";
import { Accordion } from "@/components/ui/accordion";
import { useIsMobile } from "@/hooks/use-mobile";
import { FilterOptions } from "@/services/productService";
import FilterHeader from "./FilterHeader";
import CategoryFilter from "./CategoryFilter";
import TypeFilter from "./TypeFilter";
import BrandFilter from "./BrandFilter";
import AvailabilityFilter from "./AvailabilityFilter";
import FilterFooter from "./FilterFooter";
import EmptyFilterState from "./EmptyFilterState";
import { useFilterHandlers } from "./hooks/useFilterHandlers";

interface FilterContentProps {
  filters: FilterOptions;
  onChange: (filters: FilterOptions) => void;
  onClose?: () => void;
  className?: string;
}

const FilterContent = memo(({ 
  filters, 
  onChange, 
  onClose, 
  className = "" 
}: FilterContentProps) => {
  const isMobile = useIsMobile();
  
  // Get filter handlers and state from custom hook
  const {
    activeFilterCount,
    hasActiveFilters,
    handleCategoryChange,
    handleTypeChange,
    handleBrandChange,
    handleStockChange,
    clearAllFilters
  } = useFilterHandlers(filters, onChange);
  
  return (
    <div className={`flex flex-col h-full ${className}`}>
      <FilterHeader 
        activeFilterCount={activeFilterCount}
        hasActiveFilters={hasActiveFilters}
        clearAllFilters={clearAllFilters}
        isMobile={isMobile}
      />

      <div className="flex-1 overflow-auto px-4 py-2">
        <Accordion type="multiple" defaultValue={["category", "brand", "availability"]} className="w-full">
          <CategoryFilter 
            selectedCategories={filters.categories}
            onChange={handleCategoryChange}
          />

          <TypeFilter 
            selectedTypes={filters.types}
            onChange={handleTypeChange}
          />

          <BrandFilter 
            selectedBrands={filters.brands}
            onChange={handleBrandChange}
          />

          <AvailabilityFilter 
            onlyInStock={filters.onlyInStock}
            onChange={handleStockChange}
          />
        </Accordion>

        {!hasActiveFilters && <EmptyFilterState />}
      </div>

      {/* iOS-style bottom button area for mobile */}
      {isMobile && (
        <FilterFooter 
          hasActiveFilters={hasActiveFilters}
          activeFilterCount={activeFilterCount}
          onClose={onClose}
        />
      )}
    </div>
  );
});

FilterContent.displayName = "FilterContent";
export default FilterContent;
