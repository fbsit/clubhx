
import { ProductType } from "@/types/product";
import { isDiscountActive } from "@/utils/promotionUtils";

interface ProductPriceDisplayProps {
  product?: ProductType;
  price?: number;
  discount?: number;
  size?: "extra-small" | "small" | "large";
  showPricePerUnit?: boolean;
}

export const calculatePricePerUnit = (product: ProductType) => {
  if (!product.volume || product.volume === 0) return null;
  
  const discountedPrice = (product.discount > 0 && isDiscountActive(product))
    ? (product.price * (100 - product.discount)) / 100 
    : product.price;
  
  // Convert to L or kg
  const factor = product.volumeUnit === 'ml' || product.volumeUnit === 'g' ? 1000 : 1;
  const pricePerUnit = (discountedPrice / product.volume) * factor;
  
  const unit = product.volumeUnit === 'ml' || product.volumeUnit === 'l' ? 'L' : 'kg';
  
  return `$${Math.round(pricePerUnit).toLocaleString('es-CL')}/${unit}`;
};

const ProductPriceDisplay = ({ product, price, discount, size = "small", showPricePerUnit = true }: ProductPriceDisplayProps) => {
  // Use either direct price or product price
  const basePrice = price !== undefined ? price : product?.price;
  const discountValue = discount !== undefined ? discount : product?.discount || 0;
  
  if (basePrice === undefined) {
    return null;
  }
  
  // Only apply discount if it's active (for products with time-based promotions)
  const isDiscountApplicable = product ? isDiscountActive(product) : discountValue > 0;
  const finalPrice = (discountValue > 0 && isDiscountApplicable)
    ? (basePrice * (100 - discountValue)) / 100 
    : basePrice;

  const pricePerUnit = showPricePerUnit && product ? calculatePricePerUnit(product) : null;

  // Extra small size (for very compact displays)
  if (size === "extra-small") {
    return (
      <div className="flex items-baseline gap-1.5">
        <div className="font-medium text-base">
          ${Math.round(finalPrice).toLocaleString('es-CL')}
        </div>
        {discountValue > 0 && isDiscountApplicable && (
          <div className="text-base text-muted-foreground line-through opacity-70">
            ${basePrice.toLocaleString('es-CL')}
          </div>
        )}
      </div>
    );
  }
  
  // Small size (default for product cards)
  if (size === "small") {
    return (
      <div className="flex items-baseline gap-1.5">
        <div className="font-medium text-sm sm:text-base">
          ${Math.round(finalPrice).toLocaleString('es-CL')}
        </div>
        {discountValue > 0 && isDiscountApplicable && (
          <div className="text-base text-muted-foreground line-through opacity-70">
            ${basePrice.toLocaleString('es-CL')}
          </div>
        )}
      </div>
    );
  }

  // Large size (for product details)
  return (
    <div className="flex items-baseline gap-2">
      <div className="text-xl sm:text-2xl font-medium">
        ${Math.round(finalPrice).toLocaleString('es-CL')}
      </div>
      {discountValue > 0 && isDiscountApplicable && (
        <div className="text-sm sm:text-base text-muted-foreground line-through opacity-70">
          ${basePrice.toLocaleString('es-CL')}
        </div>
      )}
    </div>
  );
};

export type { ProductPriceDisplayProps };
export default ProductPriceDisplay;
