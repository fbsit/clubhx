
import { FC, useState } from "react";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { ChevronRight, Truck, MapPin } from "lucide-react";

type DeliveryMethodStepProps = {
  onNext: () => void;
  onPrev: () => void;
};

const DeliveryMethodStep: FC<DeliveryMethodStepProps> = ({ 
  onNext, 
  onPrev 
}) => {
  const [useCustomAddress, setUseCustomAddress] = useState(false);
  const [customAddress, setCustomAddress] = useState({
    street: "",
    city: "",
    region: "",
    notes: ""
  });

  const handleAddressChange = (field: string, value: string) => {
    setCustomAddress(prev => ({
      ...prev,
      [field]: value
    }));
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-xl">Opciones de entrega</CardTitle>
        <CardDescription>
          Elige cómo quieres recibir tus productos
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex items-start space-x-3 p-4 rounded-lg border-2 border-primary bg-primary/5">
          <div className="flex-1">
            <div className="flex items-center">
              <Truck className="h-5 w-5 mr-2" />
              <span className="font-medium">Despacho a domicilio</span>
              <span className="ml-auto text-sm font-medium text-green-600">
                ${useCustomAddress ? "8.500" : "5.500"}
              </span>
            </div>
            <p className="text-sm text-muted-foreground mt-1 ml-7">
              Recibirás tus productos en la dirección seleccionada.
            </p>
            
            <div className="mt-4 ml-7 space-y-4">
              <div className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  id="custom-address"
                  checked={useCustomAddress}
                  onChange={(e) => setUseCustomAddress(e.target.checked)}
                  className="rounded border-gray-300"
                />
                <Label htmlFor="custom-address" className="text-sm cursor-pointer">
                  Usar una dirección diferente
                </Label>
              </div>

              {!useCustomAddress ? (
                <div className="text-sm bg-muted/40 p-3 rounded">
                  <p className="flex items-center font-medium mb-1">
                    <MapPin className="h-4 w-4 mr-1" />
                    Dirección registrada:
                  </p>
                  <p>Av. Providencia 1234, Oficina 456</p>
                  <p>Providencia, Santiago</p>
                  <p>Región Metropolitana</p>
                </div>
              ) : (
                <div className="space-y-3 bg-muted/20 p-4 rounded-lg">
                  <p className="text-sm font-medium flex items-center">
                    <MapPin className="h-4 w-4 mr-1" />
                    Nueva dirección de entrega:
                  </p>
                  <div className="space-y-3">
                    <div>
                      <Label htmlFor="street" className="text-xs text-muted-foreground">
                        Dirección *
                      </Label>
                      <Input
                        id="street"
                        placeholder="Av. Las Condes 123, Oficina 456"
                        value={customAddress.street}
                        onChange={(e) => handleAddressChange("street", e.target.value)}
                        className="mt-1"
                      />
                    </div>
                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <Label htmlFor="city" className="text-xs text-muted-foreground">
                          Comuna *
                        </Label>
                        <Input
                          id="city"
                          placeholder="Las Condes"
                          value={customAddress.city}
                          onChange={(e) => handleAddressChange("city", e.target.value)}
                          className="mt-1"
                        />
                      </div>
                      <div>
                        <Label htmlFor="region" className="text-xs text-muted-foreground">
                          Región *
                        </Label>
                        <Input
                          id="region"
                          placeholder="Región Metropolitana"
                          value={customAddress.region}
                          onChange={(e) => handleAddressChange("region", e.target.value)}
                          className="mt-1"
                        />
                      </div>
                    </div>
                    <div>
                      <Label htmlFor="notes" className="text-xs text-muted-foreground">
                        Instrucciones adicionales (opcional)
                      </Label>
                      <Textarea
                        id="notes"
                        placeholder="Ej: Departamento 3B, Tocar timbre, etc."
                        value={customAddress.notes}
                        onChange={(e) => handleAddressChange("notes", e.target.value)}
                        className="mt-1 resize-none"
                        rows={2}
                      />
                    </div>
                  </div>
                  <p className="text-xs text-amber-600 bg-amber-50 p-2 rounded">
                    ⚠️ Despacho a dirección personalizada: $8.500 (costo adicional por ubicación)
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      </CardContent>
      <CardFooter className="flex justify-between">
        <Button variant="outline" onClick={onPrev}>
          Atrás
        </Button>
        <Button 
          onClick={onNext} 
          className="flex items-center"
          disabled={useCustomAddress && (!customAddress.street || !customAddress.city || !customAddress.region)}
        >
          Continuar <ChevronRight className="ml-1 h-4 w-4" />
        </Button>
      </CardFooter>
    </Card>
  );
};

export default DeliveryMethodStep;
