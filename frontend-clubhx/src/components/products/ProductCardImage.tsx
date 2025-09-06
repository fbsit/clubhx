
import { useState } from "react";
import { Skeleton } from "@/components/ui/skeleton";
import ProductBadges from "./ProductBadges";
import { ProductType } from "@/types/product";
import { OptimizedImage } from "@/components/ui/optimized-image";

interface ProductCardImageProps {
  product: ProductType;
  viewMode: "grid" | "list";
  onCardClick: () => void;
}

const ProductCardImage = ({ product, viewMode, onCardClick }: ProductCardImageProps) => {
  const fallbackImage = "https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?auto=format&fit=crop&q=80";

  if (viewMode === "list") {
    return (
      <div className="relative h-[80px] w-[80px] sm:h-24 sm:w-24 flex-shrink-0 rounded-lg overflow-hidden">
        <OptimizedImage
          src={product.image}
          alt={product.name}
          fallbackSrc={fallbackImage}
          aspectRatio="square"
          objectFit="cover"
          containerClassName="h-full w-full bg-white border-0"
          className="p-2"
        />
        
        <ProductBadges 
          product={product} 
          position="top-left"
          showPopular={false}
          className="scale-75 origin-top-left"
        />
      </div>
    );
  }

  return (
    <div className="relative aspect-square bg-gradient-to-b from-white to-gray-50/50 rounded-t-lg overflow-hidden group" onClick={onCardClick}>
      <OptimizedImage
        src={product.image}
        alt={product.name}
        fallbackSrc={fallbackImage}
        aspectRatio="square"
        objectFit="cover"
        containerClassName="h-full w-full border-0 rounded-none"
        className="w-full h-full object-cover md:group-hover:scale-105 transition-transform duration-300"
      />
      
      {/* Promotional badges overlay */}
      <ProductBadges 
        product={product} 
        position="overlay"
        showDiscount={true}
        showLoyaltyMultiplier={true}
        showTimeLimited={false}
        showNew={true}
        showPopular={true}
      />
    </div>
  );
};

export default ProductCardImage;
