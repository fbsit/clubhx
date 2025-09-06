import { useProductDetail } from "@/hooks/useProductDetail";
import { useQuotation } from "@/contexts/QuotationContext";
import { calculatePromotionalPoints, isDiscountActive, getDiscountUrgencyText } from "@/utils/promotionUtils";
import ProductRecommendationsIOS from "./ProductRecommendationsIOS";

export default function ProductDetailIOS() {
  const { 
    loading, 
    displayProduct, 
    discountedPrice, 
    selectedOptions, 
    handleOptionChange 
  } = useProductDetail();
  
  const { addItem } = useQuotation();

  if (loading) {
    return (
      <div className="ios-product-detail min-h-screen bg-background p-6">
        <div className="text-base text-center">Cargando producto...</div>
      </div>
    );
  }

  if (!displayProduct) {
    return (
      <div className="ios-product-detail min-h-screen bg-background p-6">
        <div className="text-base text-center">Producto no encontrado</div>
      </div>
    );
  }

  return (
    <div className="ios-product-detail min-h-screen bg-background">
      {/* Header */}
      <div className="p-6 border-b">
        <button 
          onClick={() => window.history.back()}
          className="text-base p-4 bg-secondary rounded-lg min-h-[44px]"
        >
          ← Volver
        </button>
      </div>

      {/* Product Image */}
      <div className="p-6">
        <div className="aspect-square bg-muted rounded-lg overflow-hidden">
          <img 
            src={displayProduct.image} 
            alt={displayProduct.name}
            className="w-full h-full object-cover"
          />
        </div>
      </div>

      {/* Product Info */}
      <div className="p-6 space-y-6">
        <div>
          <div className="text-base font-medium mb-2">{displayProduct.brand}</div>
          <div className="text-lg font-semibold mb-4">{displayProduct.name}</div>
          
          {/* Price */}
          <div className="mb-6">
            {discountedPrice ? (
              <div className="space-y-2">
                <div className="text-xl font-bold text-destructive">
                  ${discountedPrice.toLocaleString('es-CL')}
                </div>
                <div className="text-base line-through text-muted-foreground">
                  ${displayProduct.price.toLocaleString('es-CL')}
                </div>
              </div>
            ) : (
              <div className="text-xl font-bold">
                ${displayProduct.price.toLocaleString('es-CL')}
              </div>
            )}
          </div>
        </div>

        {/* Options */}
        {displayProduct.options && displayProduct.options.length > 0 && (
          <div className="space-y-4">
            <div className="text-base font-medium">Opciones disponibles:</div>
            
            {(() => {
              const optionGroups = displayProduct.options.reduce((acc, option) => {
                if (!acc[option.name]) {
                  acc[option.name] = [];
                }
                acc[option.name].push(option);
                return acc;
              }, {} as Record<string, typeof displayProduct.options>);

              return Object.entries(optionGroups).map(([groupName, options]) => (
                <div key={groupName} className="space-y-3">
                  <div className="text-base">{groupName}:</div>
                  <div className="grid grid-cols-1 gap-3">
                    {options.map((option) => {
                      const isSelected = selectedOptions.some(
                        selected => selected.name === option.name && selected.value === option.value
                      );
                      
                      return (
                        <button
                          key={option.id}
                          onClick={() => handleOptionChange(option)}
                          className={`
                            p-4 rounded-lg border-2 min-h-[44px] text-left
                            ${isSelected 
                              ? 'border-primary bg-primary/10' 
                              : 'border-border bg-background'
                            }
                          `}
                        >
                          <div className="text-base font-medium">{option.value}</div>
                          <div className="text-base text-muted-foreground">
                            ${option.price.toLocaleString('es-CL')}
                          </div>
                        </button>
                      );
                    })}
                  </div>
                </div>
              ));
            })()}
          </div>
        )}

        {/* Description */}
        {displayProduct.description && (
          <div className="space-y-3">
            <div className="text-base font-medium">Descripción:</div>
            <div className="text-base text-muted-foreground leading-relaxed">
              {displayProduct.description}
            </div>
          </div>
        )}

        {/* Loyalty Points */}
        {(() => {
          const pointsData = calculatePromotionalPoints(displayProduct);
          if (pointsData.promotionalPoints > 0) {
            return (
              <div className="space-y-3 p-4 bg-muted/50 rounded-lg">
                <div className="text-base font-medium">Puntos de Lealtad:</div>
                <div className="space-y-2">
                  <div className="text-base">
                    Ganarás {pointsData.promotionalPoints} puntos
                  </div>
                  {pointsData.hasActivePromotion && (
                    <div className="text-base text-primary">
                      ¡Promoción {pointsData.multiplier}x activa!
                    </div>
                  )}
                </div>
              </div>
            );
          }
          return null;
        })()}

        {/* Discount Badge */}
        {isDiscountActive(displayProduct) && (
          <div className="p-4 bg-destructive/10 border border-destructive/20 rounded-lg">
            <div className="text-base font-medium text-destructive">
              -{displayProduct.discount}% de descuento
            </div>
            {getDiscountUrgencyText(displayProduct) && (
              <div className="text-base text-destructive/80 mt-1">
                {getDiscountUrgencyText(displayProduct)}
              </div>
            )}
          </div>
        )}

        {/* Stock Info */}
        <div className="space-y-3">
          <div className="text-base font-medium">Disponibilidad:</div>
          <div className="text-base">
            {displayProduct.stock > 0 
              ? `${displayProduct.stock} unidades disponibles`
              : 'Sin stock'
            }
          </div>
        </div>
      </div>

      {/* Actions */}
      <div className="p-6 space-y-4">
        {displayProduct.stock > 0 ? (
          <button 
            onClick={() => addItem(displayProduct, 1)}
            className="w-full bg-primary text-primary-foreground text-base font-medium py-4 rounded-lg min-h-[44px]"
          >
            Agregar a Cotización
          </button>
        ) : (
          <button className="w-full border border-border text-base font-medium py-4 rounded-lg min-h-[44px]">
            Notificarme cuando esté disponible
          </button>
        )}
      </div>

      {/* Product Recommendations */}
      <div className="p-6 border-t">
        <ProductRecommendationsIOS 
          excludeProductId={displayProduct.id}
          category={displayProduct.category}
        />
      </div>

      {/* Bottom spacing for FAB */}
      <div className="h-24"></div>
    </div>
  );
}