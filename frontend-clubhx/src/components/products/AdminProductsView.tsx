
import { useState, useCallback, useEffect } from "react";
import { ProductType } from "@/types/product";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  Search, 
  Filter, 
  Eye, 
  EyeOff, 
  Edit, 
  Trash2, 
  BarChart3,
  TrendingUp,
  Package,
  AlertCircle,
  Plus,
  MoreHorizontal,
  Download,
  Upload,
  FileText
} from "lucide-react";
import AdminProductCard from "./AdminProductCard";
import ProductFilter from "./ProductFilter";
import { filterProducts, sortProducts, FilterOptions } from "@/services/productService";
import { useNavigate } from "react-router-dom";
import { useIsMobile } from "@/hooks/use-mobile";
import MobileAdminProductsView from "./MobileAdminProductsView";
import ProductBulkUploadDialog from "@/components/admin/ProductBulkUploadDialog";
import { 
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger
} from "@/components/ui/dropdown-menu";
import { downloadTemplate, exportAllProducts, exportFilteredProducts } from "@/utils/exportUtils";
import { toast } from "sonner";
import { usePagination } from "@/hooks/usePagination";
import { PaginationControls } from "@/components/ui/pagination-controls";
import { fetchProducts } from "@/services/productsApi";

export default function AdminProductsView() {
 
  const navigate = useNavigate();
  const isMobile = useIsMobile();
  
  // All hooks must be called at the top level, before any conditional returns
  const [searchQuery, setSearchQuery] = useState("");
  const [currentTab, setCurrentTab] = useState("all");
  const [filtersVisible, setFiltersVisible] = useState(false);
  const [activeFilters, setActiveFilters] = useState<FilterOptions>({
    categories: [],
    types: [],
    brands: [],
    priceRange: [0, 100000] as [number, number],
    onlyInStock: false,
  });
  const [bulkUploadOpen, setBulkUploadOpen] = useState(false);
  const [apiProducts, setApiProducts] = useState<ProductType[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    setLoading(true);
    setError(null);
    fetchProducts()
      .then(setApiProducts)
      .catch((e) => setError(e?.message ?? "Error cargando productos"))
      .finally(() => setLoading(false));
  }, []);

  const handleFilterChange = useCallback((newFilters: FilterOptions) => {
    setActiveFilters(newFilters);
  }, []);

  const toggleFilters = useCallback(() => {
    setFiltersVisible(prev => !prev);
  }, []);

  const handleAnalytics = () => {
    navigate("/main/admin/product-analytics");
  };

  const handleNewProduct = () => {
    navigate("/main/admin/products/new");
  };

  const handleBulkUpload = () => {
    setBulkUploadOpen(true);
  };

  const handleExportAll = () => {
    exportAllProducts(apiProducts);
    toast.success("Exportando todos los productos...");
  };

  const handleExportFiltered = () => {
    exportFilteredProducts(sortedProducts, `Filtros aplicados: ${activeFilterCount} filtros`);
    toast.success(`Exportando ${sortedProducts.length} productos filtrados...`);
  };

  const handleDownloadTemplate = () => {
    downloadTemplate();
    toast.success("Descargando plantilla Excel...");
  };

  const handleBulkUploadComplete = (newProducts: any[]) => {
    // In a real implementation, this would update the products state/context
    console.log("New products uploaded:", newProducts);
  };

  // Apply filters and search to products
  const filteredProducts = filterProducts(
    apiProducts,
    searchQuery,
    currentTab,
    activeFilters
  );

  // Sort products
  const sortedProducts = sortProducts(filteredProducts, "name-asc");

  // Pagination configuration for admin
  const paginationConfig = {
    initialPageSize: 16,
    enableLoadMore: false,
    maxPageSize: 50
  };

  const [paginatedProducts, paginationState, paginationActions] = usePagination(
    sortedProducts, 
    paginationConfig
  );

  // Count active filters
  const activeFilterCount = 
    activeFilters.categories.length + 
    activeFilters.brands.length + 
    activeFilters.types.length + 
    (activeFilters.onlyInStock ? 1 : 0);

  // Stats
  const totalProducts = apiProducts.length;
  const outOfStockProducts = apiProducts.filter(p => p.stock <= 0).length;  
  const lowStockProducts = apiProducts.filter(p => p.stock > 0 && p.stock <= 5).length;
  const popularProducts = apiProducts.filter(p => p.isPopular).length;

  // MOVED conditional return AFTER all hooks
  if (isMobile) {
    return <MobileAdminProductsView />;
  }

  return (
    <div className="space-y-6 overflow-hidden">
      {/* Stats Overview */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Card className="p-4">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-blue-100 rounded-lg">
              <Package className="h-5 w-5 text-blue-600" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Total productos</p>
              <p className="text-2xl font-bold">{totalProducts}</p>
            </div>
          </div>
        </Card>
        
        <Card className="p-4">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-green-100 rounded-lg">
              <TrendingUp className="h-5 w-5 text-green-600" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Populares</p>
              <p className="text-2xl font-bold">{popularProducts}</p>
            </div>
          </div>
        </Card>
        
        <Card className="p-4">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-yellow-100 rounded-lg">
              <AlertCircle className="h-5 w-5 text-yellow-600" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Stock bajo</p>
              <p className="text-2xl font-bold">{lowStockProducts}</p>
            </div>
          </div>
        </Card>
        
        <Card className="p-4">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-red-100 rounded-lg">
              <Package className="h-5 w-5 text-red-600" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Sin stock</p>
              <p className="text-2xl font-bold">{outOfStockProducts}</p>
            </div>
          </div>
        </Card>
      </div>

      {/* Search and Filter Bar */}
      <div className="flex flex-col sm:flex-row gap-3 items-center">
        <div className="relative w-full sm:flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input 
            placeholder="Buscar productos..." 
            className="pl-10 h-11"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
        
        <div className="flex items-center gap-2 w-full sm:w-auto">
          <Button 
            variant={filtersVisible ? "default" : "outline"} 
            size="sm"
            className="flex gap-2 items-center h-11 relative"
            onClick={toggleFilters}
          >
            <Filter className="h-4 w-4" />
            <span className="hidden sm:inline">Filtros</span>
            {activeFilterCount > 0 && (
              <Badge variant="secondary" className="ml-1 h-5 min-w-5 p-0 flex items-center justify-center">
                {activeFilterCount}
              </Badge>
            )}
          </Button>
          
          <Button 
            onClick={handleNewProduct}
            size="sm"
            className="flex gap-2 items-center h-11"
          >
            <Plus className="h-4 w-4" />
            <span className="hidden sm:inline">Nuevo Producto</span>
          </Button>

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button 
                variant="outline" 
                size="sm"
                className="flex gap-2 items-center h-11"
              >
                <MoreHorizontal className="h-4 w-4" />
                <span className="hidden sm:inline">Más Acciones</span>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-56">
              <DropdownMenuItem onClick={handleBulkUpload}>
                <Upload className="mr-2 h-4 w-4" />
                Carga Masiva
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={handleDownloadTemplate}>
                <Download className="mr-2 h-4 w-4" />
                Descargar Plantilla
              </DropdownMenuItem>
              <DropdownMenuItem onClick={handleExportAll}>
                <FileText className="mr-2 h-4 w-4" />
                Exportar Todos ({totalProducts})
              </DropdownMenuItem>
              <DropdownMenuItem 
                onClick={handleExportFiltered}
                disabled={sortedProducts.length === 0}
              >
                <FileText className="mr-2 h-4 w-4" />
                Exportar Filtrados ({sortedProducts.length})
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={handleAnalytics}>
                <BarChart3 className="mr-2 h-4 w-4" />
                Analíticas
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
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

        <div className="flex-1">
          {/* Category Tabs */}
          <Tabs 
            defaultValue="all" 
            value={currentTab}
            onValueChange={setCurrentTab}
            className="w-full"
          >
            <TabsList className="h-auto p-1 bg-muted/50 grid grid-cols-5 w-full mb-4">
              <TabsTrigger value="all" className="py-1.5 px-2 text-xs md:text-sm">
                Todos
              </TabsTrigger>
              <TabsTrigger value="Color" className="py-1.5 px-2 text-xs md:text-sm">
                Color
              </TabsTrigger>
              <TabsTrigger value="Care" className="py-1.5 px-2 text-xs md:text-sm">
                Cuidado
              </TabsTrigger>
              <TabsTrigger value="Styling" className="py-1.5 px-2 text-xs md:text-sm">
                Peinado
              </TabsTrigger>
              <TabsTrigger value="Technical" className="py-1.5 px-2 text-xs md:text-sm">
                Técnico
              </TabsTrigger>
            </TabsList>
            
            <TabsContent value={currentTab} className="m-0">
              {/* Results count */}
              <div className="mb-4 text-sm text-muted-foreground flex items-center">
                <span>
                  Mostrando {paginationState.displayedItems} de {sortedProducts.length} productos
                </span>
              </div>

              {/* Products Grid */}
              {sortedProducts.length > 0 ? (
                <div className="space-y-6">
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                    {paginatedProducts.map(product => (
                      <AdminProductCard 
                        key={product.id}
                        product={product}
                      />
                    ))}
                  </div>
                  
                  {/* Pagination Controls */}
                  {sortedProducts.length > paginationConfig.initialPageSize && (
                    <PaginationControls
                      state={paginationState}
                      actions={paginationActions}
                      showLoadMore={false}
                      className="mt-6"
                    />
                  )}
                </div>
              ) : (
                <div className="flex flex-col items-center justify-center p-8 bg-background border border-dashed rounded-xl">
                  <div className="text-4xl mb-4">📦</div>
                  <h3 className="text-lg font-medium mb-2">No se encontraron productos</h3>
                  <p className="text-muted-foreground text-center mb-4">
                    No hay productos que coincidan con tu búsqueda o filtros seleccionados.
                  </p>
                  <Button onClick={handleNewProduct} className="mt-2">
                    <Plus className="h-4 w-4 mr-2" />
                    Agregar Primer Producto
                  </Button>
                </div>
              )}
            </TabsContent>
          </Tabs>
        </div>
      </div>

      {/* Bulk Upload Dialog */}
      <ProductBulkUploadDialog
        open={bulkUploadOpen}
        onOpenChange={setBulkUploadOpen}
        onUploadComplete={handleBulkUploadComplete}
      />
    </div>
  );
}
