
import { FC, useEffect, useMemo, useState } from "react";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { ChevronRight, Truck, MapPin } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { AddressPayload, createAddress, listAddresses } from "@/services/addressesApi";
import { listPaymentMethods, listShippingTypes, type PaymentMethodDto, type ShippingTypeDto } from "@/services/ordersApi";

type DeliveryMethodStepProps = {
  onNext: () => void;
  onPrev: () => void;
  onAddressSelected: (address: AddressPayload) => void;
  onShippingTypeSelected: (shippingTypeId: string) => void;
};

const DeliveryMethodStep: FC<DeliveryMethodStepProps> = ({ 
  onNext, 
  onPrev,
  onAddressSelected,
  onShippingTypeSelected,
}) => {
  const { user } = useAuth();
  const [shippingTypes, setShippingTypes] = useState<ShippingTypeDto[]>([]);
  const [selectedShippingTypeId, setSelectedShippingTypeId] = useState<string | null>(null);
  const [paymentMethods, setPaymentMethods] = useState<PaymentMethodDto[]>([]);
  const [selectedPaymentMethodId, setSelectedPaymentMethodId] = useState<string | null>(null);
  const [useCustomAddress, setUseCustomAddress] = useState(true);
  const [customAddress, setCustomAddress] = useState({
    name: "Entrega",
    phone: "",
    street: "",
    number: "",
    apartment: "",
    city: "",
    commune: "",
    region: "",
    notes: ""
  });
  const [addresses, setAddresses] = useState<AddressPayload[]>([]);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const hasAddresses = addresses.length > 0;

  useEffect(() => {
    const load = async () => {
      if (!user?.providerClientPk && !user?.id) return;
      setIsLoading(true);
      setError(null);
      try {
        const cid = String(user.providerClientPk || user.id);
        const list = (await listAddresses(cid)) as AddressPayload[];
        const safeList: AddressPayload[] = Array.isArray(list) ? list : [];
        setAddresses(safeList);
        const def = (safeList).find((a: AddressPayload) => a.isDefault) || (safeList)[0] || null;
        setSelectedId(def?.id || null);
        setUseCustomAddress(!(safeList && safeList.length > 0));

        // Load shipping types
        const st = await listShippingTypes();
        setShippingTypes(st || []);
        const defShippingTypeId = (st && st[0]?.id) || null;
        setSelectedShippingTypeId(defShippingTypeId);
        if (defShippingTypeId) onShippingTypeSelected(defShippingTypeId);

        // Load payment methods
        const pm = await listPaymentMethods();
        setPaymentMethods(pm || []);
        const defPaymentMethodId = (pm && pm[0]?.id) || null;
        setSelectedPaymentMethodId(defPaymentMethodId);
      } catch (e) {
        setError("No se pudieron cargar las direcciones");
      } finally {
        setIsLoading(false);
      }
    };
    load();
  }, [user?.providerClientPk, user?.id]);

  const selectedAddress = useMemo(() => addresses.find(a => a.id === selectedId) || null, [addresses, selectedId]);

  const handleAddressChange = (field: string, value: string) => {
    setCustomAddress(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleContinue = async () => {
    if (!user) return;
    const customerId = String(user.providerClientPk || user.id);
    if (useCustomAddress) {
      if (!customAddress.street || !customAddress.city || !customAddress.region) return;
      setIsLoading(true);
      try {
        const created = (await createAddress({
          customerId,
          name: customAddress.name || "Entrega",
          phone: customAddress.phone,
          street: customAddress.street,
          number: customAddress.number,
          apartment: customAddress.apartment,
          city: customAddress.city,
          commune: customAddress.commune,
          region: customAddress.region,
          isDefault: false,
        })) as AddressPayload;
        // Marcar como seleccionada para continuar
        setSelectedId(created.id!);
        setAddresses((prev: AddressPayload[]) => [created, ...(prev || [])]);
        onAddressSelected(created as AddressPayload);
        onNext();
      } finally {
        setIsLoading(false);
      }
    } else {
      if (selectedAddress) {
        onAddressSelected(selectedAddress);
        onNext();
      }
    }
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
        <div className="space-y-2">
          <Label className="text-sm">Tipo de envío</Label>
          {!Array.isArray(shippingTypes) || shippingTypes.length === 0 ? (
            <p className="text-sm text-muted-foreground">Cargando tipos de envío…</p>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              {Array.isArray(shippingTypes) && shippingTypes.map((st) => (
                <label key={st.id} className={`flex items-center gap-2 p-3 rounded border cursor-pointer ${selectedShippingTypeId === st.id ? 'border-primary' : ''}`}>
                  <input
                    type="radio"
                    name="shippingType"
                    checked={selectedShippingTypeId === st.id}
                    onChange={() => { setSelectedShippingTypeId(st.id); onShippingTypeSelected(st.id); }}
                  />
                  <div>
                    <p className="font-medium text-sm">{st.name}</p>
                    {st.description && <p className="text-xs text-muted-foreground">{st.description}</p>}
                  </div>
                </label>
              ))}
            </div>
          )}
        </div>

        <div className="space-y-2">
          <Label className="text-sm">Método de pago</Label>
          {!Array.isArray(paymentMethods) || paymentMethods.length === 0 ? (
            <p className="text-sm text-muted-foreground">Cargando métodos de pago…</p>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              {Array.isArray(paymentMethods) && paymentMethods.map((pm) => (
                <label key={pm.id} className={`flex items-center gap-2 p-3 rounded border cursor-pointer ${selectedPaymentMethodId === pm.id ? 'border-primary' : ''}`}>
                  <input
                    type="radio"
                    name="paymentMethod"
                    checked={selectedPaymentMethodId === pm.id}
                    onChange={() => setSelectedPaymentMethodId(pm.id)}
                  />
                  <div>
                    <p className="font-medium text-sm">{pm.name}</p>
                    {pm.description && <p className="text-xs text-muted-foreground">{pm.description}</p>}
                  </div>
                </label>
              ))}
            </div>
          )}
        </div>
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
              {hasAddresses && (
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
              )}

              {!useCustomAddress ? (
                <div className="text-sm bg-muted/40 p-3 rounded space-y-2">
                  <p className="flex items-center font-medium mb-1">
                    <MapPin className="h-4 w-4 mr-1" />
                    Dirección registrada:
                  </p>
                  {error && <p className="text-amber-700">{error}</p>}
                  {!error && isLoading && <p>Cargando direcciones…</p>}
                  {!error && !isLoading && addresses.length > 0 && (
                    <div className="space-y-2">
                      {addresses.map(addr => (
                        <label key={addr.id} className="flex items-start gap-2 p-2 rounded border cursor-pointer">
                          <input
                            type="radio"
                            name="addr"
                            checked={selectedId === addr.id}
                            onChange={() => setSelectedId(addr.id!)}
                            className="mt-1"
                          />
                          <div>
                            <p className="font-medium">{addr.name || 'Dirección'}</p>
                            <p>{addr.street}{addr.number ? `, ${addr.number}` : ''}{addr.apartment ? `, ${addr.apartment}` : ''}</p>
                            <p>{addr.commune}{addr.city ? `, ${addr.city}` : ''}</p>
                            <p>{addr.region}</p>
                          </div>
                        </label>
                      ))}
                    </div>
                  )}
                </div>
              ) : (
                <div className="space-y-3 bg-muted/20 p-4 rounded-lg">
                  <p className="text-sm font-medium flex items-center">
                    <MapPin className="h-4 w-4 mr-1" />
                    Nueva dirección de entrega:
                  </p>
                  <div className="space-y-3">
                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <Label htmlFor="name" className="text-xs text-muted-foreground">
                          Nombre para esta dirección
                        </Label>
                        <Input
                          id="name"
                          placeholder="Casa, Oficina, etc."
                          value={customAddress.name}
                          onChange={(e) => handleAddressChange("name", e.target.value)}
                          className="mt-1"
                        />
                      </div>
                      <div>
                        <Label htmlFor="phone" className="text-xs text-muted-foreground">
                          Teléfono de contacto
                        </Label>
                        <Input
                          id="phone"
                          placeholder="+56 9 1234 5678"
                          value={customAddress.phone}
                          onChange={(e) => handleAddressChange("phone", e.target.value)}
                          className="mt-1"
                        />
                      </div>
                    </div>
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
                        <Label htmlFor="number" className="text-xs text-muted-foreground">
                          Número
                        </Label>
                        <Input
                          id="number"
                          placeholder="1234"
                          value={customAddress.number}
                          onChange={(e) => handleAddressChange("number", e.target.value)}
                          className="mt-1"
                        />
                      </div>
                      <div>
                        <Label htmlFor="apartment" className="text-xs text-muted-foreground">
                          Depto./Oficina
                        </Label>
                        <Input
                          id="apartment"
                          placeholder="Oficina 456"
                          value={customAddress.apartment}
                          onChange={(e) => handleAddressChange("apartment", e.target.value)}
                          className="mt-1"
                        />
                      </div>
                    </div>
                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <Label htmlFor="commune" className="text-xs text-muted-foreground">
                          Comuna *
                        </Label>
                        <Input
                          id="commune"
                          placeholder="Las Condes"
                          value={customAddress.commune}
                          onChange={(e) => handleAddressChange("commune", e.target.value)}
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
                      <Label htmlFor="city" className="text-xs text-muted-foreground">
                        Ciudad
                      </Label>
                      <Input
                        id="city"
                        placeholder="Santiago"
                        value={customAddress.city}
                        onChange={(e) => handleAddressChange("city", e.target.value)}
                        className="mt-1"
                      />
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
          onClick={handleContinue} 
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
