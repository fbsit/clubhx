
import { FC, useContext } from "react";
import { useQuotation } from "@/contexts/QuotationContext";
import { SalesQuotationContext } from "@/contexts/SalesQuotationContext";
import { Minus, Plus, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { QuoteItemType } from "@/types/product";
import { isDiscountActive } from "@/utils/promotionUtils";

// Maximum allowed quantity per product
const MAX_QUANTITY = 10;

interface CartItemProps {
  item: QuoteItemType;
}

const CartItem: FC<CartItemProps> = ({ item }) => {
  const quotationCtx = useQuotation();
  const salesCtx = useContext(SalesQuotationContext);
  const updateQuantity = salesCtx?.updateQuantity ?? quotationCtx.updateQuantity;
  const removeItem = salesCtx?.removeItem ?? quotationCtx.removeItem;
  const maxCap = salesCtx ? 50 : MAX_QUANTITY;
  const effectiveMax = Math.min(maxCap, item.product.stock);
  

  const discountedPrice = isDiscountActive(item.product)
    ? (item.product.price * (100 - item.product.discount)) / 100
    : item.product.price;
  
  return (
    <li className="flex gap-3 pb-3 border-b">
      <div className="h-16 w-16 rounded bg-muted/20 overflow-hidden flex-shrink-0">
        <img 
          src={item.product.image} 
          alt={item.product.name} 
          className="h-full w-full object-cover"
          onError={(e) => {
            (e.target as HTMLImageElement).src = "https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?auto=format&fit=crop&q=80";
          }}
          loading="lazy"
        />
      </div>

      <div className="flex-1 min-w-0">
        <div className="flex justify-between">
          <h4 className="font-medium text-sm line-clamp-1">{item.product.name}</h4>
          <button 
            onClick={() => removeItem(item.product.id)}
            className="text-muted-foreground hover:text-destructive transition-colors"
          >
            <X className="h-4 w-4" />
          </button>
        </div>
        <p className="text-xs text-muted-foreground mb-1">
          {item.product.volume} {item.product.volumeUnit} · ${discountedPrice.toLocaleString('es-CL')} c/u
        </p>
        
        <div className="flex items-center justify-between">
          <div className="flex items-center">
            <Button 
              size="icon" 
              variant="outline"
              className="h-6 w-6 rounded-full p-0"
              onClick={() => updateQuantity(item.product.id, item.quantity - 1)}
              disabled={item.quantity <= 1}
            >
              <Minus className="h-3 w-3" />
            </Button>
            <span className="w-8 text-center text-sm">{item.quantity}</span>
            <Button 
              size="icon" 
              variant="outline"
              className="h-6 w-6 rounded-full p-0"
              onClick={() => updateQuantity(item.product.id, item.quantity + 1)}
              disabled={item.quantity >= effectiveMax}
            >
              <Plus className="h-3 w-3" />
            </Button>
          </div>
          
          <div className="font-medium text-sm">
            ${(discountedPrice * item.quantity).toLocaleString('es-CL')}
          </div>
        </div>
        
        {item.quantity >= maxCap && (
          <p className="text-xs text-amber-600 mt-1">
            Límite máximo: {maxCap} unidades
          </p>
        )}
      </div>
    </li>
  );
};

export default CartItem;
