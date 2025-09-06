
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { ProductType } from "@/types/product";
import ProductCardImage from "./ProductCardImage";
import ProductCardContent from "./ProductCardContent";
import ProductCardActions from "./ProductCardActions";
import WishlistButton from "@/components/wishlist/WishlistButton";

interface ProductCardGridProps {
  product: ProductType;
  isOutOfStock: boolean;
  onCardClick: () => void;
  onAddToQuote: (e: React.MouseEvent) => void;
}

const ProductCardGrid = ({ product, isOutOfStock, onCardClick, onAddToQuote }: ProductCardGridProps) => {
  return (
    <Card 
      className={`overflow-hidden transition-all bg-white border border-border/20 ${
        isOutOfStock ? "opacity-70" : "hover:shadow-lg cursor-pointer hover:translate-y-[-2px]"
      }`}
      onClick={onCardClick}
    >
      {/* Imagen sin padding adicional para llenar completamente la parte superior */}
      <div className="relative">
        <ProductCardImage 
          product={product} 
          viewMode="grid" 
          onCardClick={onCardClick}
        />
        {/* Botón de wishlist en la esquina inferior derecha */}
        <div className="absolute bottom-2 right-2">
          <WishlistButton 
            product={product} 
            variant="ghost"
            className="bg-white/90 backdrop-blur-sm hover:bg-white shadow-md border border-white/20"
          />
        </div>
      </div>
      
      <CardContent className="p-0">
        <ProductCardContent 
          product={product} 
          viewMode="grid" 
        />
      </CardContent>
      
      <CardFooter className="p-3">
        <ProductCardActions 
          product={product} 
          viewMode="grid" 
          onAddToQuote={onAddToQuote}
        />
      </CardFooter>
    </Card>
  );
};

export default ProductCardGrid;
