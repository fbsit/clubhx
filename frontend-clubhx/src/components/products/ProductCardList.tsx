
import { Card } from "@/components/ui/card";
import { ProductType } from "@/types/product";
import ProductCardImage from "./ProductCardImage";
import ProductCardContent from "./ProductCardContent";
import ProductCardActions from "./ProductCardActions";
import WishlistButton from "@/components/wishlist/WishlistButton";

interface ProductCardListProps {
  product: ProductType;
  isOutOfStock: boolean;
  onCardClick: () => void;
  onAddToQuote: (e: React.MouseEvent) => void;
}

const ProductCardList = ({ product, isOutOfStock, onCardClick, onAddToQuote }: ProductCardListProps) => {
  return (
    <Card 
      className={`overflow-hidden transition-all ${
        isOutOfStock ? "opacity-70" : "hover:shadow-md cursor-pointer hover:translate-y-[-2px]"
      }`}
      onClick={onCardClick}
    >
      <div className="flex">
        <div className="relative">
          <ProductCardImage 
            product={product} 
            viewMode="list" 
            onCardClick={onCardClick}
          />
          {/* Botón de wishlist en la esquina inferior derecha de la imagen */}
          <div className="absolute bottom-1 right-1">
            <WishlistButton 
              product={product} 
              variant="ghost"
              size="sm"
              className="bg-white/90 backdrop-blur-sm hover:bg-white shadow-md border border-white/20 h-6 w-6 p-0"
            />
          </div>
        </div>
        <ProductCardContent 
          product={product} 
          viewMode="list" 
        />
        <ProductCardActions 
          product={product} 
          viewMode="list" 
          onAddToQuote={onAddToQuote}
        />
      </div>
    </Card>
  );
};

export default ProductCardList;
