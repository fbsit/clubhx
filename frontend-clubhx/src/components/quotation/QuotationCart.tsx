
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useQuotation } from "@/contexts/QuotationContext";
import { useSalesQuotation } from "@/contexts/SalesQuotationContext";
import { useAuth } from "@/contexts/AuthContext";
import { ShoppingBag, ShoppingCart, ArrowRight, User } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
  SheetClose,
} from "@/components/ui/sheet";
import { Separator } from "@/components/ui/separator";
import { ScrollArea } from "@/components/ui/scroll-area";
import EmptyCart from "./cart/EmptyCart";
import CartItem from "./cart/CartItem";
import CartFooter from "./cart/CartFooter";

export default function QuotationCart() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { items, itemsCount, totalAmount } = useQuotation();
  const { items: salesItems, itemsCount: salesItemsCount, totalAmount: salesTotalAmount, selectedCustomer } = useSalesQuotation();
  const [isOpen, setIsOpen] = useState(false);
  
  const isSalesUser = user?.role === "sales";
  const activeItems = isSalesUser ? salesItems : items;
  const activeItemsCount = isSalesUser ? salesItemsCount : itemsCount;
  const activeTotalAmount = isSalesUser ? salesTotalAmount : totalAmount;

  const handleProceedToCheckout = () => {
    setIsOpen(false); // Close the sheet
    if (isSalesUser && selectedCustomer) {
      navigate("/main/sales-quotation-checkout");
    } else {
      navigate("/main/quotation-checkout");
    }
  };
  
  const handleAddToQuote = () => {
    setIsOpen(false); // Close the sheet
    navigate("/main/products"); // Navigate back to products
  };

  if (activeItemsCount === 0) {
    return (
      <Button 
        variant="outline" 
        className="fixed bottom-8 right-8 z-50 rounded-full p-4 shadow-md hover:shadow-lg transition-all" 
        onClick={() => setIsOpen(true)}
      >
        <ShoppingBag className="h-5 w-5" />
        <span className="sr-only">Ver cotización</span>
      </Button>
    );
  }

  return (
    <Sheet open={isOpen} onOpenChange={setIsOpen}>
      <SheetTrigger asChild>
        <Button 
          className="fixed bottom-8 right-8 z-50 rounded-full p-4 shadow-md hover:shadow-lg transition-all" 
          onClick={() => setIsOpen(true)}
        >
          <ShoppingBag className="h-5 w-5" />
          <Badge className="absolute -top-2 -right-2 h-6 w-6 flex items-center justify-center p-0 text-xs">
            {activeItemsCount}
          </Badge>
          <span className="sr-only">Ver cotización ({activeItemsCount} productos)</span>
        </Button>
      </SheetTrigger>
      <SheetContent className="flex flex-col w-full sm:max-w-md">
        <SheetHeader>
          <SheetTitle className="flex items-center gap-2">
            <ShoppingCart className="h-5 w-5" />
            {isSalesUser ? "Cotización para Cliente" : "Mi Cotización"}
          </SheetTitle>
          <SheetDescription>
            {isSalesUser && selectedCustomer ? (
              <div className="flex items-center gap-2">
                <User className="h-4 w-4" />
                <span>Cotizando para: <strong>{selectedCustomer.name}</strong></span>
              </div>
            ) : (
              "Revisa los productos que has seleccionado para cotizar"
            )}
          </SheetDescription>
        </SheetHeader>
        <Separator className="my-4" />
        
        {activeItemsCount === 0 ? (
          <EmptyCart onAddProducts={handleAddToQuote} />
        ) : (
          <>
            <ScrollArea className="flex-1 -mr-4 pr-4">
              <ul className="space-y-4">
                {activeItems.map((item) => (
                  <CartItem key={item.product.id} item={item} />
                ))}
              </ul>
            </ScrollArea>

            <CartFooter 
              totalAmount={activeTotalAmount} 
              itemsCount={activeItemsCount}
              onProceedToCheckout={handleProceedToCheckout}
              onAddToQuote={handleAddToQuote}
              actionLabel={isSalesUser ? "Enviar cotización" : "Solicitar cotización"}
            />
          </>
        )}
      </SheetContent>
    </Sheet>
  );
}
