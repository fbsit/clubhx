
import { memo, useState } from "react";
import { ProductType } from "@/types/product";
import { useNavigate } from "react-router-dom";
import { useQuotation } from "@/contexts/QuotationContext";
import { useAuth } from "@/contexts/AuthContext";
import { toast } from "sonner";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ShoppingBag, Star, Bell, Bookmark, Search } from "lucide-react";
import { OptimizedImage } from "@/components/ui/optimized-image";
import ProductPriceDisplay from "./ProductPriceDisplay";
import NotifyWhenAvailableDialog from "./stock/NotifyWhenAvailableDialog";
import ReserveProductDialog from "./stock/ReserveProductDialog";

interface MobileProductCardProps {
  product: ProductType;
  viewMode: "grid" | "list";
}

const MobileProductCard = ({ product, viewMode }: MobileProductCardProps) => {
  const navigate = useNavigate();
  const { addItem } = useQuotation();
  const { user } = useAuth();
  const isOutOfStock = product.stock <= 0;
  const [quantity] = useState(1);
  const isSalesUser = user?.role === "sales";
  const [showNotifyDialog, setShowNotifyDialog] = useState(false);
  const [showReserveDialog, setShowReserveDialog] = useState(false);

  const handleSimilarProducts = () => {
    navigate(`/main/products?category=${encodeURIComponent(product.category)}&exclude=${product.id}`);
  };
  
  const handleAddToQuote = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (!isOutOfStock && !isSalesUser) {
      addItem(product, quantity);
      toast.success(`${product.name} agregado`, {
        description: `Cantidad: ${quantity}`,
      });
    }
  };

  const handleCardClick = () => {
    navigate(`/main/products/${product.id}`);
  };

  const fallbackImage = "https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?auto=format&fit=crop&q=80";

  if (viewMode === "list") {
    return (
      <Card 
        className="overflow-hidden bg-white border border-border/20 hover:shadow-md transition-all cursor-pointer"
        onClick={handleCardClick}
      >
        <div className="flex p-3 gap-3">
          {/* Image */}
          <div className="relative w-20 h-20 flex-shrink-0 rounded-lg overflow-hidden">
            <OptimizedImage
              src={product.image}
              alt={product.name}
              fallbackSrc={fallbackImage}
              aspectRatio="square"
              objectFit="cover"
              containerClassName="w-full h-full bg-white"
              className="w-full h-full object-cover"
            />
            {product.isNew && (
              <Badge className="absolute -top-1 -left-1 text-xs py-0 px-1 bg-blue-500">
                Nuevo
              </Badge>
            )}
          </div>

          {/* Content */}
          <div className="flex-1 min-w-0">
            <div className="flex items-start justify-between gap-2">
              <div className="flex-1 min-w-0">
                <h3 className="font-medium text-sm line-clamp-2 leading-tight mb-1">
                  {product.name}
                </h3>
                <p className="text-xs text-muted-foreground mb-1">{product.brand}</p>
                
                {/* Rating */}
                {product.rating && (
                  <div className="flex items-center gap-1 mb-1">
                    <div className="flex">
                      {[...Array(5)].map((_, i) => (
                        <Star
                          key={i}
                          className={`h-3 w-3 ${
                            i < product.rating! ? "fill-yellow-400 text-yellow-400" : "text-gray-300"
                          }`}
                        />
                      ))}
                    </div>
                    <span className="text-xs text-muted-foreground">({product.rating})</span>
                  </div>
                )}

                <ProductPriceDisplay product={product} size="small" />
                
                {product.volume && (
                  <p className="text-xs text-muted-foreground mt-1">
                    {product.volume} {product.volumeUnit}
                  </p>
                )}
              </div>

              {/* Action button */}
              <div className="flex-shrink-0">
                {isSalesUser ? (
                  <Badge variant="outline" className="text-xs py-1 border-blue-500 text-blue-500">
                    Solo lectura
                  </Badge>
                ) : isOutOfStock ? (
                  <div className="flex flex-col gap-1 min-w-0">
                    <Button
                      onClick={(e) => {
                        e.stopPropagation();
                        setShowNotifyDialog(true);
                      }}
                      size="sm"
                      variant="outline"
                      className="h-6 px-1 text-[9px] border-blue-500 text-blue-500 hover:bg-blue-50"
                    >
                      <Bell className="h-2.5 w-2.5" />
                    </Button>
                    <div className="flex gap-0.5">
                      <Button
                        onClick={(e) => {
                          e.stopPropagation();
                          setShowReserveDialog(true);
                        }}
                        size="sm"
                        variant="outline"
                        className="h-5 px-1 flex-1 text-[8px] border-orange-500 text-orange-500 hover:bg-orange-50"
                      >
                        <Bookmark className="h-2 w-2" />
                      </Button>
                      <Button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleSimilarProducts();
                        }}
                        size="sm"
                        variant="outline"
                        className="h-5 px-1 flex-1 text-[8px] border-gray-500 text-gray-500 hover:bg-gray-50"
                      >
                        <Search className="h-2 w-2" />
                      </Button>
                    </div>
                  </div>
                ) : (
                  <Button
                    onClick={handleAddToQuote}
                    size="sm"
                    className="h-8 px-3"
                  >
                    <ShoppingBag className="h-3 w-3 mr-1" />
                    Agregar
                  </Button>
                )}
              </div>
            </div>
          </div>
        </div>
      </Card>
    );
  }

  // Grid view - Amazon-style compact cards
  return (
    <Card 
      className="overflow-hidden bg-white border border-border/20 hover:shadow-lg transition-all cursor-pointer group rounded-xl"
      onClick={handleCardClick}
    >
      {/* Image section - fills top area completely with fixed height */}
      <div className="relative w-full h-40 overflow-hidden rounded-t-xl">
        <OptimizedImage
          src={product.image}
          alt={product.name}
          fallbackSrc={fallbackImage}
          aspectRatio="auto"
          objectFit="cover"
          containerClassName="w-full h-full"
          className="w-full h-full object-cover md:group-hover:scale-105 transition-transform duration-300"
        />
        
        {/* Badges */}
        <div className="absolute top-2 left-2 flex flex-col gap-1">
          {product.isNew && (
            <Badge className="text-xs py-0 px-1.5 bg-blue-500">Nuevo</Badge>
          )}
          {product.discount > 0 && (
            <Badge className="text-xs py-0 px-1.5 bg-red-500">-{product.discount}%</Badge>
          )}
        </div>
        
        {product.isPopular && (
          <Badge className="absolute top-2 right-2 text-xs py-0 px-1.5 bg-orange-500">
            Popular
          </Badge>
        )}
      </div>

      {/* Content section */}
      <div className="p-3">
        <div className="mb-1">
          <p className="text-xs text-muted-foreground truncate">{product.brand}</p>
          <h3 className="font-medium text-xs line-clamp-2 leading-tight mb-1">
            {product.name}
          </h3>
        </div>

        {/* Rating */}
        {product.rating && (
          <div className="flex items-center gap-1 mb-1">
            <div className="flex">
              {[...Array(5)].map((_, i) => (
                <Star
                  key={i}
                  className={`h-2.5 w-2.5 ${
                    i < product.rating! ? "fill-yellow-400 text-yellow-400" : "text-gray-300"
                  }`}
                />
              ))}
            </div>
            <span className="text-xs text-muted-foreground">({product.rating})</span>
          </div>
        )}

        <ProductPriceDisplay product={product} size="extra-small" />
        
        {product.volume && (
          <p className="text-xs text-muted-foreground mt-1 truncate">
            {product.volume} {product.volumeUnit}
          </p>
        )}

        {/* Action button */}
        <div className="mt-2">
          {isSalesUser ? (
            <Badge variant="outline" className="w-full flex justify-center py-1 text-xs border-blue-500 text-blue-500">
              Solo lectura
            </Badge>
          ) : isOutOfStock ? (
            <div className="space-y-1">
              <Button
                onClick={(e) => {
                  e.stopPropagation();
                  setShowNotifyDialog(true);
                }}
                size="sm"
                variant="outline"
                className="w-full h-6 text-[10px] px-2 border-blue-500 text-blue-500 hover:bg-blue-50"
              >
                <Bell className="h-2.5 w-2.5 mr-1" />
                <span className="truncate">Notificar</span>
              </Button>
              <div className="grid grid-cols-2 gap-0.5">
                <Button
                  onClick={(e) => {
                    e.stopPropagation();
                    setShowReserveDialog(true);
                  }}
                  size="sm"
                  variant="outline"
                  className="h-5 text-[9px] px-1 border-orange-500 text-orange-500 hover:bg-orange-50"
                >
                  <Bookmark className="h-2 w-2" />
                </Button>
                <Button
                  onClick={(e) => {
                    e.stopPropagation();
                    handleSimilarProducts();
                  }}
                  size="sm"
                  variant="outline"
                  className="h-5 text-[9px] px-1 border-gray-500 text-gray-500 hover:bg-gray-50"
                >
                  <Search className="h-2 w-2" />
                </Button>
              </div>
            </div>
          ) : (
            <Button
              onClick={handleAddToQuote}
              size="sm"
              className="w-full h-7 text-xs"
            >
              <ShoppingBag className="h-3 w-3 mr-1" />
              Agregar
            </Button>
          )}
        </div>
      </div>
      
      <NotifyWhenAvailableDialog
        product={product}
        open={showNotifyDialog}
        onOpenChange={setShowNotifyDialog}
      />
      
      <ReserveProductDialog
        product={product}
        open={showReserveDialog}
        onOpenChange={setShowReserveDialog}
      />
    </Card>
  );
};

export default memo(MobileProductCard);
