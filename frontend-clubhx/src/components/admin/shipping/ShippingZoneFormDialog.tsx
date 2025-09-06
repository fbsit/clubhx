import { useState, useEffect } from "react";
import { Plus, X, MapPin, Truck, DollarSign, Clock } from "lucide-react";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { ShippingZone, Location, ShippingRule } from "@/types/shipping";
const mockLocations: any[] = [];
const mockCouriers: any[] = [];
import { toast } from "sonner";

interface ShippingZoneFormDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSubmit: (zoneData: Partial<ShippingZone>) => void;
  zone: ShippingZone | null;
}

export default function ShippingZoneFormDialog({
  open,
  onOpenChange,
  onSubmit,
  zone
}: ShippingZoneFormDialogProps) {
  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    locations: [] as Location[],
    rules: [] as ShippingRule[]
  });
  const [newRule, setNewRule] = useState<{
    type: "fixed" | "free_threshold";
    value: string;
    threshold: string;
    courierIds: string[];
    minDays: string;
    maxDays: string;
  }>({
    type: "fixed",
    value: "",
    threshold: "",
    courierIds: [],
    minDays: "",
    maxDays: ""
  });

  useEffect(() => {
    if (zone) {
      setFormData({
        name: zone.name,
        description: zone.description || "",
        locations: zone.locations,
        rules: zone.rules
      });
    } else {
      setFormData({
        name: "",
        description: "",
        locations: [],
        rules: []
      });
    }
    setCurrentStep(1);
  }, [zone, open]);

  const handleLocationToggle = (location: Location) => {
    setFormData(prev => ({
      ...prev,
      locations: prev.locations.some(l => l.id === location.id)
        ? prev.locations.filter(l => l.id !== location.id)
        : [...prev.locations, location]
    }));
  };

  const handleAddRule = () => {
    if (!newRule.courierIds.length || !newRule.value || !newRule.minDays || !newRule.maxDays) {
      toast.error("Completa todos los campos de la regla");
      return;
    }

    // Crear una regla por cada courier seleccionado
    const newRules: ShippingRule[] = newRule.courierIds.map(courierId => ({
      id: `rule-${Date.now()}-${courierId}`,
      type: newRule.type,
      value: parseInt(newRule.value),
      threshold: newRule.threshold ? parseInt(newRule.threshold) : undefined,
      courierId: courierId,
      estimatedDays: {
        min: parseInt(newRule.minDays),
        max: parseInt(newRule.maxDays)
      }
    }));

    setFormData(prev => ({
      ...prev,
      rules: [...prev.rules, ...newRules]
    }));

    setNewRule({
      type: "fixed",
      value: "",
      threshold: "",
      courierIds: [],
      minDays: "",
      maxDays: ""
    });
  };

  const handleRemoveRule = (ruleId: string) => {
    setFormData(prev => ({
      ...prev,
      rules: prev.rules.filter(r => r.id !== ruleId)
    }));
  };

  const handleSubmit = () => {
    if (!formData.name.trim()) {
      toast.error("El nombre de la zona es obligatorio");
      return;
    }

    if (formData.locations.length === 0) {
      toast.error("Debes seleccionar al menos una ubicación");
      return;
    }

    if (formData.rules.length === 0) {
      toast.error("Debes agregar al menos una regla de envío");
      return;
    }

    onSubmit(formData);
    onOpenChange(false);
    toast.success(zone ? "Zona actualizada exitosamente" : "Zona creada exitosamente");
  };

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('es-CL', {
      style: 'currency',
      currency: 'CLP',
      minimumFractionDigits: 0
    }).format(price);
  };

  const getCourierName = (courierId: string) => {
    return mockCouriers.find(c => c.id === courierId)?.name || courierId;
  };

  const renderStepContent = () => {
    switch (currentStep) {
      case 1:
        return (
          <div className="space-y-4">
            <div>
              <Label htmlFor="name">Nombre de la zona *</Label>
              <Input
                id="name"
                value={formData.name}
                onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                placeholder="Ej: Zona Central, Zona Norte..."
                className="mt-1"
              />
            </div>
            <div>
              <Label htmlFor="description">Descripción (opcional)</Label>
              <Textarea
                id="description"
                value={formData.description}
                onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                placeholder="Descripción breve de la zona de envío"
                className="mt-1 resize-none"
                rows={3}
              />
            </div>
          </div>
        );

      case 2:
        return (
          <div className="space-y-4">
            <div>
              <Label className="text-sm font-medium">Selecciona las ubicaciones *</Label>
              <p className="text-xs text-muted-foreground mt-1">
                Elige las regiones que pertenecen a esta zona de envío
              </p>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 max-h-60 overflow-y-auto">
              {mockLocations.map((location) => (
                <div
                  key={location.id}
                  className={`p-3 rounded-lg border cursor-pointer transition-colors ${
                    formData.locations.some(l => l.id === location.id)
                      ? "border-primary bg-primary/5"
                      : "border-border hover:border-primary/50"
                  }`}
                  onClick={() => handleLocationToggle(location)}
                >
                  <div className="flex items-center gap-2">
                    <MapPin className="h-4 w-4" />
                    <span className="text-sm">{location.name}</span>
                  </div>
                </div>
              ))}
            </div>
            {formData.locations.length > 0 && (
              <div className="space-y-2">
                <Label className="text-sm font-medium">Ubicaciones seleccionadas:</Label>
                <div className="flex flex-wrap gap-1">
                  {formData.locations.map((location) => (
                    <Badge key={location.id} variant="secondary" className="text-xs">
                      {location.name}
                    </Badge>
                  ))}
                </div>
              </div>
            )}
          </div>
        );

      case 3:
        return (
          <div className="space-y-6">
            <div>
              <Label className="text-sm font-medium">Reglas de envío *</Label>
              <p className="text-xs text-muted-foreground mt-1">
                Configura los precios y tiempos de entrega por courier
              </p>
            </div>

            {/* Reglas existentes */}
            {formData.rules.length > 0 && (
              <div className="space-y-2">
                <Label className="text-xs font-medium text-muted-foreground">Reglas configuradas:</Label>
                {formData.rules.map((rule) => (
                  <Card key={rule.id} className="p-3">
                    <div className="flex items-center justify-between">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 text-sm">
                          <Truck className="h-4 w-4" />
                          <span className="font-medium">{getCourierName(rule.courierId)}</span>
                          <Badge variant="outline" className="text-xs">
                            {rule.type === 'fixed' ? 'Precio fijo' : 
                             rule.type === 'free_threshold' ? 'Envío gratis' : rule.type}
                          </Badge>
                        </div>
                        <div className="flex items-center gap-4 mt-1 text-xs text-muted-foreground">
                          <span className="flex items-center gap-1">
                            <DollarSign className="h-3 w-3" />
                            {rule.type === 'free_threshold' 
                              ? `Gratis sobre ${formatPrice(rule.threshold!)}`
                              : formatPrice(rule.value)
                            }
                          </span>
                          <span className="flex items-center gap-1">
                            <Clock className="h-3 w-3" />
                            {rule.estimatedDays.min}-{rule.estimatedDays.max} días
                          </span>
                        </div>
                      </div>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleRemoveRule(rule.id)}
                      >
                        <X className="h-4 w-4" />
                      </Button>
                    </div>
                  </Card>
                ))}
              </div>
            )}

            {/* Formulario para nueva regla */}
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-sm">Agregar nueva regla</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 gap-3">
                  <div>
                    <Label htmlFor="courier" className="text-xs">Couriers * (selecciona uno o varios)</Label>
                    <div className="mt-1 border rounded-md p-2 max-h-32 overflow-y-auto space-y-2">
                      {mockCouriers.filter(c => c.active).map((courier) => (
                        <div key={courier.id} className="flex items-center space-x-2">
                          <input
                            type="checkbox"
                            id={`courier-${courier.id}`}
                            checked={newRule.courierIds.includes(courier.id)}
                            onChange={(e) => {
                              if (e.target.checked) {
                                setNewRule(prev => ({ 
                                  ...prev, 
                                  courierIds: [...prev.courierIds, courier.id] 
                                }));
                              } else {
                                setNewRule(prev => ({ 
                                  ...prev, 
                                  courierIds: prev.courierIds.filter(id => id !== courier.id) 
                                }));
                              }
                            }}
                            className="rounded border-gray-300"
                          />
                          <Label 
                            htmlFor={`courier-${courier.id}`} 
                            className="text-sm cursor-pointer flex-1"
                          >
                            {courier.name}
                          </Label>
                        </div>
                      ))}
                    </div>
                    {newRule.courierIds.length > 0 && (
                      <div className="mt-2 flex flex-wrap gap-1">
                        {newRule.courierIds.map(courierId => (
                          <Badge key={courierId} variant="secondary" className="text-xs">
                            {getCourierName(courierId)}
                          </Badge>
                        ))}
                      </div>
                    )}
                  </div>
                </div>

                <div>
                  <Label htmlFor="rule-type" className="text-xs">Tipo de regla *</Label>
                  <Select value={newRule.type} onValueChange={(value: "fixed" | "free_threshold") => setNewRule(prev => ({ ...prev, type: value }))}>
                    <SelectTrigger className="mt-1">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="fixed">Precio fijo</SelectItem>
                      <SelectItem value="free_threshold">Envío gratis sobre monto</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <Label htmlFor="value" className="text-xs">
                      {newRule.type === 'free_threshold' ? 'Monto mínimo (CLP) *' : 'Precio (CLP) *'}
                    </Label>
                    <Input
                      id={newRule.type === 'free_threshold' ? 'threshold' : 'value'}
                      type="number"
                      value={newRule.type === 'free_threshold' ? newRule.threshold : newRule.value}
                      onChange={(e) => {
                        const field = newRule.type === 'free_threshold' ? 'threshold' : 'value';
                        setNewRule(prev => ({ ...prev, [field]: e.target.value }));
                      }}
                      placeholder={newRule.type === 'free_threshold' ? '80000' : '5500'}
                      className="mt-1"
                    />
                  </div>
                  {newRule.type === 'free_threshold' && (
                    <div>
                      <Label htmlFor="free-value" className="text-xs">Costo envío gratis (CLP) *</Label>
                      <Input
                        id="free-value"
                        type="number"
                        value={newRule.value}
                        onChange={(e) => setNewRule(prev => ({ ...prev, value: e.target.value }))}
                        placeholder="0"
                        className="mt-1"
                      />
                    </div>
                  )}
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <Label htmlFor="min-days" className="text-xs">Días mínimos *</Label>
                    <Input
                      id="min-days"
                      type="number"
                      value={newRule.minDays}
                      onChange={(e) => setNewRule(prev => ({ ...prev, minDays: e.target.value }))}
                      placeholder="1"
                      className="mt-1"
                    />
                  </div>
                  <div>
                    <Label htmlFor="max-days" className="text-xs">Días máximos *</Label>
                    <Input
                      id="max-days"
                      type="number"
                      value={newRule.maxDays}
                      onChange={(e) => setNewRule(prev => ({ ...prev, maxDays: e.target.value }))}
                      placeholder="3"
                      className="mt-1"
                    />
                  </div>
                </div>

                <Button
                  onClick={handleAddRule}
                  variant="outline"
                  size="sm"
                  className="w-full"
                >
                  <Plus className="h-4 w-4 mr-2" />
                  Agregar regla
                </Button>
              </CardContent>
            </Card>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>
            {zone ? "Editar zona de envío" : "Nueva zona de envío"}
          </DialogTitle>
          <DialogDescription>
            Paso {currentStep} de 3: {
              currentStep === 1 ? "Información básica" :
              currentStep === 2 ? "Seleccionar ubicaciones" :
              "Configurar reglas de envío"
            }
          </DialogDescription>
        </DialogHeader>

        {/* Progress indicator */}
        <div className="flex items-center gap-2 my-4">
          {[1, 2, 3].map((step) => (
            <div key={step} className="flex items-center">
              <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${
                step <= currentStep 
                  ? "bg-primary text-primary-foreground" 
                  : "bg-muted text-muted-foreground"
              }`}>
                {step}
              </div>
              {step < 3 && (
                <div className={`w-12 h-0.5 mx-2 ${
                  step < currentStep ? "bg-primary" : "bg-muted"
                }`} />
              )}
            </div>
          ))}
        </div>

        <Separator />

        <div className="py-4">
          {renderStepContent()}
        </div>

        <DialogFooter className="flex justify-between">
          <div className="flex gap-2">
            {currentStep > 1 && (
              <Button
                variant="outline"
                onClick={() => setCurrentStep(prev => prev - 1)}
              >
                Anterior
              </Button>
            )}
          </div>
          <div className="flex gap-2">
            <Button
              variant="outline"
              onClick={() => onOpenChange(false)}
            >
              Cancelar
            </Button>
            {currentStep < 3 ? (
              <Button
                onClick={() => setCurrentStep(prev => prev + 1)}
                disabled={
                  (currentStep === 1 && !formData.name.trim()) ||
                  (currentStep === 2 && formData.locations.length === 0)
                }
              >
                Siguiente
              </Button>
            ) : (
              <Button
                onClick={handleSubmit}
                disabled={formData.rules.length === 0}
              >
                {zone ? "Actualizar zona" : "Crear zona"}
              </Button>
            )}
          </div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}