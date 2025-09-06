
import { FC } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Star, Flame } from "lucide-react";
import { QuoteItemType } from "@/types/product";
import { calculatePromotionalPoints, isDiscountActive, isPromotionActive } from "@/utils/promotionUtils";

// Calculate loyalty points earned per item using promotional calculation
const calculateItemLoyaltyPoints = (item: QuoteItemType): number => {
  const { promotionalPoints } = calculatePromotionalPoints(item.product);
  return promotionalPoints * item.quantity;
};

type QuotationSummaryProps = {
  items: QuoteItemType[];
  totalAmount: number;
  shippingCost?: number;
};

const QuotationSummary: FC<QuotationSummaryProps> = ({ 
  items, 
  totalAmount, 
  shippingCost = 5500 
}) => {
  const finalTotal = totalAmount + shippingCost;
  
  // Calculate total loyalty points for the entire purchase
  const totalLoyaltyPoints = items.reduce((total, item) => {
    return total + calculateItemLoyaltyPoints(item);
  }, 0);

  // Calculate promotion statistics
  const itemsWithDiscounts = items.filter(item => isDiscountActive(item.product));
  const itemsWithLoyaltyPromo = items.filter(item => isPromotionActive(item.product.loyaltyPromotion));
  const totalSavings = itemsWithDiscounts.reduce((total, item) => {
    const originalPrice = item.product.price * item.quantity;
    const discountedPrice = (item.product.price * (100 - item.product.discount)) / 100 * item.quantity;
    return total + (originalPrice - discountedPrice);
  }, 0);

  return (
    <Card>
      <CardHeader>
        <CardTitle>Resumen</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <div className="flex justify-between text-sm">
            <span className="text-muted-foreground">Productos:</span>
            <span>{items.length}</span>
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-muted-foreground">Unidades totales:</span>
            <span>{items.reduce((acc, item) => acc + item.quantity, 0)}</span>
          </div>
          <Separator className="my-2" />
          <div className="flex justify-between text-sm">
            <span className="text-muted-foreground">Subtotal productos:</span>
            <span>${totalAmount.toLocaleString('es-CL')}</span>
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-muted-foreground">Costo de despacho:</span>
            <span>${shippingCost.toLocaleString('es-CL')}</span>
          </div>
          <Separator className="my-2" />
          <div className="flex justify-between font-medium text-base">
            <span>Total:</span>
            <span>${finalTotal.toLocaleString('es-CL')}</span>
          </div>
          <div className="flex justify-between text-xs text-muted-foreground">
            <span>*Los precios no incluyen IVA</span>
          </div>
        </div>
        
        {/* Promotional Savings Section */}
        {totalSavings > 0 && (
          <>
            <Separator className="my-3" />
            <div className="bg-red-50 border border-red-200 rounded-lg p-3">
              <div className="flex items-center gap-2 text-red-700 mb-1">
                <Flame className="h-4 w-4" />
                <span className="font-medium text-sm">Ahorros aplicados</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-red-600">Descuentos activos en {itemsWithDiscounts.length} producto{itemsWithDiscounts.length > 1 ? 's' : ''}:</span>
                <span className="font-bold text-lg text-red-700">-${totalSavings.toLocaleString('es-CL')}</span>
              </div>
            </div>
          </>
        )}

        {/* Loyalty Points Section */}
        {totalLoyaltyPoints > 0 && (
          <>
            <Separator className="my-3" />
            <div className="bg-amber-50 border border-amber-200 rounded-lg p-3">
              <div className="flex items-center gap-2 text-amber-700 mb-1">
                <Star className="h-4 w-4 fill-current" />
                <span className="font-medium text-sm">Puntos que ganarás</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-amber-600">Con esta compra sumarás:</span>
                <span className="font-bold text-lg text-amber-700">+{totalLoyaltyPoints} puntos</span>
              </div>
              {itemsWithLoyaltyPromo.length > 0 && (
                <div className="text-xs text-amber-600 mt-1">
                  Incluye multiplicadores activos en {itemsWithLoyaltyPromo.length} producto{itemsWithLoyaltyPromo.length > 1 ? 's' : ''}
                </div>
              )}
            </div>
          </>
        )}
        
        <div className="text-center bg-muted/30 p-3 rounded-lg text-sm text-muted-foreground">
          Esta solicitud de cotización no representa un compromiso de compra
        </div>
      </CardContent>
    </Card>
  );
};

export default QuotationSummary;
