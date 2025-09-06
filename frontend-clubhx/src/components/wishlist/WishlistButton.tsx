import { useState } from "react";
import { Heart } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ProductType } from "@/types/product";
import { useWishlist } from "@/contexts/WishlistContext";
import { useAuth } from "@/contexts/AuthContext";
import { cn } from "@/lib/utils";

interface WishlistButtonProps {
  product: ProductType;
  size?: "sm" | "default" | "lg";
  variant?: "default" | "ghost" | "outline";
  className?: string;
  showText?: boolean;
}

export default function WishlistButton({
  product,
  size = "sm",
  variant = "ghost",
  className,
  showText = false
}: WishlistButtonProps) {
  const { addItem, removeItem, isInWishlist } = useWishlist();
  const { user } = useAuth();
  const [isAnimating, setIsAnimating] = useState(false);
  
  const inWishlist = isInWishlist(product.id);
  const isSalesUser = user?.role === "sales";

  const handleToggle = (e: React.MouseEvent) => {
    e.stopPropagation();
    
    if (isSalesUser) return;

    setIsAnimating(true);
    setTimeout(() => setIsAnimating(false), 300);

    if (inWishlist) {
      removeItem(product.id);
    } else {
      addItem(product);
    }
  };

  if (isSalesUser) {
    return null; // No mostrar el botón para usuarios de ventas
  }

  return (
    <Button
      onClick={handleToggle}
      variant={variant}
      size={size}
      className={cn(
        "transition-all duration-200",
        inWishlist 
          ? "text-red-500 hover:text-red-600" 
          : "text-muted-foreground hover:text-red-500",
        isAnimating && "scale-110",
        className
      )}
      disabled={isAnimating}
    >
      <Heart 
        className={cn(
          "h-4 w-4",
          inWishlist && "fill-current",
          isAnimating && "animate-pulse"
        )} 
      />
      {showText && (
        <span className="ml-1">
          {inWishlist ? "Guardado" : "Guardar"}
        </span>
      )}
    </Button>
  );
}