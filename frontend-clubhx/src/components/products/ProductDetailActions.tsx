
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { ProductType } from "@/types/product";
import { useQuotation } from "@/contexts/QuotationContext";
import { useSalesQuotation } from "@/contexts/SalesQuotationContext";
import { useAuth } from "@/contexts/AuthContext";
import { useNavigate } from "react-router-dom";
import { ShoppingBag, Bell, Bookmark, Search } from "lucide-react";
import ProductQuantitySelector from "./ProductQuantitySelector";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";
import SalesProductAnalytics from "./SalesProductAnalytics";
import NotifyWhenAvailableDialog from "./stock/NotifyWhenAvailableDialog";
import ReserveProductDialog from "./stock/ReserveProductDialog";

interface ProductDetailActionsProps {
  product: ProductType;
}

const ProductDetailActions = ({ product }: ProductDetailActionsProps) => {
  const { addItem } = useQuotation();
  const { addItem: addSalesItem, selectedCustomer } = useSalesQuotation();
  const { user } = useAuth();
  const navigate = useNavigate();
  const [quantity, setQuantity] = useState(1);
  const [showNotifyDialog, setShowNotifyDialog] = useState(false);
  const [showReserveDialog, setShowReserveDialog] = useState(false);
  const isOutOfStock = product.stock <= 0;
  const isSalesUser = user?.role === "sales";
  const canAddToQuote = isSalesUser ? !!selectedCustomer : true;

  const handleSimilarProducts = () => {
    navigate(`/main/products?category=${encodeURIComponent(product.category)}&exclude=${product.id}`);
  };

  const handleQuantityChange = (newQuantity: number) => {
    setQuantity(newQuantity);
  };

  const handleAddToQuote = () => {
    if (canAddToQuote && !isOutOfStock) {
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

  return (
    <div className="flex flex-col space-y-4 animate-fade-in">
      {/* Sales Analytics - Always show for sales users but less prominent when client selected */}
      {isSalesUser && (
        <div className={`${selectedCustomer ? 'opacity-75 scale-95' : ''} transition-all duration-300`}>
          <SalesProductAnalytics product={product} />
        </div>
      )}

      {/* Message for sales without customer */}
      {isSalesUser && !selectedCustomer && (
        <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg text-center">
          <p className="text-blue-800 font-medium">Selecciona un cliente para cotizar productos</p>
          <Button 
            variant="outline" 
            className="mt-2"
            onClick={() => navigate("/main/products")}
          >
            Ir a seleccionar cliente
          </Button>
        </div>
      )}
      
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
    </div>
  );
};

// Create a separate hook for quantity controls
export const useQuantityControls = (product: ProductType, onShowNotify?: () => void, onShowReserve?: () => void) => {
  const { addItem } = useQuotation();
  const { addItem: addSalesItem, selectedCustomer } = useSalesQuotation();
  const { user } = useAuth();
  const navigate = useNavigate();
  const [quantity, setQuantity] = useState(1);
  const isOutOfStock = product.stock <= 0;
  const isSalesUser = user?.role === "sales";
  const canAddToQuote = isSalesUser ? !!selectedCustomer : true;

  const handleSimilarProducts = () => {
    navigate(`/main/products?category=${encodeURIComponent(product.category)}&exclude=${product.id}`);
  };

  const handleQuantityChange = (newQuantity: number) => {
    setQuantity(newQuantity);
  };

  const handleAddToQuote = () => {
    if (canAddToQuote && !isOutOfStock) {
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

  const quantityControls = (canAddToQuote || !isSalesUser) && (
    <>
      {/* Customer info for sales */}
      {isSalesUser && selectedCustomer && (
        <div className="p-3 bg-blue-50 border border-blue-200 rounded-lg">
          <div className="flex items-center gap-2 text-blue-800">
            <span className="text-sm font-medium">Cotizando para: {selectedCustomer.name}</span>
          </div>
        </div>
      )}

      {/* Quantity selector and stock info */}
      {!isOutOfStock && (
        <div className="flex items-center gap-4">
          <ProductQuantitySelector
            initialQuantity={quantity}
            maxQuantity={product.stock}
            onQuantityChange={handleQuantityChange}
            id="product-detail-quantity"
          />
          <div className="text-sm text-muted-foreground flex items-center">
            <span>Disponibles: {product.stock}</span>
          </div>
        </div>
      )}

      {/* Action buttons */}
      <div className="flex flex-col gap-3">
        {isOutOfStock ? (
          <div className="space-y-3">
            <div className="text-center text-sm text-muted-foreground">
              Este producto está agotado, pero puedes:
            </div>
            <div className="flex flex-col xs:flex-row gap-2">
              <Button
                onClick={onShowNotify}
                variant="outline"
                className="flex-1 gap-2 h-12 border-blue-500 text-blue-500 hover:bg-blue-50"
              >
                <Bell className="h-4 w-4" />
                <span>Notificar cuando esté disponible</span>
              </Button>
            </div>
            <div className="flex flex-col xs:flex-row gap-2">
              <Button
                onClick={onShowReserve}
                variant="outline"
                className="flex-1 gap-2 h-10 border-orange-500 text-orange-500 hover:bg-orange-50"
              >
                <Bookmark className="h-4 w-4" />
                <span>Reservar producto</span>
              </Button>
              <Button
                onClick={handleSimilarProducts}
                variant="outline"
                className="flex-1 gap-2 h-10 border-gray-500 text-gray-500 hover:bg-gray-50"
              >
                <Search className="h-4 w-4" />
                <span>Ver productos similares</span>
              </Button>
            </div>
          </div>
        ) : (
          <Button
            className="flex-1 gap-2 transition-transform active:scale-[0.98] h-12"
            onClick={handleAddToQuote}
            disabled={!canAddToQuote}
          >
            <ShoppingBag className="h-4 w-4" />
            <span>
              {isSalesUser 
                ? selectedCustomer 
                  ? `Agregar para ${selectedCustomer.name}` 
                  : "Selecciona un cliente"
                : "Agregar a cotización"
              }
            </span>
          </Button>
        )}
      </div>

    </>
  );

  return quantityControls;
};

export default ProductDetailActions;
