
import React from "react";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Calendar, Clock } from "lucide-react";
import OptimizedImage from "@/components/ui/optimized-image";

interface ProductDetailDialogProps {
  // Nuevo contrato (usado por ClientLoyaltyView)
  isOpen: boolean;
  onClose?: () => void;
  product?: any;
  userPoints?: number;
  onRedeem?: () => void;
  // Contrato anterior (compat)
  setIsOpen?: (open: boolean) => void;
  selectedProduct?: any;
  totalPoints?: number;
  onConfirmRedeem?: () => void;
}

export const ProductDetailDialog: React.FC<ProductDetailDialogProps> = (props) => {
  const {
    isOpen,
    onClose,
    product,
    userPoints,
    onRedeem,
    setIsOpen,
    selectedProduct,
    totalPoints,
    onConfirmRedeem,
  } = props;

  // Normaliza nombres de props para soportar ambos contratos
  const item = product ?? selectedProduct;
  const points = typeof userPoints === "number" ? userPoints : (totalPoints ?? 0);
  const close = onClose ?? (setIsOpen ? () => setIsOpen(false) : undefined);
  const confirm = onRedeem ?? onConfirmRedeem;

  if (!item) return null;

  return (
    <Dialog open={isOpen} onOpenChange={(open) => (setIsOpen ? setIsOpen(open) : onClose && !open ? onClose() : undefined)}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Detalle del Producto</DialogTitle>
          <DialogDescription>
            Revisa los detalles antes de canjear tus puntos
          </DialogDescription>
        </DialogHeader>
        
        <div className="space-y-4 py-4">
          <div className="aspect-video relative overflow-hidden shadow-sm">
            <OptimizedImage
              src={item.image} 
              alt={item.title}
              className="w-full h-full"
            />
          </div>
          
          <div>
            <h3 className="text-lg font-semibold">{item.title}</h3>
            <p className="text-muted-foreground mt-1">{item.description}</p>
          </div>
          
          <div className="flex justify-between items-center border-t pt-4">
            <div>
              <p className="text-sm text-muted-foreground">Puntos necesarios</p>
              <p className="text-xl font-bold">{item.pointsCost.toLocaleString()}</p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Tus puntos</p>
              <p className="text-xl font-bold">{points.toLocaleString()}</p>
            </div>
          </div>
          
          {item.date && (
            <div className="flex items-center gap-2 text-sm">
              <Calendar className="h-4 w-4 text-muted-foreground" />
              <span>{item.date}</span>
            </div>
          )}
          
          {item.location && (
            <div className="flex items-center gap-2 text-sm">
              <Clock className="h-4 w-4 text-muted-foreground" />
              <span>{item.location}</span>
            </div>
          )}
          
          {item.available && (
            <div className="text-sm text-muted-foreground">
              Solo quedan {item.available} disponibles
            </div>
          )}
        </div>
        
        <DialogFooter>
          <Button variant="outline" onClick={close}>Cancelar</Button>
          <Button 
            onClick={confirm}
            disabled={points < item.pointsCost}
          >
            Canjear {item.pointsCost.toLocaleString()} puntos
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default ProductDetailDialog;
