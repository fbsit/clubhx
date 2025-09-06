
import { useState, useCallback, useEffect } from "react";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
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
  MoreHorizontal,
  Plus,
  Upload,
  Download,
  FileText
} from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger
} from "@/components/ui/dropdown-menu";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { filterProducts, sortProducts, FilterOptions } from "@/services/productService";
import { useNavigate } from "react-router-dom";
import ProductBulkUploadDialog from "@/components/admin/ProductBulkUploadDialog";
import { downloadTemplate, exportAllProducts, exportFilteredProducts } from "@/utils/exportUtils";
import { toast } from "sonner";
import { fetchProducts } from "@/services/productsApi";

export default function MobileAdminProductsView() {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState("");
  const [currentTab, setCurrentTab] = useState("all");
  const [activeFilters, setActiveFilters] = useState<FilterOptions>({
    categories: [],
    types: [],
    brands: [],
    priceRange: [0, 100000] as [number, number],
    onlyInStock: false,
  });
  const [bulkUploadOpen, setBulkUploadOpen] = useState(false);
  const [showFabMenu, setShowFabMenu] = useState(false);

  const [products, setProducts] = useState<any[]>([]);
  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const data = await fetchProducts(500);
        if (!cancelled) setProducts(data);
      } catch {
        if (!cancelled) setProducts([]);
      }
    })();
    return () => { cancelled = true; };
  }, []);

  // Apply filters and search to products
  const filteredProducts = filterProducts(
    products as any,
    searchQuery,
    currentTab,
    activeFilters
  );

  // Sort products
  const sortedProducts = sortProducts(filteredProducts, "name-asc");

  // Count active filters
  const activeFilterCount = 
    activeFilters.categories.length + 
    activeFilters.brands.length + 
    activeFilters.types.length + 
    (activeFilters.onlyInStock ? 1 : 0);

  const handleAnalytics = () => {
    navigate("/main/admin/product-analytics");
  };

  const handleNewProduct = () => {
    navigate("/main/admin/products/new");
    setShowFabMenu(false);
  };

  const handleBulkUpload = () => {
    setBulkUploadOpen(true);
    setShowFabMenu(false);
  };

  const handleExportAll = () => {
    exportAllProducts(products);
    toast.success("Exportando todos los productos...");
    setShowFabMenu(false);
  };

  const handleExportFiltered = () => {
    exportFilteredProducts(sortedProducts, `Filtros aplicados: ${activeFilterCount} filtros`);
    toast.success(`Exportando ${sortedProducts.length} productos filtrados...`);
    setShowFabMenu(false);
  };

  const handleDownloadTemplate = () => {
    downloadTemplate();
    toast.success("Descargando plantilla Excel...");
    setShowFabMenu(false);
  };

  const handleBulkUploadComplete = (newProducts: any[]) => {
    // In a real implementation, this would update the products state/context
    console.log("New products uploaded:", newProducts);
  };

  // Fixed navigation functions
  const handleViewProduct = (productId: string) => {
    navigate(`/main/products/${productId}`);
  };

  const handleEditProduct = (productId: string) => {
    navigate(`/main/admin/products/${productId}`);
  };

  // Stats
  const totalProducts = products.length;
  const outOfStockProducts = products.filter((p: any) => p.stock <= 0).length;  
  const lowStockProducts = products.filter((p: any) => p.stock > 0 && p.stock <= 5).length;
  const popularProducts = products.filter((p: any) => p.isPopular).length;

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('es-CL', {
      style: 'currency',
      currency: 'CLP'
    }).format(price);
  };

  const getStockStatus = (stock: number) => {
    if (stock <= 0) return { label: "Sin stock", color: "bg-red-500" };
    if (stock <= 5) return { label: "Stock bajo", color: "bg-yellow-500" };
    return { label: "En stock", color: "bg-green-500" };
  };

  return (
    <div className="w-full min-h-screen bg-background overflow-x-hidden">
      <div className="px-4 py-3 max-w-full overflow-hidden">
        
        {/* Compact Stats Grid - Fixed width issues */}
        <div className="grid grid-cols-2 gap-3 mb-4">
          <Card className="p-3 border-border/40">
            <div className="flex items-center gap-2">
              <div className="flex-shrink-0 p-2 bg-blue-50 rounded-lg">
                <Package className="h-4 w-4 text-blue-600" />
              </div>
              <div className="min-w-0 flex-1">
                <p className="text-xs text-muted-foreground truncate">Total</p>
                <p className="text-lg font-bold">{totalProducts}</p>
              </div>
            </div>
          </Card>
          
          <Card className="p-3 border-border/40">
            <div className="flex items-center gap-2">
              <div className="flex-shrink-0 p-2 bg-green-50 rounded-lg">
                <TrendingUp className="h-4 w-4 text-green-600" />
              </div>
              <div className="min-w-0 flex-1">
                <p className="text-xs text-muted-foreground truncate">Popular</p>
                <p className="text-lg font-bold">{popularProducts}</p>
              </div>
            </div>
          </Card>
          
          <Card className="p-3 border-border/40">
            <div className="flex items-center gap-2">
              <div className="flex-shrink-0 p-2 bg-yellow-50 rounded-lg">
                <AlertCircle className="h-4 w-4 text-yellow-600" />
              </div>
              <div className="min-w-0 flex-1">
                <p className="text-xs text-muted-foreground truncate">Stock bajo</p>
                <p className="text-lg font-bold">{lowStockProducts}</p>
              </div>
            </div>
          </Card>
          
          <Card className="p-3 border-border/40">
            <div className="flex items-center gap-2">
              <div className="flex-shrink-0 p-2 bg-red-50 rounded-lg">
                <Package className="h-4 w-4 text-red-600" />
              </div>
              <div className="min-w-0 flex-1">
                <p className="text-xs text-muted-foreground truncate">Sin stock</p>
                <p className="text-lg font-bold">{outOfStockProducts}</p>
              </div>
            </div>
          </Card>
        </div>
        
        {/* Search Bar - Full width, properly contained */}
        <div className="space-y-3 mb-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input 
              placeholder="Buscar productos..." 
              className="pl-10 w-full"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          
          {/* Category Select and Analytics Button */}
          <div className="flex gap-2">
            <Select value={currentTab} onValueChange={setCurrentTab}>
              <SelectTrigger className="flex-1">
                <SelectValue placeholder="Categoría" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todos ({totalProducts})</SelectItem>
                <SelectItem value="Color">Color ({products.filter((p: any) => p.category === "Color").length})</SelectItem>
                <SelectItem value="Care">Cuidado ({products.filter((p: any) => p.category === "Care").length})</SelectItem>
                <SelectItem value="Styling">Peinado ({products.filter((p: any) => p.category === "Styling").length})</SelectItem>
                <SelectItem value="Technical">Técnico ({products.filter((p: any) => p.category === "Technical").length})</SelectItem>
              </SelectContent>
            </Select>
            
            <Button 
              variant="outline" 
              size="sm"
              className="flex-shrink-0"
              onClick={handleAnalytics}
            >
              <BarChart3 className="h-4 w-4" />
            </Button>
          </div>
        </div>

        {/* Results count */}
        <div className="mb-3 text-sm text-muted-foreground">
          {sortedProducts.length} producto{sortedProducts.length !== 1 ? 's' : ''} encontrado{sortedProducts.length !== 1 ? 's' : ''}
        </div>

        {/* Mobile Product Cards - Redesigned to prevent overflow */}
        {sortedProducts.length > 0 ? (
          <div className="space-y-3 pb-24">
            {sortedProducts.map(product => {
              const stockStatus = getStockStatus(product.stock);
              
              return (
                <Card key={product.id} className="overflow-hidden shadow-sm border-border/40 max-w-full">
                  <div className="p-4">
                    {/* Top Section: Image + Info + Actions */}
                    <div className="flex gap-3 mb-3">
                      {/* Product Image - Fixed size */}
                      <div className="w-16 h-16 bg-muted rounded-lg flex-shrink-0 overflow-hidden">
                        <img 
                          src={product.image} 
                          alt={product.name}
                          className="w-full h-full object-cover"
                        />
                      </div>
                      
                      {/* Product Info - Flexible width with proper truncation */}
                      <div className="flex-1 min-w-0">
                        <p className="text-xs text-muted-foreground mb-1 truncate">{product.brand}</p>
                        <h3 className="font-medium text-sm leading-tight mb-2 line-clamp-2 break-words">{product.name}</h3>
                        <div className="flex items-center gap-2 flex-wrap">
                          <span className="text-lg font-bold">{formatPrice(product.price)}</span>
                          {product.discount > 0 && (
                            <Badge variant="destructive" className="text-xs px-2 py-0.5">
                              -{product.discount}%
                            </Badge>
                          )}
                        </div>
                      </div>
                      
                      {/* Actions Menu - Fixed position */}
                      <div className="flex-shrink-0">
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                              <MoreHorizontal className="h-4 w-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuItem onClick={() => handleEditProduct(product.id)}>
                              <Edit className="mr-2 h-4 w-4" /> Editar
                            </DropdownMenuItem>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem className="text-red-500 focus:text-red-500">
                              <Trash2 className="mr-2 h-4 w-4" /> Eliminar
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </div>
                    </div>
                    
                    {/* Bottom Section: Status + Stock */}
                    <div className="flex items-center justify-between gap-2">
                      <div className="flex items-center gap-2 flex-wrap min-w-0">
                        <Badge 
                          className={`${stockStatus.color} text-white text-xs px-2 py-1 flex-shrink-0`}
                        >
                          {stockStatus.label}
                        </Badge>
                        {product.isPopular && (
                          <Badge variant="secondary" className="text-xs px-2 py-1 flex-shrink-0">
                            Popular
                          </Badge>
                        )}
                      </div>
                      <span className="text-xs text-muted-foreground flex-shrink-0">
                        Stock: {product.stock}
                      </span>
                    </div>
                  </div>
                </Card>
              );
            })}
          </div>
          ) : (
            <div className="flex flex-col items-center justify-center py-12 text-center px-4">
              <div className="text-4xl mb-4">📦</div>
              <h3 className="text-lg font-medium mb-2">No se encontraron productos</h3>
              <p className="text-muted-foreground mb-4">
                No hay productos que coincidan con tu búsqueda o filtros seleccionados.
              </p>
              <Button onClick={handleNewProduct}>
                <Plus className="h-4 w-4 mr-2" />
                Agregar Producto
              </Button>
            </div>
          )}

        {/* Floating Action Button */}
        <div className="fixed bottom-6 right-4 z-50">
          <DropdownMenu open={showFabMenu} onOpenChange={setShowFabMenu}>
            <DropdownMenuTrigger asChild>
              <Button 
                size="lg"
                className="rounded-full w-14 h-14 shadow-lg hover:shadow-xl transition-all duration-200"
              >
                <Plus className="h-6 w-6" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent 
              align="end" 
              side="top" 
              className="w-56 mb-2"
              sideOffset={8}
            >
              <DropdownMenuItem onClick={handleNewProduct}>
                <Plus className="mr-2 h-4 w-4" />
                Nuevo Producto
              </DropdownMenuItem>
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
            </DropdownMenuContent>
          </DropdownMenu>
        </div>

        {/* Bulk Upload Dialog */}
        <ProductBulkUploadDialog
          open={bulkUploadOpen}
          onOpenChange={setBulkUploadOpen}
          onUploadComplete={handleBulkUploadComplete}
        />
      </div>
    </div>
  );
}
