
import { useState, useCallback, lazy, Suspense, useEffect } from "react";
import { fetchProducts } from "@/services/productsApi";
import { ProductType } from "@/types/product";
import ProductFilter from "@/components/products/ProductFilter";
import QuotationCart from "@/components/quotation/QuotationCart";
import { filterProducts, sortProducts, FilterOptions } from "@/services/productService";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Search, SlidersHorizontal, X, Grid3X3, List } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import MobileProductCard from "./MobileProductCard";
import { usePagination } from "@/hooks/usePagination";
import { PaginationControls } from "@/components/ui/pagination-controls";
import { useAuth } from "@/contexts/AuthContext";
import SalesClientSelector from "@/components/sales/SalesClientSelector";
const SalesExcelQuotationFlow = lazy(() => import("@/components/sales/SalesExcelQuotationFlow"));

export default function MobileProductsView() {
  const { user } = useAuth();
  const [searchQuery, setSearchQuery] = useState("");
  const [filtersVisible, setFiltersVisible] = useState(false);
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [activeFilters, setActiveFilters] = useState<FilterOptions>({
    categories: [],
    types: [],
    brands: [],
    priceRange: [0, 100000] as [number, number],
    onlyInStock: false,
  });

  // Active filters count
  const activeFilterCount =
    activeFilters.categories.length +
    activeFilters.brands.length +
    activeFilters.types.length +
    (activeFilters.onlyInStock ? 1 : 0);

  const [allProducts, setAllProducts] = useState<ProductType[]>([]);
  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const data = await fetchProducts(200);
        if (!cancelled) setAllProducts(data);
      } catch {
        if (!cancelled) setAllProducts([]);
      }
    })();
    return () => { cancelled = true; };
  }, []);

  // Products filtered and sorted
  const filteredProducts = filterProducts(
    allProducts,
    searchQuery,
    "all",
    activeFilters
  );

  const sortedProducts = sortProducts(filteredProducts, "name-asc");

  // Pagination configuration for mobile
  const paginationConfig = {
    initialPageSize: 8,
    enableLoadMore: true,
    maxPageSize: 50
  };

  const [paginatedProducts, paginationState, paginationActions] = usePagination(
    sortedProducts, 
    paginationConfig
  );

  // Handler for closing filters sheet
  const handleSheetClose = useCallback(() => setFiltersVisible(false), []);

  return (
    <div className="animate-enter pb-[90px]">
      {/* Header sticky with search and filter */}
      <div className="sticky top-0 z-20 bg-background/95 backdrop-blur border-b">
        <div className="flex items-center px-3 py-2 gap-2">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Buscar productos..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 h-10 rounded-xl bg-background border-muted text-sm"
            />
          </div>
          
          {/* View mode toggle */}
          <div className="flex bg-muted rounded-lg p-1">
            <Button
              variant={viewMode === "grid" ? "default" : "ghost"}
              size="sm"
              onClick={() => setViewMode("grid")}
              className="h-8 w-8 p-0"
            >
              <Grid3X3 className="h-4 w-4" />
            </Button>
            <Button
              variant={viewMode === "list" ? "default" : "ghost"}
              size="sm"
              onClick={() => setViewMode("list")}
              className="h-8 w-8 p-0"
            >
              <List className="h-4 w-4" />
            </Button>
          </div>
          
          <Sheet open={filtersVisible} onOpenChange={setFiltersVisible}>
            <SheetTrigger asChild>
              <button
                className="relative bg-background border border-border rounded-xl px-3 h-10 flex items-center ml-1 active:scale-95 shadow"
                aria-label="Filtros"
                onClick={() => setFiltersVisible(true)}
              >
                <SlidersHorizontal className="h-5 w-5 mr-0.5" />
                {activeFilterCount > 0 && (
                  <Badge
                    variant="secondary"
                    className="absolute -top-1 -right-1 min-w-[1.1rem] h-5 py-0 px-1.5 flex items-center justify-center"
                  >
                    {activeFilterCount}
                  </Badge>
                )}
              </button>
            </SheetTrigger>
            <SheetContent side="left" className="max-w-xs w-full p-0 border-none shadow-xl">
              <div className="flex justify-between items-center px-4 py-3 border-b">
                <span className="font-medium text-base">Filtros</span>
                <button
                  className="rounded-full p-1 hover:bg-muted"
                  onClick={handleSheetClose}
                  aria-label="Cerrar filtros"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>
              <ProductFilter
                filters={activeFilters}
                onChange={setActiveFilters}
                onClose={handleSheetClose}
                className="pb-3"
              />
            </SheetContent>
          </Sheet>
        </div>
      </div>

      {/* Results count */}
      <div className="px-3 py-2 text-sm text-muted-foreground bg-background/50">
        Mostrando {paginationState.displayedItems} de {sortedProducts.length} productos
      </div>

      {/* Products grid - with pagination */}
      <div className="p-3 space-y-4">
        {user?.role === 'sales' && (
          <div className="space-y-3">
            <SalesClientSelector compact={true} showDetails={false} />
            <Suspense fallback={<div className="text-sm text-muted-foreground">Cargando carga masiva...</div>}>
              <SalesExcelQuotationFlow />
            </Suspense>
          </div>
        )}
        {viewMode === "grid" ? (
          <div className="grid grid-cols-2 gap-3">
            {paginatedProducts.map((product) => (
              <MobileProductCard
                key={product.id}
                product={product}
                viewMode="grid"
              />
            ))}
          </div>
        ) : (
          <div className="space-y-3">
            {paginatedProducts.map((product) => (
              <MobileProductCard
                key={product.id}
                product={product}
                viewMode="list"
              />
            ))}
          </div>
        )}

        {/* Pagination Controls */}
        {sortedProducts.length > paginationConfig.initialPageSize && (
          <PaginationControls
            state={paginationState}
            actions={paginationActions}
            showLoadMore={true}
            className="pt-4"
          />
        )}
      </div>

      <QuotationCart />
    </div>
  );
}
