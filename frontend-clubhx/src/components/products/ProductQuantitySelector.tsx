
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Plus, Minus } from "lucide-react";

interface ProductQuantitySelectorProps {
  initialQuantity?: number;
  maxQuantity: number;
  onQuantityChange: (quantity: number) => void;
  className?: string;
  compact?: boolean;
  value?: number;
  onChange?: (quantity: number) => void;
  maxValue?: number;
  id?: string;
}

const ProductQuantitySelector = ({
  initialQuantity = 1,
  maxQuantity,
  onQuantityChange,
  className = "",
  compact = false,
  value,
  onChange,
  maxValue,
  id,
}: ProductQuantitySelectorProps) => {
  const [quantity, setQuantity] = useState(value !== undefined ? value : initialQuantity);
  
  // Handle controlled component if value prop is provided
  useEffect(() => {
    if (value !== undefined) {
      setQuantity(value);
    }
  }, [value]);
  
  const max = maxValue !== undefined ? maxValue : maxQuantity;
  const handleChange = onChange || onQuantityChange;
  
  const handleQuantityChange = (e: React.MouseEvent, change: number) => {
    e.stopPropagation();
    const newQuantity = Math.max(1, Math.min(max, quantity + change));
    setQuantity(newQuantity);
    handleChange(newQuantity);
  };

  const buttonSize = compact ? "h-7 w-7" : "h-8 w-8";

  return (
    <div className={`flex items-center ${className}`} id={id}>
      <Button 
        size="icon" 
        variant="outline"
        className={buttonSize}
        onClick={(e) => handleQuantityChange(e, -1)}
        disabled={quantity <= 1}
      >
        <Minus className="h-3 w-3" />
      </Button>
      <span className="w-10 text-center">{quantity}</span>
      <Button 
        size="icon" 
        variant="outline"
        className={buttonSize}
        onClick={(e) => handleQuantityChange(e, 1)}
        disabled={quantity >= max}
      >
        <Plus className="h-3 w-3" />
      </Button>
    </div>
  );
};

export type { ProductQuantitySelectorProps };
export default ProductQuantitySelector;
