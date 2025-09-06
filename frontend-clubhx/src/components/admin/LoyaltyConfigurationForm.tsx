import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Badge } from "@/components/ui/badge";
import { CalendarIcon, Gift, Star, Zap } from "lucide-react";
import { format } from "date-fns";
import { cn } from "@/lib/utils";
import { LoyaltyPromotion, LoyaltyBonus } from "@/types/product";

interface LoyaltyConfigurationFormProps {
  price: number;
  loyaltyPoints: number;
  loyaltyPointsMode: 'automatic' | 'manual';
  loyaltyPointsRate: number;
  loyaltyPromotion?: LoyaltyPromotion;
  loyaltyBonus?: LoyaltyBonus;
  onLoyaltyPointsChange: (points: number) => void;
  onLoyaltyPointsModeChange: (mode: 'automatic' | 'manual') => void;
  onLoyaltyPointsRateChange: (rate: number) => void;
  onLoyaltyPromotionChange: (promotion: LoyaltyPromotion) => void;
  onLoyaltyBonusChange: (bonus: LoyaltyBonus) => void;
}

export default function LoyaltyConfigurationForm({
  price,
  loyaltyPoints,
  loyaltyPointsMode,
  loyaltyPointsRate,
  loyaltyPromotion,
  loyaltyBonus,
  onLoyaltyPointsChange,
  onLoyaltyPointsModeChange,
  onLoyaltyPointsRateChange,
  onLoyaltyPromotionChange,
  onLoyaltyBonusChange
}: LoyaltyConfigurationFormProps) {
  
  const calculateAutomaticPoints = () => {
    return Math.floor(price / loyaltyPointsRate);
  };

  const handleModeChange = (isAutomatic: boolean) => {
    const mode = isAutomatic ? 'automatic' : 'manual';
    onLoyaltyPointsModeChange(mode);
    if (isAutomatic) {
      onLoyaltyPointsChange(calculateAutomaticPoints());
    }
  };

  const updatePromotion = (updates: Partial<LoyaltyPromotion>) => {
    const updatedPromotion = {
      isActive: false,
      multiplier: 2,
      ...loyaltyPromotion,
      ...updates
    };
    onLoyaltyPromotionChange(updatedPromotion);
  };

  const updateBonus = (updates: Partial<LoyaltyBonus>) => {
    const updatedBonus = {
      firstPurchaseBonus: 0,
      volumeBonus: { minQuantity: 5, bonusPoints: 10 },
      ...loyaltyBonus,
      ...updates
    };
    onLoyaltyBonusChange(updatedBonus);
  };

  const formatPrice = (amount: number) => {
    return new Intl.NumberFormat('es-CL', {
      style: 'currency',
      currency: 'CLP'
    }).format(amount);
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Star className="h-5 w-5 text-yellow-500" />
          Puntos de Fidelización
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        
        {/* Cálculo de Puntos Base */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <Label>Cálculo automático de puntos</Label>
              <p className="text-sm text-muted-foreground">
                Calcular puntos basado en el precio del producto
              </p>
            </div>
            <Switch 
              checked={loyaltyPointsMode === 'automatic'}
              onCheckedChange={handleModeChange}
            />
          </div>

          {loyaltyPointsMode === 'automatic' ? (
            <div className="ml-4 space-y-3 border-l-2 border-blue-200 pl-4">
              <div>
                <Label htmlFor="loyaltyRate">1 punto cada (CLP)</Label>
                <Input
                  id="loyaltyRate"
                  type="number"
                  value={loyaltyPointsRate}
                  onChange={(e) => {
                    const rate = Number(e.target.value);
                    onLoyaltyPointsRateChange(rate);
                    onLoyaltyPointsChange(Math.floor(price / rate));
                  }}
                  className="mt-1"
                />
              </div>
              <div className="p-3 bg-blue-50 rounded-lg">
                <div className="text-sm font-medium text-blue-900">
                  Puntos calculados: {calculateAutomaticPoints()} puntos
                </div>
                <div className="text-xs text-blue-700">
                  {formatPrice(price)} ÷ {formatPrice(loyaltyPointsRate)} = {calculateAutomaticPoints()} puntos
                </div>
              </div>
            </div>
          ) : (
            <div className="ml-4 border-l-2 border-orange-200 pl-4">
              <Label htmlFor="manualPoints">Puntos fijos</Label>
              <Input
                id="manualPoints"
                type="number"
                value={loyaltyPoints}
                onChange={(e) => onLoyaltyPointsChange(Number(e.target.value))}
                className="mt-1"
              />
            </div>
          )}
        </div>

        {/* Multiplicador Promocional */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <Label>Multiplicador promocional</Label>
              <p className="text-sm text-muted-foreground">
                Activar puntos extra temporalmente
              </p>
            </div>
            <Switch 
              checked={loyaltyPromotion?.isActive || false}
              onCheckedChange={(checked) => updatePromotion({ isActive: checked })}
            />
          </div>

          {loyaltyPromotion?.isActive && (
            <div className="ml-4 space-y-4 border-l-2 border-purple-200 pl-4">
              <div>
                <Label htmlFor="multiplier">Multiplicador</Label>
                <Input
                  id="multiplier"
                  type="number"
                  min="1"
                  step="0.1"
                  value={loyaltyPromotion.multiplier}
                  onChange={(e) => updatePromotion({ multiplier: Number(e.target.value) })}
                  className="mt-1"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <Label>Fecha inicio</Label>
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button
                        variant="outline"
                        className={cn(
                          "w-full justify-start text-left font-normal mt-1",
                          !loyaltyPromotion.startDate && "text-muted-foreground"
                        )}
                      >
                        <CalendarIcon className="mr-2 h-4 w-4" />
                        {loyaltyPromotion.startDate ? (
                          format(loyaltyPromotion.startDate, "dd/MM/yyyy")
                        ) : (
                          <span>Seleccionar fecha</span>
                        )}
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0">
                      <Calendar
                        mode="single"
                        selected={loyaltyPromotion.startDate}
                        onSelect={(date) => updatePromotion({ startDate: date })}
                        initialFocus
                        className="pointer-events-auto"
                      />
                    </PopoverContent>
                  </Popover>
                </div>

                <div>
                  <Label>Fecha fin</Label>
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button
                        variant="outline"
                        className={cn(
                          "w-full justify-start text-left font-normal mt-1",
                          !loyaltyPromotion.endDate && "text-muted-foreground"
                        )}
                      >
                        <CalendarIcon className="mr-2 h-4 w-4" />
                        {loyaltyPromotion.endDate ? (
                          format(loyaltyPromotion.endDate, "dd/MM/yyyy")
                        ) : (
                          <span>Seleccionar fecha</span>
                        )}
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0">
                      <Calendar
                        mode="single"
                        selected={loyaltyPromotion.endDate}
                        onSelect={(date) => updatePromotion({ endDate: date })}
                        initialFocus
                        className="pointer-events-auto"
                      />
                    </PopoverContent>
                  </Popover>
                </div>
              </div>

              <div className="p-3 bg-purple-50 rounded-lg">
                <div className="flex items-center gap-2 mb-1">
                  <Zap className="h-4 w-4 text-purple-600" />
                  <span className="text-sm font-medium text-purple-900">
                    Puntos con multiplicador
                  </span>
                </div>
                <div className="text-lg font-bold text-purple-900">
                  {Math.floor(loyaltyPoints * loyaltyPromotion.multiplier)} puntos
                </div>
                <div className="text-xs text-purple-700">
                  {loyaltyPoints} × {loyaltyPromotion.multiplier} = {Math.floor(loyaltyPoints * loyaltyPromotion.multiplier)}
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Bonificaciones Especiales */}
        <div className="space-y-4">
          <div className="flex items-center gap-2">
            <Gift className="h-4 w-4 text-green-500" />
            <Label className="text-base font-medium">Bonificaciones especiales</Label>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="p-4 border rounded-lg space-y-3">
              <div className="flex items-center gap-2">
                <Badge variant="secondary" className="text-xs">Primera compra</Badge>
              </div>
              <div>
                <Label htmlFor="firstPurchaseBonus">Puntos extra</Label>
                <Input
                  id="firstPurchaseBonus"
                  type="number"
                  min="0"
                  value={loyaltyBonus?.firstPurchaseBonus || 0}
                  onChange={(e) => updateBonus({ firstPurchaseBonus: Number(e.target.value) })}
                  className="mt-1"
                />
              </div>
            </div>

            <div className="p-4 border rounded-lg space-y-3">
              <div className="flex items-center gap-2">
                <Badge variant="secondary" className="text-xs">Por volumen</Badge>
              </div>
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <Label htmlFor="minQuantity" className="text-xs">Min. cantidad</Label>
                  <Input
                    id="minQuantity"
                    type="number"
                    min="1"
                    value={loyaltyBonus?.volumeBonus.minQuantity || 5}
                    onChange={(e) => updateBonus({
                      volumeBonus: {
                        ...loyaltyBonus?.volumeBonus,
                        minQuantity: Number(e.target.value),
                        bonusPoints: loyaltyBonus?.volumeBonus.bonusPoints || 10
                      }
                    })}
                    className="mt-1"
                  />
                </div>
                <div>
                  <Label htmlFor="bonusPoints" className="text-xs">Puntos extra</Label>
                  <Input
                    id="bonusPoints"
                    type="number"
                    min="0"
                    value={loyaltyBonus?.volumeBonus.bonusPoints || 10}
                    onChange={(e) => updateBonus({
                      volumeBonus: {
                        minQuantity: loyaltyBonus?.volumeBonus.minQuantity || 5,
                        bonusPoints: Number(e.target.value)
                      }
                    })}
                    className="mt-1"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Resumen */}
        <div className="p-4 bg-gray-50 rounded-lg">
          <h4 className="font-medium mb-2">Resumen de puntos</h4>
          <div className="space-y-1 text-sm">
            <div className="flex justify-between">
              <span>Puntos base:</span>
              <span className="font-medium">{loyaltyPoints}</span>
            </div>
            {loyaltyPromotion?.isActive && (
              <div className="flex justify-between text-purple-600">
                <span>Con multiplicador ({loyaltyPromotion.multiplier}x):</span>
                <span className="font-medium">{Math.floor(loyaltyPoints * loyaltyPromotion.multiplier)}</span>
              </div>
            )}
            {(loyaltyBonus?.firstPurchaseBonus || 0) > 0 && (
              <div className="flex justify-between text-green-600">
                <span>Bonus primera compra:</span>
                <span className="font-medium">+{loyaltyBonus.firstPurchaseBonus}</span>
              </div>
            )}
            {(loyaltyBonus?.volumeBonus.bonusPoints || 0) > 0 && (
              <div className="flex justify-between text-blue-600">
                <span>Bonus volumen ({loyaltyBonus.volumeBonus.minQuantity}+ unidades):</span>
                <span className="font-medium">+{loyaltyBonus.volumeBonus.bonusPoints}</span>
              </div>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}