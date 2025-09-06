
import { Badge } from "@/components/ui/badge";
import { Star, Clock } from "lucide-react";
import { ProductType } from "@/types/product";
import { isDiscountActive, isPromotionActive } from "@/utils/promotionUtils";

interface ProductBadgesProps {
  product: ProductType;
  position?: "top-left" | "top-right" | "inline" | "overlay";
  showPopular?: boolean;
  showNew?: boolean;
  showDiscount?: boolean;
  showLoyaltyMultiplier?: boolean;
  showTimeLimited?: boolean;
  showOutOfStock?: boolean;
  mobileOnly?: boolean;
  className?: string;
}

const ProductBadges = ({
  product,
  position = "top-left",
  showPopular = true,
  showNew = true,
  showDiscount = true,
  showLoyaltyMultiplier = false,
  showTimeLimited = false,
  showOutOfStock = false,
  mobileOnly = false,
  className = "",
}: ProductBadgesProps) => {
  const isOutOfStock = product.stock <= 0;
  const hasActiveDiscount = isDiscountActive(product);
  const hasLoyaltyPromotion = isPromotionActive(product.loyaltyPromotion);
  const loyaltyMultiplier = product.loyaltyPromotion?.multiplier || 1;
  const hasAnyPromotion = hasActiveDiscount || hasLoyaltyPromotion;
  
  if (position === "inline") {
    return (
      <div className={`flex gap-1 ${className}`}>
        {showNew && product.isNew && <Badge className="bg-blue-500 text-base px-1.5 py-0">Nuevo</Badge>}
        {showDiscount && hasActiveDiscount && (
          <Badge className="bg-red-500 text-base px-1.5 py-0">🔥 -{product.discount}%</Badge>
        )}
        {showPopular && product.isPopular && (
          <Badge variant="outline" className="border-amber-500 text-amber-500 text-base px-1.5 py-0">
            <Star className="h-2.5 w-2.5 mr-0.5 fill-amber-500" /> Popular
          </Badge>
        )}
        {showOutOfStock && isOutOfStock && (
          <Badge variant="outline" className="border-red-500 text-red-500 text-base px-1.5 py-0">
            Sin stock
          </Badge>
        )}
      </div>
    );
  }

  // Overlay position for promotional badges on product images
  if (position === "overlay") {
    return (
      <div className={`absolute inset-0 pointer-events-none ${className}`}>
        {/* Discount badge - top left */}
        {showDiscount && hasActiveDiscount && (
          <Badge className="absolute left-2 top-2 bg-red-500/90 backdrop-blur-sm text-white px-2 py-1 text-base font-semibold">
            🔥 -{product.discount}%
          </Badge>
        )}
        
        {/* Loyalty multiplier badge - top right */}
        {showLoyaltyMultiplier && hasLoyaltyPromotion && loyaltyMultiplier > 1 && (
          <Badge className="absolute right-2 top-2 bg-amber-500/90 backdrop-blur-sm text-white px-2 py-1 text-base font-semibold">
            ⭐ {loyaltyMultiplier}x puntos
          </Badge>
        )}
        
        {/* Time limited promotion badge - bottom center */}
        {showTimeLimited && hasAnyPromotion && (
          <Badge className="absolute bottom-2 left-1/2 transform -translate-x-1/2 bg-purple-500/90 backdrop-blur-sm text-white px-2 py-1 text-base font-semibold">
            <Clock className="h-3 w-3 mr-1" />
            Promoción por tiempo limitado
          </Badge>
        )}
        
        {/* New badge - if no promotions */}
        {showNew && product.isNew && !hasAnyPromotion && (
          <Badge className="absolute left-2 top-2 bg-blue-500/90 backdrop-blur-sm text-white px-2 py-1 text-base font-semibold">
            Nuevo
          </Badge>
        )}
        
        {/* Popular badge - if no promotions */}
        {showPopular && product.isPopular && !hasAnyPromotion && (
          <Badge className="absolute right-2 top-2 bg-amber-500/90 backdrop-blur-sm text-white px-2 py-1 text-base font-semibold">
            <Star className="h-3 w-3 mr-1 fill-current" />
            Popular
          </Badge>
        )}
      </div>
    );
  }

  const positionClass = position === "top-left" 
    ? "absolute left-1 sm:left-2 top-1 sm:top-2" 
    : "absolute right-1 sm:right-2 top-1 sm:top-2";

  return (
    <>
      {/* Main badges group */}
      {(showNew || showDiscount) && (
        <div className={`${positionClass} flex flex-col gap-1 ${className}`}>
          {showNew && product.isNew && (
            <Badge className="bg-blue-500 px-1.5 py-0 text-base">Nuevo</Badge>
          )}
          {showDiscount && hasActiveDiscount && (
            <Badge className={`bg-red-500 px-1.5 py-0 text-base ${mobileOnly ? 'sm:hidden' : ''}`}>🔥 -{product.discount}%</Badge>
          )}
        </div>
      )}
      
      {/* Popular badge - separate since it's usually shown in a different position */}
      {showPopular && product.isPopular && position === "top-right" && (
        <Badge 
          variant="outline" 
          className={`absolute right-1 sm:right-2 top-1 sm:top-2 border-amber-500 text-amber-500 bg-background/80 text-base px-1.5 py-0 ${className}`}
        >
          <Star className="h-2.5 w-2.5 mr-0.5 fill-amber-500" /> Popular
        </Badge>
      )}
    </>
  );
};

export default ProductBadges;
