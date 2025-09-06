import { ProductType, ProductOption } from "@/types/product";
import { Badge } from "@/components/ui/badge";
import { Calendar, Gift, Star } from "lucide-react";
import ProductOptionsSelector from "./ProductOptionsSelector";
import ProductPriceDisplay from "./ProductPriceDisplay";
import { isDiscountActive } from "@/utils/promotionUtils";
import { Button } from "@/components/ui/button";
import { ReactElement } from "react";

interface ProductDetailInfoIOSProps {
  product: ProductType;
  imageError: boolean;
  setImageError: (error: boolean) => void;
  discountedPrice: number | null;
  selectedOptions: ProductOption[];
  onOptionChange: (option: ProductOption) => void;
  quantityControls: ReactElement | false;
}

export default function ProductDetailInfoIOS({
  product,
  discountedPrice,
  selectedOptions,
  onOptionChange,
  quantityControls
}: ProductDetailInfoIOSProps) {
  
  return (
    <div className="ios-product-detail space-y-6" style={{ fontSize: '16px' }}>
      {/* Brand and Category - iOS optimized */}
      <div className="flex flex-wrap gap-3">
        <Badge 
          variant="secondary" 
          className="px-4 py-2 font-medium"
          style={{ fontSize: '16px', minHeight: '44px' }}
        >
          {product.brand}
        </Badge>
        <Badge 
          variant="outline" 
          className="px-4 py-2 font-medium"
          style={{ fontSize: '16px', minHeight: '44px' }}
        >
          {product.category}
        </Badge>
      </div>

      {/* Product Name - iOS safe */}
      <div>
        <h1 className="font-bold leading-tight" style={{ fontSize: '24px' }}>
          {product.name}
        </h1>
        
        {/* Rating - iOS optimized */}
        {product.rating && (
          <div className="flex items-center gap-2 mt-3">
            <div className="flex items-center gap-1">
              {[...Array(5)].map((_, i) => (
                <Star
                  key={i}
                  className={`h-5 w-5 ${
                    i < Math.floor(product.rating!) 
                      ? 'fill-yellow-400 text-yellow-400' 
                      : 'text-gray-300'
                  }`}
                />
              ))}
            </div>
            <span style={{ fontSize: '16px' }}>
              ({product.rating})
            </span>
          </div>
        )}
      </div>

      {/* Price - Mobile friendly */}
      <div className="bg-background/50 p-4 rounded-lg border">
        <ProductPriceDisplay 
          product={product}
          size="large"
        />
        
        {/* Promotion info - iOS safe text */}
        {product.discount > 0 && isDiscountActive(product) && (
          <div className="mt-3 p-3 bg-red-50 rounded-lg border border-red-200">
            <div className="flex items-center gap-2 mb-2">
              <Gift className="h-5 w-5 text-red-600" />
              <span className="font-medium text-red-600" style={{ fontSize: '16px' }}>
                ¡Promoción Activa!
              </span>
            </div>
            {product.promotionStartDate && product.promotionEndDate && (
              <div className="flex items-center gap-2 text-red-600">
                <Calendar className="h-4 w-4" />
                <span style={{ fontSize: '16px' }}>
                  Válida hasta {new Date(product.promotionEndDate).toLocaleDateString('es-CL')}
                </span>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Options Selector - iOS optimized */}
      {product.options && product.options.length > 0 && (
        <ProductOptionsSelector
          options={product.options}
          selectedOptions={selectedOptions}
          onOptionChange={onOptionChange}
        />
      )}

      {/* Quantity and Add to Cart - iOS optimized */}
      <div className="space-y-4 ios-quantity-controls" style={{ fontSize: '16px' }}>
        {quantityControls}
      </div>

      {/* Product Description - iOS safe text */}
      {product.description && (
        <div className="space-y-3">
          <h3 className="font-semibold" style={{ fontSize: '18px' }}>
            Descripción
          </h3>
          <p className="leading-relaxed" style={{ fontSize: '16px', lineHeight: '1.6' }}>
            {product.description}
          </p>
        </div>
      )}

      {/* Loyalty Points - iOS safe */}
      {product.loyaltyPoints && (
        <div className="p-4 bg-background/50 rounded-lg border">
          <div className="flex items-center gap-2 mb-2">
            <Gift className="h-5 w-5 text-primary" />
            <span className="font-medium" style={{ fontSize: '16px' }}>
              Puntos de Lealtad
            </span>
          </div>
          <p style={{ fontSize: '16px' }}>
            Gana {product.loyaltyPoints} puntos con esta compra
          </p>
        </div>
      )}
    </div>
  );
}