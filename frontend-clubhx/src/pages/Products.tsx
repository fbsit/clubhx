import { useState, useCallback, lazy, Suspense, useEffect } from "react";
// import { mockProducts } from "@/data/mockProducts";
import { ProductType } from "@/types/product";

import ProductsHeader from "@/components/products/ProductsHeader";
import ProductCategoryTabs from "@/components/products/ProductCategoryTabs";
import ProductFilter from "@/components/products/ProductFilter";
import ProductGrid from "@/components/products/ProductGrid";
import QuotationCart from "@/components/quotation/QuotationCart";
import PurchaseMethodSelector, { PurchaseMethod } from "@/components/products/PurchaseMethodSelector";
import ExcelPurchaseFlow from "@/components/products/ExcelPurchaseFlow";
import HistoryPurchaseFlow from "@/components/products/HistoryPurchaseFlow";
import AdminProductsView from "@/components/products/AdminProductsView";
import { filterProducts, sortProducts, FilterOptions } from "@/services/productService";
import { Card } from "@/components/ui/card";
import { useIsMobile } from "@/hooks/use-mobile";
import { useAuth } from "@/contexts/AuthContext";
import { useSalesQuotation } from "@/contexts/SalesQuotationContext";
import SalesClientSelector from "@/components/sales/SalesClientSelector";
// Sales Excel flow is lazy-loaded below to keep the main bundle light

import MobileProductsView from "@/components/products/MobileProductsView";
import { fetchProducts } from "@/services/productsApi";

const SalesExcelQuotationFlow = lazy(() => import("@/components/sales/SalesExcelQuotationFlow"));

export default function Products() {
  const isMobile = useIsMobile();
  const { user } = useAuth();

  // Initialize ALL state at the top level - never conditionally
  const [searchQuery, setSearchQuery] = useState("");
  const [currentTab, setCurrentTab] = useState("all");
  const [sortOrder, setSortOrder] = useState("name-asc");
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [filtersVisible, setFiltersVisible] = useState(false);
  const [purchaseMethod, setPurchaseMethod] = useState<PurchaseMethod>("classic");
  const [activeFilters, setActiveFilters] = useState<FilterOptions>({
    categories: [],
    types: [],
    brands: [],
    priceRange: [0, 100000] as [number, number],
    onlyInStock: false,
  });

  const [apiProducts, setApiProducts] = useState<ProductType[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  // ALL HOOKS MUST BE CALLED BEFORE ANY EARLY RETURNS
  const { selectedCustomer } = useSalesQuotation();
  
  const toggleFilters = useCallback(() => {
    setFiltersVisible(prev => !prev);
  }, []);

  const handleFilterChange = useCallback((newFilters: FilterOptions) => {
    setActiveFilters(newFilters);
  }, []);

  useEffect(() => {
    setLoading(true);
    setError(null);
    fetchProducts()
      .then(setApiProducts)
      .catch((e) => setError(e?.message ?? "Error cargando productos"))
      .finally(() => setLoading(false));
  }, []);

  // Apply filters and search to products
  const filteredProducts = filterProducts(
    apiProducts,
    searchQuery,
    currentTab,
    activeFilters
  );
  
  // Sort products
  const sortedProducts = sortProducts(filteredProducts, sortOrder);

  // Count active filters
  const activeFilterCount = 
    activeFilters.categories.length + 
    activeFilters.brands.length + 
    activeFilters.types.length + 
    (activeFilters.onlyInStock ? 1 : 0);

  const isSalesUser = user?.role === "sales";

  // Early returns for different user types and mobile view - AFTER all hooks
  if (user?.role === "admin") {
    return (
      <div className={`${isMobile ? 'w-full overflow-x-hidden' : 'container max-w-7xl'} py-4 md:py-6 animate-enter`}>
        {!isMobile && <h1 className="text-2xl md:text-3xl font-bold mb-6">Gestión de Productos</h1>}
        <AdminProductsView />
      </div>
    );
  }

  if (isMobile) {
    return <MobileProductsView />;
  }

  return (
    <div className="container max-w-7xl animate-enter pb-20 py-4 sm:py-6">
      {/* Purchase Method Selector - Only show for non-sales users */}
      {!isSalesUser && (
        <PurchaseMethodSelector 
          currentMethod={purchaseMethod}
          onMethodChange={setPurchaseMethod}
        />
      )}

      {/* For sales users, always show classic view */}
      {(isSalesUser || purchaseMethod === "classic") && (
        <>
          {/* Client Selector for Sales Users */}
          {isSalesUser && (
            <div className="mb-6">
              <SalesClientSelector 
                compact={true} 
                showDetails={false}
              />
              {selectedCustomer && (
                <div className="mt-2 p-3 bg-muted/30 rounded-lg border">
                  <div className="text-sm text-muted-foreground">
                    Cotizando para: <span className="font-medium text-foreground">{selectedCustomer.name}</span>
                  </div>
                </div>
              )}
              {/* Carga masiva para vendedores */}
              <div className="mt-4">
                <Suspense fallback={<div className="text-sm text-muted-foreground">Cargando carga masiva…</div>}>
                  <SalesExcelQuotationFlow />
                </Suspense>
              </div>
            </div>
          )}

          <div className="mb-5">
            {/* Mobile Top Bar - Search and Filter */}
            <ProductsHeader 
              searchQuery={searchQuery}
              setSearchQuery={setSearchQuery}
              sortOrder={sortOrder}
              setSortOrder={setSortOrder}
              viewMode={viewMode}
              setViewMode={setViewMode}
              filtersVisible={filtersVisible}
              toggleFilters={toggleFilters}
              activeFilterCount={activeFilterCount}
            />

            {/* Tabs for category filtering with refined styling */}
            <div className="overflow-x-auto pb-2 -mx-3 px-3">
              <ProductCategoryTabs 
                currentTab={currentTab} 
                onTabChange={setCurrentTab} 
              />
            </div>
          </div>
          
          {/* Main content with filters sidebar and products grid */}
          <div className="flex flex-col md:flex-row gap-5">
            {/* Filters sidebar - visible on toggle with smooth animation */}
            {filtersVisible && (
              <div 
                className="md:w-72 flex-shrink-0 animate-fade-in"
                style={{ animationDuration: '0.3s' }}
              >
                <ProductFilter 
                  filters={activeFilters} 
                  onChange={handleFilterChange}
                  onClose={() => setFiltersVisible(false)}
                  className="md:sticky md:top-4"
                />
              </div>
            )}

            {/* Products grid/list with improved card */}
            <Card className="flex-1 p-4 sm:p-5 shadow-sm border border-border/40 rounded-xl bg-background/70">
              {/* Results count with refined styling */}
              <div className="mb-4 text-sm text-muted-foreground flex items-center">
                <span>
                  {sortedProducts.length} producto{sortedProducts.length !== 1 ? 's' : ''} encontrado{sortedProducts.length !== 1 ? 's' : ''}
                </span>
              </div>
              
              <ProductGrid 
                products={sortedProducts} 
                viewMode={viewMode}
                userRole={user?.role as "admin" | "sales" | "client"}
                loading={loading}
              />
            </Card>
          </div>
        </>
      )}

      {/* Excel and History flows - Only for non-sales users */}
      {!isSalesUser && purchaseMethod === "excel" && <ExcelPurchaseFlow />}
      
      {!isSalesUser && purchaseMethod === "history" && <HistoryPurchaseFlow />}

      {/* Quotation Cart */}
      <QuotationCart />
    </div>
  );
}