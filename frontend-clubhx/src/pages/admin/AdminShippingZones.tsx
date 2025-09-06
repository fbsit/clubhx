import { useEffect, useState } from "react";
import { Plus, Truck, MapPin, Clock, DollarSign } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useIsMobile } from "@/hooks/use-mobile";
const mockShippingZones: any[] = [];
const mockCouriers: any[] = [];
import { ShippingZone } from "@/types/shipping";
import ShippingZoneFormDialog from "@/components/admin/shipping/ShippingZoneFormDialog";
import { createShippingZone, listShippingZones, toggleShippingZone, updateShippingZone } from "@/services/shippingZonesApi";

export default function AdminShippingZones() {
  const [zones, setZones] = useState<ShippingZone[]>(mockShippingZones);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showCreateDialog, setShowCreateDialog] = useState(false);
  const [editingZone, setEditingZone] = useState<ShippingZone | null>(null);
  const isMobile = useIsMobile();

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

  const getMinPrice = (zone: ShippingZone) => {
    const prices = zone.rules
      .filter(rule => rule.type === 'fixed')
      .map(rule => rule.value);
    return prices.length > 0 ? Math.min(...prices) : 0;
  };

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        setLoading(true);
        setError(null);
        const data = await listShippingZones();
        if (!cancelled) setZones(data as unknown as ShippingZone[]);
      } catch (e: any) {
        if (!cancelled) setError(e?.message || "Error cargando zonas de envío");
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();
    return () => { cancelled = true; };
  }, []);

  const handleCreateZone = async (zoneData: Partial<ShippingZone>) => {
    const created = await createShippingZone(zoneData as any);
    setZones(prev => [...prev, created as unknown as ShippingZone]);
    setShowCreateDialog(false);
  };

  const handleEditZone = (zone: ShippingZone) => {
    setEditingZone(zone);
  };

  const handleUpdateZone = async (zoneData: Partial<ShippingZone>) => {
    if (!editingZone) return;
    const updated = await updateShippingZone(editingZone.id, zoneData as any);
    setZones(prev => prev.map(zone => zone.id === editingZone.id ? (updated as unknown as ShippingZone) : zone));
    setEditingZone(null);
  };

  const handleToggleZone = async (zoneId: string) => {
    const target = zones.find(z => z.id === zoneId);
    if (!target) return;
    const updated = await toggleShippingZone(zoneId, !target.active);
    setZones(prev => prev.map(z => z.id === zoneId ? (updated as unknown as ShippingZone) : z));
  };

  if (isMobile) {
    return (
      <div className="p-4 space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-xl font-bold">Zonas de Envío</h1>
            <p className="text-sm text-muted-foreground">Gestiona las zonas y precios de envío</p>
          </div>
          {loading && <div className="text-xs text-muted-foreground">Cargando…</div>}
          <Button
            onClick={() => setShowCreateDialog(true)}
            size="sm"
            className="shrink-0"
          >
            <Plus className="h-4 w-4 mr-1" />
            Nueva
          </Button>
        </div>

        {error && <div className="text-xs text-red-600">{error}</div>}
        <div className="space-y-3">
          {zones.map((zone) => (
            <Card key={zone.id} className="cursor-pointer hover:shadow-md transition-shadow">
              <CardHeader className="pb-3">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <CardTitle className="text-base flex items-center gap-2">
                      <MapPin className="h-4 w-4" />
                      {zone.name}
                      <Badge variant={zone.active ? "default" : "secondary"} className="text-xs">
                        {zone.active ? "Activa" : "Inactiva"}
                      </Badge>
                    </CardTitle>
                    <CardDescription className="text-xs">
                      {zone.locations.length} ubicaciones • {zone.rules.length} reglas
                    </CardDescription>
                  </div>
                </div>
              </CardHeader>
              
              <CardContent className="pt-0 space-y-2">
                <div className="flex items-center gap-2 text-sm">
                  <DollarSign className="h-3 w-3 text-green-600" />
                  <span>Desde {formatPrice(getMinPrice(zone))}</span>
                </div>
                
                <div className="flex flex-wrap gap-1">
                  {zone.locations.slice(0, 2).map((location) => (
                    <Badge key={location.id} variant="outline" className="text-xs">
                      {location.name}
                    </Badge>
                  ))}
                  {zone.locations.length > 2 && (
                    <Badge variant="outline" className="text-xs">
                      +{zone.locations.length - 2} más
                    </Badge>
                  )}
                </div>
              </CardContent>

              <CardFooter className="pt-0">
                <div className="flex gap-2 w-full">
                  <Button
                    variant="outline"
                    size="sm"
                    className="flex-1"
                    onClick={() => handleEditZone(zone)}
                  >
                    Editar
                  </Button>
                  <Button
                    variant={zone.active ? "secondary" : "default"}
                    size="sm"
                    className="flex-1"
                    onClick={() => handleToggleZone(zone.id)}
                  >
                    {zone.active ? "Desactivar" : "Activar"}
                  </Button>
                </div>
              </CardFooter>
            </Card>
          ))}
        </div>

        <ShippingZoneFormDialog
          open={showCreateDialog}
          onOpenChange={setShowCreateDialog}
          onSubmit={handleCreateZone}
          zone={null}
        />

        <ShippingZoneFormDialog
          open={!!editingZone}
          onOpenChange={(open) => !open && setEditingZone(null)}
          onSubmit={handleUpdateZone}
          zone={editingZone}
        />
      </div>
    );
  }

  return (
    <div className="container max-w-7xl py-6 sm:py-8 animate-enter px-3 sm:px-6">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold">Zonas de Envío</h1>
          <p className="text-muted-foreground mt-1">
            Configura las zonas geográficas y sus precios de envío
          </p>
        </div>
        <Button onClick={() => setShowCreateDialog(true)}>
          <Plus className="h-4 w-4 mr-2" />
          Nueva Zona
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {zones.map((zone) => (
          <Card key={zone.id} className="hover:shadow-md transition-shadow">
            <CardHeader>
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <CardTitle className="flex items-center gap-2">
                    <Truck className="h-5 w-5" />
                    {zone.name}
                  </CardTitle>
                  <CardDescription className="mt-1">
                    {zone.description}
                  </CardDescription>
                </div>
                <Badge variant={zone.active ? "default" : "secondary"}>
                  {zone.active ? "Activa" : "Inactiva"}
                </Badge>
              </div>
            </CardHeader>
            
            <CardContent className="space-y-4">
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <MapPin className="h-4 w-4" />
                <span>{zone.locations.length} ubicaciones</span>
              </div>

              <div className="space-y-2">
                <div className="flex items-center gap-2 text-sm">
                  <DollarSign className="h-4 w-4 text-green-600" />
                  <span className="font-medium">Desde {formatPrice(getMinPrice(zone))}</span>
                </div>
                
                <div className="text-xs text-muted-foreground">
                  {zone.rules.length} regla{zone.rules.length !== 1 ? 's' : ''} configurada{zone.rules.length !== 1 ? 's' : ''}
                </div>
              </div>

              <div className="space-y-1">
                <div className="text-xs font-medium text-muted-foreground">Ubicaciones:</div>
                <div className="flex flex-wrap gap-1">
                  {zone.locations.slice(0, 3).map((location) => (
                    <Badge key={location.id} variant="outline" className="text-xs">
                      {location.name}
                    </Badge>
                  ))}
                  {zone.locations.length > 3 && (
                    <Badge variant="outline" className="text-xs">
                      +{zone.locations.length - 3} más
                    </Badge>
                  )}
                </div>
              </div>

              <div className="space-y-1">
                <div className="text-xs font-medium text-muted-foreground">Couriers:</div>
                <div className="flex flex-wrap gap-1">
                  {Array.from(new Set(zone.rules.map(rule => rule.courierId)))
                    .slice(0, 2)
                    .map((courierId) => (
                    <Badge key={courierId} variant="secondary" className="text-xs">
                      {getCourierName(courierId)}
                    </Badge>
                  ))}
                </div>
              </div>
            </CardContent>

            <CardFooter className="flex gap-2">
              <Button
                variant="outline"
                size="sm"
                className="flex-1"
                onClick={() => handleEditZone(zone)}
              >
                Editar
              </Button>
              <Button
                variant={zone.active ? "secondary" : "default"}
                size="sm"
                className="flex-1"
                onClick={() => handleToggleZone(zone.id)}
              >
                {zone.active ? "Desactivar" : "Activar"}
              </Button>
            </CardFooter>
          </Card>
        ))}
      </div>

      <ShippingZoneFormDialog
        open={showCreateDialog}
        onOpenChange={setShowCreateDialog}
        onSubmit={handleCreateZone}
        zone={null}
      />

      <ShippingZoneFormDialog
        open={!!editingZone}
        onOpenChange={(open) => !open && setEditingZone(null)}
        onSubmit={handleUpdateZone}
        zone={editingZone}
      />
    </div>
  );
}