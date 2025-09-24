import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Dialog } from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Search, Plus, Star, ArrowUpDown, Filter, Edit, Trash2, MoreHorizontal, RefreshCw } from "lucide-react";
import { useNavigate } from "react-router-dom";
import LoyaltyProductForm from "@/components/admin/loyalty/LoyaltyProductForm";
import ProductTypeSelector from "@/components/admin/loyalty/ProductTypeSelector";
import ProductCard from "@/components/loyalty/ProductCard";
import ProductStatsDialog from "@/components/admin/loyalty/ProductStatsDialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger
} from "@/components/ui/dropdown-menu";
import { LoyaltyProduct } from "@/utils/loyaltyRewardAdapter";
import { LoyaltyRewardStatus } from "@/services/loyaltyRewardsApi";

interface DesktopAdminLoyaltyProductsProps {
  products: LoyaltyProduct[];
  setProducts: (products: LoyaltyProduct[]) => void;
  loading?: boolean;
  error?: string | null;
  onSaveReward?: (reward: LoyaltyProduct) => Promise<void>;
  onDeleteReward?: (rewardId: string) => Promise<void>;
  onToggleFeatured?: (rewardId: string) => Promise<void>;
  onChangeStatus?: (rewardId: string, status: string) => Promise<void>;
  onUpdateStock?: (rewardId: string, stockQuantity: number) => Promise<void>;
  onRefresh?: () => Promise<void>;
  createEmptyProduct?: () => LoyaltyProduct;
}

