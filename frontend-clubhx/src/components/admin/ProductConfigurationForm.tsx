
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Badge } from "@/components/ui/badge";
import { CalendarIcon, Clock, Percent } from "lucide-react";
import { format } from "date-fns";
import { cn } from "@/lib/utils";

interface ProductFormData {
  name: string;
  description: string;
  price: number;
  stock: number;
  category: string;
  type: string;
  brand: string;
  image: string;
  isPopular: boolean;
  isNew: boolean;
  isVisible: boolean;
  discount: number;
  isOnSale: boolean;
  sku: string;
  loyaltyPoints: number;
  promotionStartDate?: Date;
  promotionEndDate?: Date;
  isScheduledPromotion?: boolean;
}

interface ProductConfigurationFormProps {
  formData: ProductFormData;
  onFormDataChange: (data: ProductFormData) => void;
}

export default function ProductConfigurationForm({
  formData,
  onFormDataChange
}: ProductConfigurationFormProps) {
  const updateFormData = (updates: Partial<ProductFormData>) => {
    onFormDataChange({ ...formData, ...updates });
  };

  const handleDiscountToggle = (checked: boolean) => {
    updateFormData({
      isOnSale: checked,
      discount: checked ? formData.discount : 0,
      isScheduledPromotion: false,
      promotionStartDate: undefined,
      promotionEndDate: undefined
    });
  };

  const getPromotionStatus = () => {
    if (!formData.isScheduledPromotion || !formData.promotionStartDate || !formData.promotionEndDate) {
      return null;
    }
    
    const now = new Date();
    const start = formData.promotionStartDate;
    const end = formData.promotionEndDate;
    
    if (now < start) return { status: "upcoming", label: "Próximamente", color: "bg-blue-500" };
    if (now >= start && now <= end) return { status: "active", label: "Activa", color: "bg-green-500" };
    if (now > end) return { status: "ended", label: "Finalizada", color: "bg-gray-500" };
    
    return null;
  };

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('es-CL', {
      style: 'currency',
      currency: 'CLP'
    }).format(price);
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Configuración del producto</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <Label htmlFor="isVisible">Visible en catálogo</Label>
            <p className="text-sm text-muted-foreground">Los clientes pueden ver este producto</p>
          </div>
          <Switch 
            id="isVisible"
            checked={formData.isVisible}
            onCheckedChange={(checked) => updateFormData({ isVisible: checked })}
          />
        </div>

        <div className="flex items-center justify-between">
          <div>
            <Label htmlFor="isPopular">Producto popular</Label>
            <p className="text-sm text-muted-foreground">Mostrar badge de "Popular"</p>
          </div>
          <Switch 
            id="isPopular"
            checked={formData.isPopular}
            onCheckedChange={(checked) => updateFormData({ isPopular: checked })}
          />
        </div>

        <div className="flex items-center justify-between">
          <div>
            <Label htmlFor="isNew">Producto nuevo</Label>
            <p className="text-sm text-muted-foreground">Mostrar badge de "Nuevo"</p>
          </div>
          <Switch 
            id="isNew"
            checked={formData.isNew}
            onCheckedChange={(checked) => updateFormData({ isNew: checked })}
          />
        </div>

        <div className="flex items-center justify-between">
          <div>
            <Label htmlFor="isOnSale">Producto en liquidación</Label>
            <p className="text-sm text-muted-foreground">Activar descuentos para este producto</p>
          </div>
          <Switch 
            id="isOnSale"
            checked={formData.isOnSale}
            onCheckedChange={handleDiscountToggle}
          />
        </div>

        {formData.isOnSale && (
          <div className="ml-4 pt-4 border-t space-y-4">
            
            {/* Header con icono */}
            <div className="flex items-center gap-2">
              <Percent className="h-4 w-4 text-orange-500" />
              <Label className="text-base font-medium">Configuración de descuento</Label>
            </div>

            {/* Descuento base */}
            <div>
              <Label htmlFor="discount">Porcentaje de descuento (%)</Label>
              <Input 
                id="discount"
                type="number"
                min="0"
                max="100"
                value={formData.discount}
                onChange={(e) => updateFormData({ discount: Number(e.target.value) })}
                className="mt-1"
              />
            </div>

            {/* Programar descuento */}
            <div className="flex items-center justify-between">
              <div>
                <Label htmlFor="isScheduledPromotion">Programar descuento</Label>
                <p className="text-sm text-muted-foreground">Activar y desactivar automáticamente por fechas</p>
              </div>
              <Switch 
                id="isScheduledPromotion"
                checked={formData.isScheduledPromotion || false}
                onCheckedChange={(checked) => updateFormData({ 
                  isScheduledPromotion: checked,
                  promotionStartDate: checked ? formData.promotionStartDate : undefined,
                  promotionEndDate: checked ? formData.promotionEndDate : undefined
                })}
              />
            </div>

            {/* Configuración de fechas */}
            {formData.isScheduledPromotion && (
              <div className="ml-4 space-y-4 border-l-2 border-orange-200 pl-4">
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <Label>Fecha y hora inicio</Label>
                    <Popover>
                      <PopoverTrigger asChild>
                        <Button
                          variant="outline"
                          className={cn(
                            "w-full justify-start text-left font-normal mt-1",
                            !formData.promotionStartDate && "text-muted-foreground"
                          )}
                        >
                          <CalendarIcon className="mr-2 h-4 w-4" />
                          {formData.promotionStartDate ? (
                            format(formData.promotionStartDate, "dd/MM/yyyy")
                          ) : (
                            <span>Fecha inicio</span>
                          )}
                        </Button>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-0">
                        <Calendar
                          mode="single"
                          selected={formData.promotionStartDate}
                          onSelect={(date) => updateFormData({ promotionStartDate: date })}
                          initialFocus
                          className="pointer-events-auto"
                        />
                      </PopoverContent>
                    </Popover>
                  </div>

                  <div>
                    <Label>Fecha y hora fin</Label>
                    <Popover>
                      <PopoverTrigger asChild>
                        <Button
                          variant="outline"
                          className={cn(
                            "w-full justify-start text-left font-normal mt-1",
                            !formData.promotionEndDate && "text-muted-foreground"
                          )}
                        >
                          <CalendarIcon className="mr-2 h-4 w-4" />
                          {formData.promotionEndDate ? (
                            format(formData.promotionEndDate, "dd/MM/yyyy")
                          ) : (
                            <span>Fecha fin</span>
                          )}
                        </Button>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-0">
                        <Calendar
                          mode="single"
                          selected={formData.promotionEndDate}
                          onSelect={(date) => updateFormData({ promotionEndDate: date })}
                          initialFocus
                          className="pointer-events-auto"
                        />
                      </PopoverContent>
                    </Popover>
                  </div>
                </div>

                {/* Estado de la promoción */}
                {getPromotionStatus() && (
                  <div className="p-3 bg-gray-50 rounded-lg">
                    <div className="flex items-center gap-2 mb-1">
                      <Clock className="h-4 w-4 text-gray-600" />
                      <span className="text-sm font-medium">Estado de la promoción</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className={cn("w-2 h-2 rounded-full", getPromotionStatus()?.color)}></div>
                      <span className="text-sm">{getPromotionStatus()?.label}</span>
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* Vista previa del precio */}
            <div className="p-4 bg-muted/30 rounded-lg">
              <Label className="text-sm font-medium">Vista previa del precio</Label>
              <div className="mt-2">
                <div className="text-xl font-bold text-green-600">
                  {formatPrice(Math.round(formData.price * (100 - formData.discount) / 100))}
                </div>
                <div className="text-sm text-muted-foreground">
                  Precio original: {formatPrice(formData.price)}
                </div>
                {formData.discount > 0 && (
                  <div className="text-sm text-muted-foreground">
                    Ahorro: {formatPrice(Math.round(formData.price * formData.discount / 100))} (-{formData.discount}%)
                  </div>
                )}
              </div>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
