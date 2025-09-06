
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ShoppingBag, Plus, Minus } from "lucide-react";
import { ProductType } from "@/types/product";
import ProductBadges from "./ProductBadges";
import ProductPriceDisplay, { calculatePricePerUnit } from "./ProductPriceDisplay";
import ProductQuantitySelector from "./ProductQuantitySelector";

interface ProductDetailModalProps {
  selectedProduct: ProductType | null;
  onClose: () => void;
  productQuantity: number;
  setProductQuantity: (quantity: number) => void;
  onAddToQuote: (product: ProductType, quantity: number) => void;
}

const ProductDetailModal = ({
  selectedProduct,
  onClose,
  productQuantity,
  setProductQuantity,
  onAddToQuote
}: ProductDetailModalProps) => {
  if (!selectedProduct) return null;

  const handleQuantityChange = (newQuantity: number) => {
    setProductQuantity(newQuantity);
  };

  // Calculate price per liter/kg for selected product
  const pricePerUnit = calculatePricePerUnit(selectedProduct);

  return (
    <Dialog open={selectedProduct !== null} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="max-w-lg">
        <DialogHeader>
          <DialogTitle className="flex items-center text-lg gap-2">
            {selectedProduct.name}
            {selectedProduct.isNew && <Badge className="bg-blue-500">Nuevo</Badge>}
            {selectedProduct.discount > 0 && (
              <Badge className="bg-red-500">-{selectedProduct.discount}%</Badge>
            )}
          </DialogTitle>
          <DialogDescription>
            {selectedProduct.category} | {selectedProduct.brand}
          </DialogDescription>
        </DialogHeader>

        <div className="grid md:grid-cols-2 gap-4">
          <div className="flex items-center justify-center rounded-md overflow-hidden bg-muted/20 p-4">
            <img
              src={selectedProduct.image}
              alt={selectedProduct.name}
              className="object-contain max-h-52 w-full"
              onError={(e) => {
                (e.target as HTMLImageElement).src = "https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?auto=format&fit=crop&q=80";
              }}
            />
          </div>

          <div className="space-y-4">
            <div>
              <h4 className="font-medium text-sm mb-1">Descripción</h4>
              <p className="text-sm text-muted-foreground">
                {selectedProduct.description}
              </p>
            </div>

            {selectedProduct.volume && (
              <div>
                <h4 className="font-medium text-sm mb-1">Presentación</h4>
                <p className="text-sm">
                  {selectedProduct.volume} {selectedProduct.volumeUnit} 
                  {pricePerUnit && (
                    <span className="text-muted-foreground ml-2">· {pricePerUnit}</span>
                  )}
                </p>
              </div>
            )}

            <div className="flex items-end gap-2">
              <ProductPriceDisplay product={selectedProduct} size="large" />
            </div>

            <div className="flex items-center justify-between">
              <span className="text-sm">
                {selectedProduct.stock > 0 
                  ? `${selectedProduct.stock} unidades disponibles` 
                  : "Producto sin stock"}
              </span>
              {selectedProduct.isPopular && (
                <ProductBadges 
                  product={selectedProduct}
                  position="inline"
                  showNew={false}
                  showDiscount={false}
                />
              )}
            </div>

            {selectedProduct.stock > 0 && (
              <div className="flex items-center justify-between p-2 bg-muted/20 rounded-lg">
                <span className="font-medium text-sm">Cantidad:</span>
                <ProductQuantitySelector
                  initialQuantity={productQuantity}
                  maxQuantity={selectedProduct.stock}
                  onQuantityChange={handleQuantityChange}
                />
              </div>
            )}

            <Button 
              onClick={() => {
                onAddToQuote(selectedProduct, productQuantity);
                onClose();
              }} 
              disabled={selectedProduct.stock <= 0}
              className="w-full"
            >
              <ShoppingBag className="h-4 w-4 mr-2" />
              {selectedProduct.stock > 0 
                ? "Agregar a Cotización" 
                : "Producto sin Stock"}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default ProductDetailModal;
