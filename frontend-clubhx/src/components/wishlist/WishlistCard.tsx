import { useState } from "react";
import { WishlistItem } from "@/types/wishlist";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { OptimizedImage } from "@/components/ui/optimized-image";
import { ShoppingBag, Trash2, Eye } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useWishlist } from "@/contexts/WishlistContext";
import { formatDistanceToNow } from "date-fns";
import { es } from "date-fns/locale";
import ProductPriceDisplay from "@/components/products/ProductPriceDisplay";

interface WishlistCardProps {
  item: WishlistItem;
  onSelect?: (productId: string, selected: boolean) => void;
  selected?: boolean;
  showCheckbox?: boolean;
}

export default function WishlistCard({ 
  item, 
  onSelect, 
  selected = false, 
  showCheckbox = false 
}: WishlistCardProps) {
  const navigate = useNavigate();
  const { removeItem, moveToQuotation } = useWishlist();
  const [imageError, setImageError] = useState(false);
  
  const { product } = item;
  const isOutOfStock = product.stock <= 0;

  const handleViewProduct = () => {
    navigate(`/main/products/${product.id}`);
  };

  const handleAddToQuotation = () => {
    moveToQuotation([product.id]);
  };

  const handleRemove = () => {
    removeItem(product.id);
  };

  const timeAgo = formatDistanceToNow(new Date(item.dateAdded), {
    addSuffix: true,
    locale: es
  });

  return (
    <Card className="group hover:shadow-md transition-all duration-200">
      <CardContent className="p-4">
        <div className="flex gap-4">
          {/* Checkbox de selección */}
          {showCheckbox && (
            <div className="flex items-center">
              <input
                type="checkbox"
                checked={selected}
                onChange={(e) => onSelect?.(product.id, e.target.checked)}
                className="w-4 h-4 rounded border-gray-300 text-primary focus:ring-primary"
              />
            </div>
          )}

          {/* Imagen del producto */}
          <div className="w-20 h-20 flex-shrink-0">
            <OptimizedImage
              src={product.image}
              alt={product.name}
              fallbackSrc="https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?auto=format&fit=crop&q=80"
              aspectRatio="square"
              objectFit="cover"
              containerClassName="w-full h-full rounded-lg overflow-hidden bg-gray-100"
              className="md:group-hover:scale-105 transition-transform duration-200"
              showSkeleton={true}
              onError={() => setImageError(true)}
            />
          </div>

          {/* Información del producto */}
          <div className="flex-1 min-w-0">
            <div className="flex items-start justify-between">
              <div className="min-w-0 flex-1">
                <h3 className="font-semibold text-sm md:text-base line-clamp-2 group-hover:text-primary transition-colors">
                  {product.name}
                </h3>
                
                <div className="flex items-center gap-2 mt-1">
                  <Badge variant="outline" className="text-xs">
                    {product.brand}
                  </Badge>
                  <Badge variant="outline" className="text-xs">
                    {product.category}
                  </Badge>
                </div>

                <div className="mt-2">
                  <ProductPriceDisplay 
                    price={product.price}
                    discount={product.discount}
                    size="small"
                  />
                </div>

                <p className="text-xs text-muted-foreground mt-1">
                  Agregado {timeAgo}
                </p>

                {item.notes && (
                  <p className="text-xs text-muted-foreground mt-1 italic">
                    "{item.notes}"
                  </p>
                )}
              </div>

              {/* Estado de stock */}
              <div className="ml-2">
                {isOutOfStock ? (
                  <Badge variant="destructive" className="text-xs">
                    Sin stock
                  </Badge>
                ) : (
                  <Badge variant="secondary" className="text-xs">
                    {product.stock} disponibles
                  </Badge>
                )}
              </div>
            </div>

            {/* Acciones */}
            <div className="flex items-center justify-between mt-3">
              <div className="flex items-center gap-2">
                <Button
                  onClick={handleViewProduct}
                  variant="outline"
                  size="sm"
                  className="h-8 px-3"
                >
                  <Eye className="h-3 w-3 mr-1" />
                  Ver
                </Button>
                
                <Button
                  onClick={handleAddToQuotation}
                  disabled={isOutOfStock}
                  variant="default"
                  size="sm"
                  className="h-8 px-3"
                >
                  <ShoppingBag className="h-3 w-3 mr-1" />
                  Cotizar
                </Button>
              </div>

              <Button
                onClick={handleRemove}
                variant="ghost"
                size="sm"
                className="h-8 w-8 p-0 text-muted-foreground hover:text-destructive"
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