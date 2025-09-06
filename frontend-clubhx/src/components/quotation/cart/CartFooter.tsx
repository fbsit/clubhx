
import { FC } from "react";
import { ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { SheetClose } from "@/components/ui/sheet";

interface CartFooterProps {
  totalAmount: number;
  itemsCount: number;
  onProceedToCheckout: () => void;
  onAddToQuote: () => void;
  actionLabel?: string;
}

export default function CartFooter({ totalAmount, itemsCount, onProceedToCheckout, onAddToQuote, actionLabel }: CartFooterProps) {
  return (
    <div className="pt-6 pb-2 border-t mt-4">
      <div className="flex items-center justify-between mb-4">
        <div className="font-medium text-lg">
          Total productos: <span className="text-primary">{itemsCount}</span>
        </div>
        <div className="font-bold text-lg">
          ${totalAmount.toLocaleString('es-CL')}
        </div>
      </div>
      <div className="flex gap-2">
        <button 
          className="w-full rounded-md bg-primary text-white font-medium py-2 hover:bg-primary/90 transition-colors"
          onClick={onProceedToCheckout}
        >
          {actionLabel ? actionLabel : "Revisar cotización"}
        </button>
        <button 
          className="rounded-md border border-input bg-background px-4 py-2 text-sm hover:bg-accent"
          onClick={onAddToQuote}
        >
          Agregar más productos
        </button>
      </div>
    </div>
  )
}
