
import { memo, useState } from "react";
import { ProductType } from "@/types/product";
import { useNavigate } from "react-router-dom";
import { useQuotation } from "@/contexts/QuotationContext";
import { useSalesQuotation } from "@/contexts/SalesQuotationContext";
import { useAuth } from "@/contexts/AuthContext";
import { toast } from "sonner";
import ProductCardGrid from "./ProductCardGrid";
import ProductCardList from "./ProductCardList";

export interface ProductCardProps {
  product: ProductType;
  viewMode?: "grid" | "list";
}

const ProductCard = ({ 
  product, 
  viewMode = "grid",
}: ProductCardProps) => {
  const navigate = useNavigate();
  const { addItem } = useQuotation();
  const { addItem: addSalesItem, selectedCustomer } = useSalesQuotation();
  const { user } = useAuth();
  const isOutOfStock = product.stock <= 0;
  const [quantity] = useState(1);
  
  const isSalesUser = user?.role === "sales";
  const canAddToQuote = isSalesUser ? !!selectedCustomer : true;
  
  const handleAddToQuote = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (!isOutOfStock && canAddToQuote) {
      if (isSalesUser && selectedCustomer) {
        addSalesItem(product, quantity);
        toast.success(`${product.name} agregado a la cotización`, {
          description: `Para: ${selectedCustomer.name} - Cantidad: ${quantity}`,
        });
      } else if (!isSalesUser) {
        addItem(product, quantity);
        toast.success(`${product.name} agregado a la cotización`, {
          description: `Cantidad: ${quantity}`,
        });
      }
    }
  };

  const handleCardClick = () => {
    navigate(`/main/products/${product.id}`);
  };

  if (viewMode === "list") {
    return (
      <ProductCardList
        product={product}
        isOutOfStock={isOutOfStock}
        onCardClick={handleCardClick}
        onAddToQuote={handleAddToQuote}
      />
    );
  }

  return (
    <ProductCardGrid
      product={product}
      isOutOfStock={isOutOfStock}
      onCardClick={handleCardClick}
      onAddToQuote={handleAddToQuote}
    />
  );
};

export default memo(ProductCard);