export default function DesktopAdminLoyaltyProducts({ 
  products, 
  setProducts,
  loading = false,
  error = null,
  onSaveReward,
  onDeleteReward,
  onToggleFeatured,
  onChangeStatus,
  onUpdateStock,
  onRefresh,
  createEmptyProduct
}: DesktopAdminLoyaltyProductsProps) {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState("");
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [showTypeSelector, setShowTypeSelector] = useState(false);
  const [showStatsDialog, setShowStatsDialog] = useState(false);
  const [currentProduct, setCurrentProduct] = useState<LoyaltyProduct | null>(null);
  const [isNewProduct, setIsNewProduct] = useState(false);
  const [activeCategory, setActiveCategory] = useState("all");
  const [sortOption, setSortOption] = useState("featured");
  const [isSaving, setIsSaving] = useState(false);

  // Filter products based on search query and active category
  const filteredProducts = products.filter(product => {
    const matchesSearch = 
      product.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
      product.description.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesCategory = 
      activeCategory === "all" || 
      product.category === activeCategory;
    
    return matchesSearch && matchesCategory;
  });
  
  // Sort products based on selected option
  const sortedProducts = [...filteredProducts].sort((a, b) => {
    switch (sortOption) {
      case "featured":
        return a.featured === b.featured ? 0 : a.featured ? -1 : 1;
      case "pointsAsc":
        return a.pointsCost - b.pointsCost;
      case "pointsDesc":
        return b.pointsCost - a.pointsCost;
      case "name":
        return a.name.localeCompare(b.name);
      default:
        return 0;
    }
  });

  const handleEditProduct = (product: LoyaltyProduct) => {
    setCurrentProduct(product);
    setIsNewProduct(false);
    setIsDialogOpen(true);
  };

  const handleDeleteProduct = async (productId: string) => {
    if (onDeleteReward) {
      await onDeleteReward(productId);
    } else {
      setProducts(products.filter(product => product.id !== productId));
    }
  };

  const handleAddProduct = () => {
    setShowTypeSelector(true);
  };

  const handleSelectProductType = (type: "product" | "discount" | "event" | "training") => {
    setShowTypeSelector(false);
    
    if (type === "event" || type === "training") {
      navigate("/main/events");
      return;
    }
    
    if (createEmptyProduct) {
      const newProduct = createEmptyProduct();
      newProduct.category = type;
      setCurrentProduct(newProduct);
    } else {
      setCurrentProduct({
        id: `LP${String(products.length + 1).padStart(3, '0')}`,
        name: "",
        category: type,
        description: "",
        pointsCost: 1000,
        image: "",
        available: null,
        featured: false
      });
    }
    setIsNewProduct(true);
    setIsDialogOpen(true);
  };

  const handleSaveProduct = async () => {
    if (!currentProduct) return;
    
    try {
      setIsSaving(true);
      if (onSaveReward) {
        await onSaveReward(currentProduct);
      } else {
        if (isNewProduct) {
          setProducts([...products, currentProduct]);
        } else {
          setProducts(products.map(product => 
            product.id === currentProduct.id ? currentProduct : product
          ));
        }
      }
      setIsDialogOpen(false);
      setCurrentProduct(null);
    } catch (error) {
      console.error('Error saving product:', error);
    } finally {
      setIsSaving(false);
    }
  };

  const handleRedeem = (product: LoyaltyProduct) => {
    // Para eventos y capacitaciones, redirigir directamente a la página de eventos
    if (product.category === "event" || product.category === "training") {
      navigate("/main/events");
      return;
    }
    
    // Para productos y descuentos, mostrar estadísticas
    setCurrentProduct(product);
    setShowStatsDialog(true);
  };

  const handleEditFromStats = () => {
    setShowStatsDialog(false);
    setIsNewProduct(false);
    setIsDialogOpen(true);
  };

  const handleToggleFeatured = async (productId: string) => {
    if (onToggleFeatured) {
      await onToggleFeatured(productId);
    }
  };

  const handleChangeStatus = async (productId: string, status: string) => {
    if (onChangeStatus) {
      await onChangeStatus(productId, status);
    }
  };

  const handleUpdateStock = async (productId: string, stockQuantity: number) => {
    if (onUpdateStock) {
      await onUpdateStock(productId, stockQuantity);
    }
  };
  
  // Calculate stats
  const totalProducts = products.length;
  const featuredCount = products.filter(p => p.featured).length;
  const categoryCounts = products.reduce((acc, product) => {
    acc[product.category] = (acc[product.category] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  if (loading) {
    return (
      <div className="w-full min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">Cargando productos de lealtad...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="w-full min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <p className="text-destructive mb-4">Error: {error}</p>
          <Button onClick={onRefresh} variant="outline">
            <RefreshCw className="h-4 w-4 mr-2" />
            Reintentar
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full min-h-screen bg-background">
      {/* Header */}
      <div className="sticky top-0 z-10 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 border-b">
        <div className="container mx-auto px-4 py-4">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
            <div>
              <h1 className="text-2xl font-bold">Productos de Lealtad</h1>
              <p className="text-muted-foreground">
                {totalProducts} productos • {featuredCount} destacados
              </p>
            </div>
            
            <div className="flex items-center gap-2">
              <Button variant="outline" size="sm" onClick={onRefresh}>
                <RefreshCw className="h-4 w-4 mr-2" />
                Actualizar
              </Button>
              <Button onClick={handleAddProduct} size="sm">
                <Plus className="h-4 w-4 mr-2" />
                Agregar Producto
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Filters and Search */}
      <div className="container mx-auto px-4 py-6">
        <div className="flex flex-col lg:flex-row gap-4 mb-6">
          <div className="flex-1">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
              <Input
                placeholder="Buscar productos..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>
          </div>
          
          <div className="flex items-center gap-2">
            <Tabs value={activeCategory} onValueChange={setActiveCategory} className="w-auto">
              <TabsList className="grid w-full grid-cols-5">
                <TabsTrigger value="all">Todos</TabsTrigger>
                <TabsTrigger value="product">Productos</TabsTrigger>
                <TabsTrigger value="discount">Descuentos</TabsTrigger>
                <TabsTrigger value="event">Eventos</TabsTrigger>
                <TabsTrigger value="training">Capacitación</TabsTrigger>
              </TabsList>
            </Tabs>
            
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" size="sm">
                  <ArrowUpDown className="h-4 w-4 mr-2" />
                  Ordenar
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem onClick={() => setSortOption("featured")}>
                  Destacados primero
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => setSortOption("pointsAsc")}>
                  Menos puntos
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => setSortOption("pointsDesc")}>
                  Más puntos
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => setSortOption("name")}>
                  Nombre A-Z
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>

        {/* Products Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {sortedProducts.map((product) => (
            <ProductCard
              key={product.id}
              product={product}
              onEdit={() => handleEditProduct(product)}
              onDelete={() => handleDeleteProduct(product.id)}
              onRedeem={() => handleRedeem(product)}
              onToggleFeatured={() => handleToggleFeatured(product.id)}
              onChangeStatus={(status) => handleChangeStatus(product.id, status)}
              onUpdateStock={(stock) => handleUpdateStock(product.id, stock)}
              isAdmin={true}
            />
          ))}
        </div>

        {sortedProducts.length === 0 && (
          <div className="text-center py-12">
            <p className="text-muted-foreground">No se encontraron productos</p>
          </div>
        )}
      </div>

      {/* Dialogs */}
      {showTypeSelector && (
        <ProductTypeSelector
          open={showTypeSelector}
          onOpenChange={setShowTypeSelector}
          onSelect={handleSelectProductType}
        />
      )}

      {currentProduct && (
        <LoyaltyProductForm
          open={isDialogOpen}
          onOpenChange={setIsDialogOpen}
          product={currentProduct}
          isNew={isNewProduct}
          onChangeProduct={setCurrentProduct}
          onSave={handleSaveProduct}
          isSaving={isSaving}
        />
      )}

      {currentProduct && (
        <ProductStatsDialog
          open={showStatsDialog}
          onOpenChange={setShowStatsDialog}
          product={currentProduct}
          onEdit={handleEditFromStats}
        />
      )}
    </div>
  );
}
