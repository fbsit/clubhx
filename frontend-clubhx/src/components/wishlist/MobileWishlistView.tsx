import { useState, useMemo } from "react";
import { useWishlist } from "@/contexts/WishlistContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { Heart, Search, Filter, ShoppingBag, Trash2, Package, Eye, Plus } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { OptimizedImage } from "@/components/ui/optimized-image";
import ProductPriceDisplay from "@/components/products/ProductPriceDisplay";
import { formatDistanceToNow } from "date-fns";
import { es } from "date-fns/locale";
import { WishlistItem } from "@/types/wishlist";

export default function MobileWishlistView() {
  const { items, clearWishlist, moveToQuotation, removeItem, itemsCount } = useWishlist();
  const navigate = useNavigate();

  const [searchQuery, setSearchQuery] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("all");
  const [stockFilter, setStockFilter] = useState("all");
  const [filtersOpen, setFiltersOpen] = useState(false);

  // Filtrar items
  const filteredItems = useMemo(() => {
    return items.filter(item => {
      const matchesSearch = item.product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                           item.product.brand.toLowerCase().includes(searchQuery.toLowerCase());
      
      const matchesCategory = categoryFilter === "all" || item.product.category === categoryFilter;
      
      const matchesStock = stockFilter === "all" || 
                          (stockFilter === "in-stock" && item.product.stock > 0) ||
                          (stockFilter === "out-of-stock" && item.product.stock <= 0);

      return matchesSearch && matchesCategory && matchesStock;
    });
  }, [items, searchQuery, categoryFilter, stockFilter]);

  // Obtener categorías únicas
  const categories = useMemo(() => {
    const uniqueCategories = [...new Set(items.map(item => item.product.category))];
    return uniqueCategories.sort();
  }, [items]);

  const handleViewProduct = (productId: string) => {
    navigate(`/main/products/${productId}`);
  };

  const handleAddToQuotation = (productId: string) => {
    moveToQuotation([productId]);
  };

  const handleRemove = (productId: string) => {
    removeItem(productId);
  };

  if (items.length === 0) {
    return (
      <div className="min-h-screen bg-background px-4 py-6">
        <div className="text-center py-12">
          <Heart className="h-16 w-16 mx-auto text-muted-foreground mb-4" />
          <h2 className="text-xl font-bold mb-2">Tu lista de deseos está vacía</h2>
          <p className="text-muted-foreground mb-6 text-sm">
            Guarda productos que te interesen para encontrarlos fácilmente después.
          </p>
          <Button onClick={() => navigate("/main/products")} className="w-full max-w-xs">
            <Package className="h-4 w-4 mr-2" />
            Explorar Productos
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header fijo */}
      <div className="sticky top-0 z-10 bg-background border-b px-4 py-3">
        <div className="flex items-center justify-between mb-3">
          <div>
            <h1 className="text-xl font-bold flex items-center gap-2">
              <Heart className="h-5 w-5 text-red-500" />
              Lista de Deseos
            </h1>
            <p className="text-sm text-muted-foreground">
              {filteredItems.length} de {itemsCount} productos
            </p>
          </div>

          <Sheet open={filtersOpen} onOpenChange={setFiltersOpen}>
            <SheetTrigger asChild>
              <Button variant="outline" size="sm">
                <Filter className="h-4 w-4" />
              </Button>
            </SheetTrigger>
            <SheetContent side="right" className="w-[300px]">
              <SheetHeader>
                <SheetTitle>Filtros</SheetTitle>
              </SheetHeader>
              <div className="space-y-4 mt-6">
                <div>
                  <label className="text-sm font-medium mb-2 block">Categoría</label>
                  <select 
                    value={categoryFilter} 
                    onChange={(e) => setCategoryFilter(e.target.value)}
                    className="w-full p-2 border rounded-lg bg-background"
                  >
                    <option value="all">Todas las categorías</option>
                    {categories.map(category => (
                      <option key={category} value={category}>
                        {category}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="text-sm font-medium mb-2 block">Disponibilidad</label>
                  <select 
                    value={stockFilter} 
                    onChange={(e) => setStockFilter(e.target.value)}
                    className="w-full p-2 border rounded-lg bg-background"
                  >
                    <option value="all">Todos</option>
                    <option value="in-stock">En stock</option>
                    <option value="out-of-stock">Sin stock</option>
                  </select>
                </div>

                <div className="pt-4 space-y-2">
                  <Button 
                    onClick={() => moveToQuotation(filteredItems.map(item => item.product.id))}
                    className="w-full"
                  >
                    <ShoppingBag className="h-4 w-4 mr-2" />
                    Agregar Todo a Cotización
                  </Button>
                  <Button 
                    onClick={clearWishlist}
                    variant="outline"
                    className="w-full"
                  >
                    <Trash2 className="h-4 w-4 mr-2" />
                    Limpiar Lista
                  </Button>
                </div>
              </div>
            </SheetContent>
          </Sheet>
        </div>

        {/* Búsqueda */}
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Buscar productos..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10"
          />
        </div>
      </div>

      {/* Lista de productos */}
      <div className="px-4 pb-20">
        {filteredItems.length === 0 ? (
          <div className="py-12 text-center">
            <Filter className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
            <h3 className="text-lg font-semibold mb-2">No se encontraron productos</h3>
            <p className="text-muted-foreground text-sm">
              Prueba ajustando los filtros de búsqueda.
            </p>
          </div>
        ) : (
          <div className="space-y-3 pt-4">
            {filteredItems.map(item => (
              <MobileWishlistCard
                key={item.id}
                item={item}
                onView={handleViewProduct}
                onAddToQuotation={handleAddToQuotation}
                onRemove={handleRemove}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

interface MobileWishlistCardProps {
  item: WishlistItem;
  onView: (productId: string) => void;
  onAddToQuotation: (productId: string) => void;
  onRemove: (productId: string) => void;
}

function MobileWishlistCard({ item, onView, onAddToQuotation, onRemove }: MobileWishlistCardProps) {
  const { product } = item;
  const isOutOfStock = product.stock <= 0;

  const timeAgo = formatDistanceToNow(new Date(item.dateAdded), {
    addSuffix: true,
    locale: es
  });

  return (
    <Card className="overflow-hidden">
      <CardContent className="p-3">
        <div className="flex gap-3">
          {/* Imagen del producto */}
          <div className="w-16 h-16 flex-shrink-0">
            <OptimizedImage
              src={product.image}
              alt={product.name}
              fallbackSrc="https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?auto=format&fit=crop&q=80"
              aspectRatio="square"
              objectFit="cover"
              containerClassName="w-full h-full rounded-lg overflow-hidden bg-gray-100"
              className="transition-transform duration-200"
              showSkeleton={true}
            />
          </div>

          {/* Información del producto */}
          <div className="flex-1 min-w-0">
            <h3 className="font-semibold text-sm line-clamp-2 mb-1">
              {product.name}
            </h3>
            
            <div className="flex items-center gap-1 mb-2">
              <Badge variant="outline" className="text-xs px-1 py-0">
                {product.brand}
              </Badge>
              {isOutOfStock ? (
                <Badge variant="destructive" className="text-xs px-1 py-0">
                  Sin stock
                </Badge>
              ) : (
                <Badge variant="secondary" className="text-xs px-1 py-0">
                  {product.stock} disp.
                </Badge>
              )}
            </div>

            <div className="mb-2">
              <ProductPriceDisplay 
                price={product.price}
                discount={product.discount}
                size="small"
              />
            </div>

            <p className="text-xs text-muted-foreground mb-3">
              {timeAgo}
            </p>

            {/* Acciones */}
            <div className="flex items-center gap-2">
              <Button
                onClick={() => onView(product.id)}
                variant="outline"
                size="sm"
                className="h-7 px-2 text-xs flex-1"
              >
                <Eye className="h-3 w-3 mr-1" />
                Ver
              </Button>
              
              <Button
                onClick={() => onAddToQuotation(product.id)}
                disabled={isOutOfStock}
                variant="default"
                size="sm"
                className="h-7 px-2 text-xs flex-1"
              >
                <Plus className="h-3 w-3 mr-1" />
                Cotizar
              </Button>

              <Button
                onClick={() => onRemove(product.id)}
                variant="ghost"
                size="sm"
                className="h-7 w-7 p-0 text-muted-foreground hover:text-destructive"
              >
                <Trash2 className="h-3 w-3" />
              </Button>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}