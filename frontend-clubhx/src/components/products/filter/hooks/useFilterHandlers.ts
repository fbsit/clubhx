
import { useCallback } from "react";
import { FilterOptions } from "@/services/productService";

export function useFilterHandlers(
  filters: FilterOptions, 
  onChange: (filters: FilterOptions) => void
) {
  // Count active filters
  const activeFilterCount = 
    filters.categories.length + 
    filters.types.length + 
    filters.brands.length + 
    (filters.onlyInStock ? 1 : 0);
  
  const hasActiveFilters = activeFilterCount > 0;

  const handleCategoryChange = useCallback((category: string, checked: boolean) => {
    const newCategories = checked
      ? [...filters.categories, category]
      : filters.categories.filter((c) => c !== category);
    
    onChange({
      ...filters,
      categories: newCategories
    });
  }, [filters, onChange]);

  const handleTypeChange = useCallback((type: string, checked: boolean) => {
    const newTypes = checked
      ? [...filters.types, type]
      : filters.types.filter((t) => t !== type);
    
    onChange({
      ...filters,
      types: newTypes
    });
  }, [filters, onChange]);

  const handleBrandChange = useCallback((brand: string, checked: boolean) => {
    const newBrands = checked
      ? [...filters.brands, brand]
      : filters.brands.filter((b) => b !== brand);
    
    onChange({
      ...filters,
      brands: newBrands
    });
  }, [filters, onChange]);

  const handleStockChange = useCallback((checked: boolean) => {
    onChange({
      ...filters,
      onlyInStock: checked
    });
  }, [filters, onChange]);

  const clearAllFilters = useCallback(() => {
    onChange({
      categories: [],
      types: [],
      brands: [],
      priceRange: [0, 100000] as [number, number],
      onlyInStock: false
    });
  }, [onChange]);

  return {
    activeFilterCount,
    hasActiveFilters,
    handleCategoryChange,
    handleTypeChange,
    handleBrandChange,
    handleStockChange,
    clearAllFilters
  };
}
