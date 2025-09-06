
import React from "react";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Calendar, Clock } from "lucide-react";
import OptimizedImage from "@/components/ui/optimized-image";

interface ProductDetailDialogProps {
  isOpen: boolean;
  setIsOpen: (open: boolean) => void;
  selectedProduct: any;
  totalPoints: number;
  onConfirmRedeem: () => void;
}

export const ProductDetailDialog: React.FC<ProductDetailDialogProps> = ({
  isOpen,
  setIsOpen,
  selectedProduct,
  totalPoints,
  onConfirmRedeem
}) => {
  if (!selectedProduct) return null;

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
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
              src={selectedProduct.image} 
              alt={selectedProduct.title}
              className="w-full h-full"
            />
          </div>
          
          <div>
            <h3 className="text-lg font-semibold">{selectedProduct.title}</h3>
            <p className="text-muted-foreground mt-1">{selectedProduct.description}</p>
          </div>
          
          <div className="flex justify-between items-center border-t pt-4">
            <div>
              <p className="text-sm text-muted-foreground">Puntos necesarios</p>
              <p className="text-xl font-bold">{selectedProduct.pointsCost.toLocaleString()}</p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Tus puntos</p>
              <p className="text-xl font-bold">{totalPoints.toLocaleString()}</p>
            </div>
          </div>
          
          {selectedProduct.date && (
            <div className="flex items-center gap-2 text-sm">
              <Calendar className="h-4 w-4 text-muted-foreground" />
              <span>{selectedProduct.date}</span>
            </div>
          )}
          
          {selectedProduct.location && (
            <div className="flex items-center gap-2 text-sm">
              <Clock className="h-4 w-4 text-muted-foreground" />
              <span>{selectedProduct.location}</span>
            </div>
          )}
          
          {selectedProduct.available && (
            <div className="text-sm text-muted-foreground">
              Solo quedan {selectedProduct.available} disponibles
            </div>
          )}
        </div>
        
        <DialogFooter>
          <Button variant="outline" onClick={() => setIsOpen(false)}>Cancelar</Button>
          <Button 
            onClick={onConfirmRedeem}
            disabled={totalPoints < selectedProduct.pointsCost}
          >
            Canjear {selectedProduct.pointsCost.toLocaleString()} puntos
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default ProductDetailDialog;
