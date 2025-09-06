
import { FC } from "react";
import { ShoppingBag } from "lucide-react";
import { Button } from "@/components/ui/button";
import { SheetClose } from "@/components/ui/sheet";

interface EmptyCartProps {
  onAddProducts: () => void;
}

const EmptyCart: FC<EmptyCartProps> = ({ onAddProducts }) => {
  return (
    <div className="flex flex-col items-center justify-center flex-1 py-8">
      <div className="bg-muted/20 p-6 rounded-full mb-4">
        <ShoppingBag className="h-10 w-10 text-muted-foreground" />
      </div>
      <h3 className="text-lg font-medium mb-2">Tu cotización está vacía</h3>
      <p className="text-center text-muted-foreground mb-6">
        Agrega productos para comenzar tu cotización
      </p>
      <SheetClose asChild>
        <Button 
          variant="outline" 
          onClick={onAddProducts}
          className="flex items-center gap-2"
        >
          <ShoppingBag className="h-4 w-4" />
          Agregar productos
        </Button>
      </SheetClose>
    </div>
  );
};

export default EmptyCart;
