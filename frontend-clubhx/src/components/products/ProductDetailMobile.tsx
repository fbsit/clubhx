import { ProductType, ProductOption } from "@/types/product";
import { OptimizedImage } from "@/components/ui/optimized-image";
import ProductDetailInfo from "./ProductDetailInfo";
import ProductRecommendations from "./ProductRecommendations";

interface ProductDetailMobileProps {
  displayProduct: ProductType;
  currentImage: string;
  displayName: string;
  discountedPrice: number | null;
  selectedOptions: ProductOption[];
  onOptionChange: (option: ProductOption) => void;
  quantityControls: any;
  product: ProductType;
}

export default function ProductDetailMobile({
  displayProduct,
  currentImage,
  displayName,
  discountedPrice,
  selectedOptions,
  onOptionChange,
  quantityControls,
  product
}: ProductDetailMobileProps) {
  return (
    <div className="sm:hidden" style={{ touchAction: 'pan-y' }}>
      {/* Mobile Product Image */}
      <div className="px-4 py-4">
        <div className="w-full aspect-square bg-white rounded-xl overflow-hidden shadow-sm border border-border/20 relative">
          <OptimizedImage
            src={currentImage}
            alt={displayName}
            fallbackSrc="https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?auto=format&fit=crop&q=80"
            aspectRatio="square"
            objectFit="cover"
            containerClassName="w-full h-full"
            className="w-full h-full object-cover"
            showSkeleton={true}
          />
          {/* Discount badge */}
          {displayProduct.discount > 0 && (
            <div className="absolute top-3 right-3">
              <div className="bg-red-500 text-white px-2 py-1 rounded-full font-semibold text-xs shadow-lg">
                🔥 -{displayProduct.discount}%
              </div>
            </div>
          )}
        </div>
      </div>
      
      {/* Mobile Product Info */}
      <div className="px-4 py-6 space-y-6 bg-background">
        <ProductDetailInfo
          product={displayProduct}
          imageError={false}
          setImageError={() => {}}
          discountedPrice={discountedPrice}
          selectedOptions={selectedOptions}
          onOptionChange={onOptionChange}
          quantityControls={quantityControls}
        />
      </div>
      
      {/* Mobile Related Products */}
      {product && (
        <div className="px-4 pb-20">
          <ProductRecommendations 
            excludeProductId={product.id}
            category={product.category}
            limit={2}
          />
        </div>
      )}
    </div>
  );
}