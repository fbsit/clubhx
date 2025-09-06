
import React from 'react';
import { ProductType, ProductOption } from "@/types/product";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Star, Clock, Gift, ShoppingBag, Bell, Bookmark, Search } from "lucide-react";
import ProductBadges from "./ProductBadges";
import ProductOptionsSelector from "./ProductOptionsSelector";
import ProductQuantitySelector from "./ProductQuantitySelector";
import PromotionBadge from "./PromotionBadge";
import { 
  calculatePromotionalPoints, 
  isPromotionActive, 
  isDiscountActive,
  getDiscountUrgencyText,
  getLoyaltyUrgencyText,
  shouldShowCountdown,
  formatPromotionEndDate
} from "@/utils/promotionUtils";

export interface ProductDetailInfoProps {
  product: ProductType;
  imageError: boolean;
  setImageError: React.Dispatch<React.SetStateAction<boolean>>;
  discountedPrice: number | null;
  selectedOptions?: ProductOption[];
  onOptionChange?: (option: ProductOption) => void;
  // New props for quantity and add controls
  quantityControls?: React.ReactNode;
}

const ProductDetailInfo: React.FC<ProductDetailInfoProps> = ({ 
  product, 
  imageError, 
  discountedPrice, 
  selectedOptions = [], 
  onOptionChange,
  quantityControls
}) => {
  const { basePoints, promotionalPoints, hasActivePromotion, multiplier } = calculatePromotionalPoints(product);
  const hasActiveDiscount = isDiscountActive(product);
  const discountUrgencyText = getDiscountUrgencyText(product);
  const loyaltyUrgencyText = getLoyaltyUrgencyText(product);
  const showDiscountCountdown = shouldShowCountdown(product.promotionEndDate);
  const showLoyaltyCountdown = shouldShowCountdown(product.loyaltyPromotion?.endDate);
  
  return (
    <div className="space-y-6">
      {/* Product badges - ocultar descuento ya que está en la imagen */}
      <div className="flex flex-wrap gap-2">
        <ProductBadges product={product} showDiscount={false} />
      </div>
      
      {/* Product name and brand - Mobile responsive */}
      <div className="space-y-2 sm:space-y-3">
        <h1 className="text-xl sm:text-2xl lg:text-3xl xl:text-4xl font-light text-foreground leading-tight">
          {product.name}
        </h1>
        <div className="flex flex-wrap items-center gap-2 sm:gap-3">
          <Badge variant="outline" className="bg-secondary/20 border-secondary/30 text-base">
            {product.brand}
          </Badge>
          <Badge variant="outline" className="bg-secondary/10 border-secondary/20 text-base">
            {product.category}
          </Badge>
        </div>
      </div>

      {/* Product Options Selector - Mobile responsive */}
      {product.options && product.options.length > 0 && onOptionChange && (
        <div className="space-y-3 sm:space-y-4">
          <ProductOptionsSelector
            options={product.options}
            selectedOptions={selectedOptions}
            onOptionChange={onOptionChange}
            className="bg-background/60 backdrop-blur-sm rounded-xl border border-border/20 p-3 sm:p-4"
          />
        </div>
      )}

      {/* Quantity Selector and Add to Cart - Now positioned after options */}
      {quantityControls && (
        <div className="space-y-4 border-t border-border/20 pt-4">
          {quantityControls}
        </div>
      )}
      {/* Active Discount Promotion */}
      {hasActiveDiscount && (
        <div className="bg-gradient-to-r from-red-50 to-orange-50 border border-red-200 rounded-xl p-4 sm:p-6">
          <div className="flex items-start justify-between mb-3">
            <div className="flex items-center gap-2">
              <Gift className="h-5 w-5 text-red-600" />
              <h3 className="font-semibold text-lg text-red-800">¡Descuento Activo!</h3>
            </div>
            <PromotionBadge type="discount" value={product.discount} size="md" />
          </div>
          
          <div className="space-y-3">
            <div className="text-base text-red-700">
              🔥 <strong>{product.discount}% de descuento</strong> en este producto
            </div>
            
            {discountUrgencyText && (
              <div className="flex items-center gap-2 text-base font-medium text-red-800">
                <Clock className="h-4 w-4" />
                {discountUrgencyText}
                {product.promotionEndDate && showDiscountCountdown && (
                  <PromotionBadge 
                    type="countdown" 
                    endDate={product.promotionEndDate}
                    size="md" 
                    className="ml-2"
                  />
                )}
              </div>
            )}
            
            {product.promotionEndDate && (
              <div className="text-base text-red-600">
                Válido hasta: {formatPromotionEndDate(product.promotionEndDate)}
              </div>
            )}
          </div>
        </div>
      )}

      {/* Active Loyalty Points Promotion */}
      {hasActivePromotion && multiplier > 1 && (
        <div className="bg-gradient-to-r from-amber-50 to-yellow-50 border border-amber-200 rounded-xl p-4 sm:p-6">
          <div className="flex items-start justify-between mb-3">
            <div className="flex items-center gap-2">
              <Gift className="h-5 w-5 text-amber-600" />
              <h3 className="font-semibold text-lg text-amber-800">¡Puntos Multiplicados!</h3>
            </div>
            <PromotionBadge type="points" value={multiplier} size="md" />
          </div>
          
          <div className="space-y-3">
            <div className="text-base text-amber-700">
              ⭐ <strong>{multiplier}x puntos de lealtad</strong> por esta compra
            </div>
            
            {loyaltyUrgencyText && (
              <div className="flex items-center gap-2 text-base font-medium text-amber-800">
                <Clock className="h-4 w-4" />
                {loyaltyUrgencyText}
                {product.loyaltyPromotion?.endDate && showLoyaltyCountdown && (
                  <PromotionBadge 
                    type="countdown" 
                    endDate={product.loyaltyPromotion.endDate}
                    size="md" 
                    className="ml-2"
                  />
                )}
              </div>
            )}
            
            {product.loyaltyPromotion?.endDate && (
              <div className="text-base text-amber-600">
                Válido hasta: {formatPromotionEndDate(product.loyaltyPromotion.endDate)}
              </div>
            )}
          </div>
        </div>
      )}

      {/* Loyalty Points - Mobile optimized */}
      {promotionalPoints > 0 && (
        <div className="bg-amber-50 border border-amber-200 rounded-lg p-3 sm:p-4">
          <div className="flex items-center gap-2 text-amber-700">
            <Star className="h-4 w-4 sm:h-5 sm:w-5 fill-current flex-shrink-0" />
            <span className="font-medium text-base sm:text-lg">
              +{promotionalPoints} puntos de lealtad
              {hasActivePromotion && multiplier > 1 && (
                <span className="text-orange-600 ml-1">({multiplier}x)</span>
              )}
            </span>
          </div>
          <p className="text-base text-amber-600 mt-1">
            Ganas {promotionalPoints} puntos por cada unidad de este producto
            {hasActivePromotion && basePoints !== promotionalPoints && (
              <span className="block mt-1 text-orange-600">
                Normalmente serían {basePoints} puntos, pero con la promoción actual recibes {promotionalPoints} puntos
              </span>
            )}
          </p>
        </div>
      )}
      
      {/* Volume if available */}
      {product.volume && (
        <div className="text-muted-foreground text-base">
          Contenido: <span className="font-medium text-foreground">{product.volume}{product.volumeUnit || ''}</span>
        </div>
      )}
      
      {/* Description */}
      <div className="space-y-3">
        <h3 className="text-lg font-medium text-foreground">Descripción</h3>
        <p className="text-muted-foreground leading-relaxed">{product.description}</p>
      </div>
    </div>
  );
};

export default ProductDetailInfo;
