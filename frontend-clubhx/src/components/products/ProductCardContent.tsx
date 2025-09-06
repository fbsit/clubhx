
import { ProductType } from "@/types/product";
import ProductPriceDisplay from "./ProductPriceDisplay";
import { Star } from "lucide-react";
import { calculatePromotionalPoints, isDiscountActive, isPromotionActive } from "@/utils/promotionUtils";

interface ProductCardContentProps {
  product: ProductType;
  viewMode: "grid" | "list";
}

const ProductCardContent = ({ product, viewMode }: ProductCardContentProps) => {
  const { promotionalPoints } = calculatePromotionalPoints(product);
  const hasActiveDiscount = isDiscountActive(product);
  const hasActivePromotion = isPromotionActive(product.loyaltyPromotion);
  const hasAnyPromotion = hasActiveDiscount || hasActivePromotion;

  if (viewMode === "list") {
    return (
      <div className="flex flex-1 flex-col p-2 sm:p-3">
        <div className="flex-1">
          <p className="text-base text-muted-foreground">{product.brand}</p>
          <h3 className="font-medium text-base leading-tight line-clamp-2">{product.name}</h3>
          
          <div className="mt-1 flex items-center justify-between">
            <ProductPriceDisplay product={product} size="extra-small" />
            
            {promotionalPoints > 0 && (
              <div className="flex items-center gap-1 text-base text-amber-600">
                <Star className="h-4 w-4 fill-current" />
                <span className="font-medium">+{promotionalPoints} pts</span>
              </div>
            )}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="p-3">
      <p className="text-base text-muted-foreground mb-1 truncate">{product.brand}</p>
      <h3 className="font-medium text-base line-clamp-2 mb-2">{product.name}</h3>
      <ProductPriceDisplay product={product} size="small" />
      
      {promotionalPoints > 0 && (
        <div className="flex items-center gap-1 text-base text-amber-600 mt-2">
          <Star className="h-4 w-4 fill-current" />
          <span className="font-medium">+{promotionalPoints} puntos</span>
        </div>
      )}
      
      {hasAnyPromotion && (
        <p className="text-base text-muted-foreground mt-1 italic">
          Promoción por tiempo limitado
        </p>
      )}
    </div>
  );
};

export default ProductCardContent;
