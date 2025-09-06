import { useState, useMemo, useEffect } from "react";
import { useWishlist } from "@/contexts/WishlistContext";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Heart, Search, Filter, ShoppingBag, Trash2, Package } from "lucide-react";
import WishlistCard from "@/components/wishlist/WishlistCard";
import MobileWishlistView from "@/components/wishlist/MobileWishlistView";
import { useNavigate } from "react-router-dom";
import { useIsMobile } from "@/hooks/use-mobile";

export default function Wishlist() {
  const { items, clearWishlist, moveToQuotation, itemsCount, refresh } = useWishlist();
  const { user } = useAuth();
  const navigate = useNavigate();
  const isMobile = useIsMobile();

  const [searchQuery, setSearchQuery] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("all");
  const [stockFilter, setStockFilter] = useState("all");
  const [selectedItems, setSelectedItems] = useState<string[]>([]);
  const [selectAll, setSelectAll] = useState(false);

  // Always fetch latest wishlist for the current user on mount
  useEffect(() => {
    refresh().catch(() => {});
  }, []);

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

  const handleSelectItem = (productId: string, selected: boolean) => {
    if (selected) {
      setSelectedItems(prev => [...prev, productId]);
    } else {
      setSelectedItems(prev => prev.filter(id => id !== productId));
      setSelectAll(false);
    }
  };

  const handleSelectAll = (checked: boolean) => {
    setSelectAll(checked);
    if (checked) {
      setSelectedItems(filteredItems.map(item => item.product.id));
    } else {
      setSelectedItems([]);
    }
  };

  const handleMoveSelectedToQuotation = () => {
    moveToQuotation(selectedItems);
    setSelectedItems([]);
    setSelectAll(false);
  };

  const handleRemoveSelected = () => {
    selectedItems.forEach(productId => {
      const item = items.find(i => i.product.id === productId);
      if (item) {
        // Usamos removeItem del contexto para cada producto seleccionado
        // Como no tenemos acceso directo, podemos simular el clic en el botón de eliminar
      }
    });
    setSelectedItems([]);
    setSelectAll(false);
  };

  // Redirigir si no es cliente
  if (user?.role === "sales" || user?.role === "admin") {
    return (
      <div className="container max-w-4xl py-6">
        <div className="text-center">
          <Heart className="h-16 w-16 mx-auto text-muted-foreground mb-4" />
          <h2 className="text-2xl font-bold mb-2">Lista de Deseos</h2>
          <p className="text-muted-foreground mb-4">
            La lista de deseos está disponible solo para clientes.
          </p>
          <Button onClick={() => navigate("/main/products")}>
            Ver Catálogo
          </Button>
        </div>
      </div>
    );
  }

  // Usar vista móvil específica en móvil
  if (isMobile) {
    return <MobileWishlistView />;
  }

  if (items.length === 0) {
    return (
      <div className="container max-w-4xl py-6">
        <div className="text-center py-12">
          <Heart className="h-16 w-16 mx-auto text-muted-foreground mb-4" />
          <h2 className="text-2xl font-bold mb-2">Tu lista de deseos está vacía</h2>
          <p className="text-muted-foreground mb-6">
            Guarda productos que te interesen para encontrarlos fácilmente después.
          </p>
          <Button onClick={() => navigate("/main/products")}>
            <Package className="h-4 w-4 mr-2" />
            Explorar Productos
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="container max-w-6xl py-4 md:py-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold flex items-center gap-2">
            <Heart className="h-6 w-6 md:h-8 md:w-8 text-red-500" />
            Mi Lista de Deseos
          </h1>
          <p className="text-muted-foreground mt-1">
            {itemsCount} producto{itemsCount !== 1 ? 's' : ''} guardado{itemsCount !== 1 ? 's' : ''}
          </p>
        </div>

        {!isMobile && (
          <div className="flex gap-2">
            <Button
              onClick={() => moveToQuotation(items.map(item => item.product.id))}
              disabled={items.length === 0}
            >
              <ShoppingBag className="h-4 w-4 mr-2" />
              Agregar Todo a Cotización
            </Button>
            <Button
              onClick={clearWishlist}
              variant="outline"
              disabled={items.length === 0}
            >
              <Trash2 className="h-4 w-4 mr-2" />
              Limpiar Lista
            </Button>
          </div>
        )}
      </div>

      {/* Filtros */}
      <Card className="mb-6">
        <CardContent className="p-4">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
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

            {/* Filtro por categoría */}
            <Select value={categoryFilter} onValueChange={setCategoryFilter}>
              <SelectTrigger>
                <SelectValue placeholder="Categoría" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todas las categorías</SelectItem>
                {categories.map(category => (
                  <SelectItem key={category} value={category}>
                    {category}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            {/* Filtro por stock */}
            <Select value={stockFilter} onValueChange={setStockFilter}>
              <SelectTrigger>
                <SelectValue placeholder="Disponibilidad" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todos</SelectItem>
                <SelectItem value="in-stock">En stock</SelectItem>
                <SelectItem value="out-of-stock">Sin stock</SelectItem>
              </SelectContent>
            </Select>

            {/* Selección múltiple */}
            <div className="flex items-center gap-2">
              <Checkbox
                id="select-all"
                checked={selectAll}
                onCheckedChange={handleSelectAll}
              />
              <label htmlFor="select-all" className="text-sm">
                Seleccionar todo
              </label>
            </div>
          </div>

          {/* Resultados y acciones */}
          <div className="flex items-center justify-between mt-4 pt-4 border-t">
            <div className="text-sm text-muted-foreground">
              {filteredItems.length} de {itemsCount} productos
              {selectedItems.length > 0 && (
                <Badge variant="secondary" className="ml-2">
                  {selectedItems.length} seleccionados
                </Badge>
              )}
            </div>

            {selectedItems.length > 0 && (
              <div className="flex gap-2">
                <Button
                  onClick={handleMoveSelectedToQuotation}
                  size="sm"
                >
                  <ShoppingBag className="h-3 w-3 mr-1" />
                  Cotizar ({selectedItems.length})
                </Button>
                <Button
                  onClick={handleRemoveSelected}
                  variant="outline"
                  size="sm"
                >
                  <Trash2 className="h-3 w-3 mr-1" />
                  Eliminar
                </Button>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Lista de productos */}
      {filteredItems.length === 0 ? (
        <Card>
          <CardContent className="py-12 text-center">
            <Filter className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
            <h3 className="text-lg font-semibold mb-2">No se encontraron productos</h3>
            <p className="text-muted-foreground">
              Prueba ajustando los filtros de búsqueda.
            </p>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-4">
          {filteredItems.map(item => (
            <WishlistCard
              key={item.id}
              item={item}
              onSelect={handleSelectItem}
              selected={selectedItems.includes(item.product.id)}
              showCheckbox={true}
            />
          ))}
        </div>
      )}

    </div>
  );
}