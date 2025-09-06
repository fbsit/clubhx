
import { FC } from "react";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { ChevronRight, Plus, Minus, X, ShoppingCart } from "lucide-react";
import { QuoteItemType } from "@/types/product";
import { useQuotation } from "@/contexts/QuotationContext";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";

type ReviewProductsStepProps = {
  items: QuoteItemType[];
  notes: string;
  setNotes: (notes: string) => void;
  onNext: () => void;
};

const ReviewProductsStep: FC<ReviewProductsStepProps> = ({ items, notes, setNotes, onNext }) => {
  const { updateQuantity, removeItem } = useQuotation();
  const navigate = useNavigate();

  const handleQuantityChange = (productId: string, newQuantity: number) => {
    updateQuantity(productId, newQuantity);
  };

  const handleRemoveItem = (productId: string, productName: string) => {
    removeItem(productId);
    toast.success("Producto eliminado", {
      description: `${productName} se ha eliminado de tu cotización`,
    });
  };

  const handleAddMoreProducts = () => {
    navigate("/main/products");
    toast.info("Continuando compra", {
      description: "Puedes agregar más productos a tu cotización actual",
    });
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-xl">Productos seleccionados</CardTitle>
        <CardDescription>
          Revisa y modifica los productos de tu cotización
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {items.map(item => {
          const discountedPrice = item.product.discount > 0
            ? (item.product.price * (100 - item.product.discount)) / 100
            : item.product.price;
          
          return (
            <div key={item.product.id} className="flex gap-4 py-3 border border-border/20 rounded-lg p-3 bg-background/50">
              <div className="h-16 w-16 rounded bg-muted/20 overflow-hidden flex-shrink-0">
                <img 
                  src={item.product.image} 
                  alt={item.product.name} 
                  className="h-full w-full object-cover"
                  loading="lazy"
                  onError={(e) => {
                    (e.target as HTMLImageElement).src = "https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?auto=format&fit=crop&q=80";
                  }}
                />
              </div>
              <div className="flex-1">
                <div className="flex justify-between items-start">
                  <div className="flex-1">
                    <h4 className="font-medium text-sm">{item.product.name}</h4>
                    <p className="text-xs text-muted-foreground">
                      {item.product.brand} • {item.product.volume} {item.product.volumeUnit}
                    </p>
                  </div>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleRemoveItem(item.product.id, item.product.name)}
                    className="h-8 w-8 p-0 text-muted-foreground hover:text-destructive"
                  >
                    <X className="h-4 w-4" />
                  </Button>
                </div>
                
                <div className="flex justify-between items-center mt-2">
                  <div className="flex items-center gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleQuantityChange(item.product.id, item.quantity - 1)}
                      disabled={item.quantity <= 1}
                      className="h-8 w-8 p-0"
                    >
                      <Minus className="h-3 w-3" />
                    </Button>
                    <span className="min-w-[2rem] text-center text-sm font-medium">
                      {item.quantity}
                    </span>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleQuantityChange(item.product.id, item.quantity + 1)}
                      disabled={item.quantity >= Math.min(item.product.stock, 10)}
                      className="h-8 w-8 p-0"
                    >
                      <Plus className="h-3 w-3" />
                    </Button>
                  </div>
                  
                  <div className="text-right">
                    <div className="font-medium text-sm">
                      ${(discountedPrice * item.quantity).toLocaleString('es-CL')}
                    </div>
                    <div className="text-xs text-muted-foreground">
                      ${discountedPrice.toLocaleString('es-CL')} c/u
                      {item.product.discount > 0 && (
                        <span className="ml-1 bg-red-100 text-red-600 px-1 py-0.5 rounded text-xs">
                          -{item.product.discount}%
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          );
        })}
        
        {/* Add more products button */}
        <Button
          variant="outline"
          onClick={handleAddMoreProducts}
          className="w-full border-dashed border-2 py-3 text-muted-foreground hover:text-foreground hover:border-primary/50"
        >
          <ShoppingCart className="h-4 w-4 mr-2" />
          Agregar más productos
        </Button>
        
        <Separator className="my-2" />
        
        <div className="space-y-2">
          <Label htmlFor="notes">Notas adicionales (opcional)</Label>
          <Textarea 
            id="notes" 
            placeholder="Añade cualquier instrucción especial o comentario sobre tu cotización..."
            className="resize-none"
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
          />
        </div>
      </CardContent>
      <CardFooter className="flex justify-end">
        <Button onClick={onNext} className="flex items-center">
          Continuar <ChevronRight className="ml-1 h-4 w-4" />
        </Button>
      </CardFooter>
    </Card>
  );
};

export default ReviewProductsStep;
