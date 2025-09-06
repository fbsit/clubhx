import { ProductType, ProductOption } from "@/types/product";
import { OptimizedImage } from "@/components/ui/optimized-image";
import ProductDetailInfo from "./ProductDetailInfo";
import ProductRecommendations from "./ProductRecommendations";
import ProductPriceDisplay from "./ProductPriceDisplay";

interface ProductDetailDesktopProps {
  displayProduct: ProductType;
  currentImage: string;
  displayName: string;
  currentPrice: number;
  discountedPrice: number | null;
  selectedOptions: ProductOption[];
  onOptionChange: (option: ProductOption) => void;
  quantityControls: any;
  product: ProductType;
}

export default function ProductDetailDesktop({
  displayProduct,
  currentImage,
  displayName,
  currentPrice,
  discountedPrice,
  selectedOptions,
  onOptionChange,
  quantityControls,
  product
}: ProductDetailDesktopProps) {
  return (
    <div className="hidden sm:block">
      <div className="grid lg:grid-cols-5 xl:grid-cols-3 gap-6 lg:gap-8 rounded-2xl border border-border/20 p-6 lg:p-8 bg-background/50 backdrop-blur-sm shadow-sm">
        {/* Desktop Product image section */}
        <div className="lg:col-span-2 xl:col-span-1 flex items-start justify-center">
          <div className="w-full max-w-sm lg:max-w-md xl:max-w-sm sticky top-8">
            <div className="relative">
              <OptimizedImage
                src={currentImage}
                alt={displayName}
                fallbackSrc="https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?auto=format&fit=crop&q=80"
                aspectRatio="square"
                objectFit="cover"
                containerClassName="rounded-xl shadow-sm bg-white border-2 border-border/20 overflow-hidden"
                className="md:hover:scale-[1.02] transition-transform duration-500 rounded-xl"
                showSkeleton={true}
              />
              
              {/* Discount badge overlay */}
              {displayProduct.discount > 0 && (
                <div className="absolute top-3 right-3">
                  <div className="bg-red-500 text-white px-3 py-1.5 rounded-full font-semibold text-sm shadow-lg">
                    -{displayProduct.discount}% OFF
                  </div>
                </div>
              )}
            </div>
            
            {/* Price directly under image */}
            <div className="mt-4 text-center">
              <ProductPriceDisplay 
                price={currentPrice}
                discount={displayProduct.discount}
                size="large"
              />
              {displayProduct.discount > 0 && (
                <p className="text-sm text-green-600 font-medium mt-1">
                  ¡Ahorra ${Math.round(currentPrice * displayProduct.discount / 100).toLocaleString()}!
                </p>
              )}
            </div>
          </div>
        </div>

        {/* Desktop Product info section */}
        <div className="lg:col-span-3 xl:col-span-2 flex flex-col justify-start space-y-6 lg:space-y-8">
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
      </div>

      {/* Desktop Related products section */}
      {product && (
        <div className="mt-12">
          <ProductRecommendations 
            excludeProductId={product.id}
            category={product.category}
            limit={4}
          />
        </div>
      )}
    </div>
  );
}