
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ShoppingBag, Bell, Bookmark, Search } from "lucide-react";
import { ProductType } from "@/types/product";
import { useQuotation } from "@/contexts/QuotationContext";
import { useSalesQuotation } from "@/contexts/SalesQuotationContext";
import { useAuth } from "@/contexts/AuthContext";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import NotifyWhenAvailableDialog from "./stock/NotifyWhenAvailableDialog";
import ReserveProductDialog from "./stock/ReserveProductDialog";

interface ProductCardActionsProps {
  product: ProductType;
  viewMode: "grid" | "list";
  onAddToQuote: (e: React.MouseEvent) => void;
}

const ProductCardActions = ({ product, viewMode, onAddToQuote }: ProductCardActionsProps) => {
  const { user } = useAuth();
  const { selectedCustomer } = useSalesQuotation();
  const navigate = useNavigate();
  const isOutOfStock = product.stock <= 0;
  const isSalesUser = user?.role === "sales";
  const canAddToQuote = isSalesUser ? !!selectedCustomer : true;
  const [showNotifyDialog, setShowNotifyDialog] = useState(false);
  const [showReserveDialog, setShowReserveDialog] = useState(false);

  const handleSimilarProducts = () => {
    navigate(`/main/products?category=${encodeURIComponent(product.category)}&exclude=${product.id}`);
  };

  if (viewMode === "list") {
    return (
      <div className="flex items-center">
        {isSalesUser && !selectedCustomer ? (
          <Badge variant="outline" className="text-[10px] sm:text-xs py-0 border-blue-500 text-blue-500">
            Selecciona cliente
          </Badge>
        ) : isOutOfStock ? (
          <div className="flex gap-1">
            <Button 
              onClick={(e) => {
                e.stopPropagation();
                setShowNotifyDialog(true);
              }}
              variant="outline"
              size="sm"
              className="h-7 px-2 border-blue-500 text-blue-500 hover:bg-blue-50"
            >
              <Bell className="h-3 w-3" />
            </Button>
            <Button 
              onClick={(e) => {
                e.stopPropagation();
                handleSimilarProducts();
              }}
              variant="outline"
              size="sm"
              className="h-7 px-2 border-gray-500 text-gray-500 hover:bg-gray-50"
            >
              <Search className="h-3 w-3" />
            </Button>
          </div>
        ) : (
          <Button 
            onClick={onAddToQuote}
            variant="secondary"
            size="sm"
            className="h-7 min-w-7 px-2"
          >
            <ShoppingBag className="h-3.5 w-3.5" />
          </Button>
        )}
      </div>
    );
  }

  return (
    <>
      <div className="w-full">
        {isSalesUser && !selectedCustomer ? (
          <Badge variant="outline" className="w-full flex justify-center py-2 border-blue-500 text-blue-500 text-xs">
            Selecciona cliente
          </Badge>
        ) : isOutOfStock ? (
          <div className="w-full space-y-2">
            <Button 
              onClick={(e) => {
                e.stopPropagation();
                setShowNotifyDialog(true);
              }}
              variant="outline"
              className="w-full text-xs h-8 px-3 border-blue-500 text-blue-500 hover:bg-blue-50"
              size="sm"
            >
              <Bell className="h-3 w-3 mr-1" />
              <span className="truncate">Notificar</span>
            </Button>
            <div className="grid grid-cols-2 gap-2">
              <Button 
                onClick={(e) => {
                  e.stopPropagation();
                  setShowReserveDialog(true);
                }}
                variant="outline"
                className="text-xs h-7 px-2 border-orange-500 text-orange-500 hover:bg-orange-50"
                size="sm"
              >
                <Bookmark className="h-3 w-3" />
              </Button>
              <Button 
                onClick={(e) => {
                  e.stopPropagation();
                  handleSimilarProducts();
                }}
                variant="outline"
                className="text-xs h-7 px-2 border-gray-500 text-gray-500 hover:bg-gray-50"
                size="sm"
              >
                <Search className="h-3 w-3" />
              </Button>
            </div>
          </div>
        ) : (
          <Button 
            onClick={onAddToQuote}
            variant="default"
            className="w-full text-sm h-10 font-medium"
            size="sm"
          >
            <ShoppingBag className="h-4 w-4 mr-2" />
            Agregar
          </Button>
        )}
      </div>
      
      <NotifyWhenAvailableDialog
        product={product}
        open={showNotifyDialog}
        onOpenChange={setShowNotifyDialog}
      />
      
      <ReserveProductDialog
        product={product}
        open={showReserveDialog}
        onOpenChange={setShowReserveDialog}
      />
    </>
  );
};

export default ProductCardActions;
