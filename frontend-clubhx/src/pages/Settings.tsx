import { useEffect } from "react";
import { 
  Bell, 
  User, 
  Lock, 
  Globe, 
  CreditCard, 
  Mail, 
  Printer, 
  Sun, 
  Moon,
  PaintBucket,
  Star,
  Package
} from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { toast } from "sonner";
import { useAuth } from "@/contexts/AuthContext";
import { useTheme } from "@/components/theme-provider";
import { useUserSettings } from "@/hooks/useUserSettings";

export default function Settings() {
  const { user } = useAuth();
  const { theme, setTheme } = useTheme();
  const { settings, setField, setAll, loading, save } = useUserSettings();
  
  const isClient = user?.role === "client";

  // Metadata for sections
  const configSections = [
    {
      id: "printing",
      icon: Printer,
      label: "Impresión",
      description: "Opciones para impresión de documentos",
      options: [
        { id: "printLogo", label: "Incluir logo en documentos", defaultChecked: true },
        { id: "printColor", label: "Imprimir en color", defaultChecked: true },
        { id: "printHeader", label: "Incluir encabezado", defaultChecked: true },
        { id: "printFooter", label: "Incluir pie de página", defaultChecked: true },
      ]
    },
    {
      id: "language",
      icon: Globe,
      label: "Idioma y región",
      description: "Configura tu idioma y formato regional",
      options: [
        { id: "useSpanish", label: "Usar español (Chile)", defaultChecked: true },
        { id: "use24h", label: "Usar formato 24 horas", defaultChecked: true },
        { id: "useMetric", label: "Usar sistema métrico", defaultChecked: true },
      ]
    },
    {
      id: "privacy",
      icon: Lock,
      label: "Privacidad y seguridad",
      description: "Configura opciones de privacidad y seguridad",
      options: [
        { id: "twoFactor", label: "Autenticación de dos factores", defaultChecked: false },
        { id: "sessionTimeout", label: "Cierre de sesión automático después de 30 minutos", defaultChecked: true },
        { id: "analyticsTracking", label: "Permitir análisis de uso", defaultChecked: true },
      ]
    },
  ];

  // Initialize defaults on first load if not present
  useEffect(() => {
    // Build initial preferences object from sections if keys are missing
    const initial: any = { preferences: {} };

    for (const s of configSections) {
      initial.preferences[s.id] = initial.preferences[s.id] || {};
      for (const o of s.options) {
        const current = (settings as any).preferences?.[s.id]?.[o.id];
        if (current === undefined) {
          initial.preferences[s.id][o.id] = !!o.defaultChecked;
        }
      }
    }

    // Loyalty and catalog defaults (preferences)
    initial.preferences.loyalty = initial.preferences.loyalty || {};
    if ((settings as any).preferences?.loyalty?.reminders === undefined) initial.preferences.loyalty.reminders = true;
    if ((settings as any).preferences?.loyalty?.rewardSuggestions === undefined) initial.preferences.loyalty.rewardSuggestions = true;

    initial.preferences.catalog = initial.preferences.catalog || {};
    if ((settings as any).preferences?.catalog?.recommendations === undefined) initial.preferences.catalog.recommendations = true;
    if ((settings as any).preferences?.catalog?.priceAlerts === undefined) initial.preferences.catalog.priceAlerts = true;
    if ((settings as any).preferences?.catalog?.stockNotifications === undefined) initial.preferences.catalog.stockNotifications = true;

    // Only apply if there is something to set
    if (
      Object.values(initial.preferences).some((v: any) => Object.keys(v || {}).length > 0)
    ) {
      void setAll(initial);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div className="container py-6 animate-enter">
      <div className="flex flex-col space-y-6 max-w-4xl mx-auto">
        <div>
          <h1 className="text-3xl font-bold">Configuración</h1>
          <p className="text-muted-foreground mt-1">
            Gestiona tus preferencias y personaliza tu experiencia
          </p>
        </div>

        <Tabs defaultValue="notifications" className="w-full">
          <TabsList className={`grid mb-6 ${isClient ? 'grid-cols-3' : 'grid-cols-2 sm:grid-cols-4'} gap-1`}>
            <TabsTrigger value="account" className="text-xs sm:text-sm">Mi Cuenta</TabsTrigger>
            <TabsTrigger value="notifications" className="text-xs sm:text-sm">Notificaciones</TabsTrigger>
            <TabsTrigger value="preferences" className="text-xs sm:text-sm">Preferencias</TabsTrigger>
            {!isClient && <TabsTrigger value="billing" className="text-xs sm:text-sm">Facturación</TabsTrigger>}
          </TabsList>
          
          {/* Preferences Tab */}
          <TabsContent value="preferences" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Preferencias</CardTitle>
                <CardDescription>
                  Personaliza tu experiencia en la plataforma
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* Loyalty */}
                <div className="space-y-3">
                  <div className="flex items-center gap-2">
                    <Star className="h-5 w-5 text-muted-foreground" />
                    <h3 className="font-medium">Programa de Lealtad</h3>
                  </div>
                  <div className="grid gap-3">
                    <div className="flex items-center justify-between">
                      <Label htmlFor="loyalty-reminders" className="cursor-pointer">Recordatorios de puntos por expirar</Label>
                      <Switch
                        id="loyalty-reminders"
                        checked={!!(settings as any).preferences?.loyalty?.reminders}
                        onCheckedChange={(v) => setField(['preferences','loyalty','reminders'], v)}
                      />
                    </div>
                    <div className="flex items-center justify-between">
                      <Label htmlFor="reward-suggestions" className="cursor-pointer">Sugerencias de recompensas</Label>
                      <Switch
                        id="reward-suggestions"
                        checked={!!(settings as any).preferences?.loyalty?.rewardSuggestions}
                        onCheckedChange={(v) => setField(['preferences','loyalty','rewardSuggestions'], v)}
                      />
                    </div>
                  </div>
                </div>

                {/* Catalog */}
                <div className="space-y-3">
                  <div className="flex items-center gap-2">
                    <Package className="h-5 w-5 text-muted-foreground" />
                    <h3 className="font-medium">Catálogo de Productos</h3>
                  </div>
                  <div className="grid gap-3">
                    <div className="flex items-center justify-between">
                      <Label htmlFor="product-recommendations" className="cursor-pointer">Recomendaciones personalizadas</Label>
                      <Switch
                        id="product-recommendations"
                        checked={!!(settings as any).preferences?.catalog?.recommendations}
                        onCheckedChange={(v) => setField(['preferences','catalog','recommendations'], v)}
                      />
                    </div>
                    <div className="flex items-center justify-between">
                      <Label htmlFor="price-alerts" className="cursor-pointer">Alertas de precio y promociones</Label>
                      <Switch
                        id="price-alerts"
                        checked={!!(settings as any).preferences?.catalog?.priceAlerts}
                        onCheckedChange={(v) => setField(['preferences','catalog','priceAlerts'], v)}
                      />
                    </div>
                    <div className="flex items-center justify-between">
                      <Label htmlFor="stock-notifications" className="cursor-pointer">Notificaciones de disponibilidad</Label>
                      <Switch
                        id="stock-notifications"
                        checked={!!(settings as any).preferences?.catalog?.stockNotifications}
                        onCheckedChange={(v) => setField(['preferences','catalog','stockNotifications'], v)}
                      />
                    </div>
                  </div>
                </div>

                {/* Mapped sections (printing, language, privacy) */}
                {configSections.map(section => (
                  <div key={section.id} className="space-y-3">
                    <div className="flex items-center gap-2">
                      <section.icon className="h-5 w-5 text-muted-foreground" />
                      <h3 className="font-medium">{section.label}</h3>
                    </div>
                    <p className="text-sm text-muted-foreground">{section.description}</p>
                    <div className="grid gap-3">
                      {section.options.map(option => (
                        <div key={option.id} className="flex items-center justify-between">
                          <Label htmlFor={option.id} className="cursor-pointer">{option.label}</Label>
                          <Switch
                            id={option.id}
                            checked={!!(settings as any).preferences?.[section.id]?.[option.id]}
                            onCheckedChange={(v) => setField(['preferences', section.id, option.id], v)}
                          />
                        </div>
                      ))}
                    </div>
                  </div>
                ))}

                <Button onClick={() => void save()} disabled={loading}>
                  Guardar preferencias
                </Button>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Notifications Tab */}
          <TabsContent value="notifications" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Bell className="mr-2 h-5 w-5" />
                  Notificaciones
                </CardTitle>
                <CardDescription>
                  Configura qué notificaciones quieres recibir y cómo
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-4">
                    <div className="space-y-3">
                      <h3 className="font-medium flex items-center gap-2">
                        <Mail className="h-5 w-5 text-muted-foreground" />
                        Notificaciones por email
                      </h3>
                      <div className="grid gap-3">
                        <div className="flex items-center justify-between">
                          <Label htmlFor="email-orders" className="cursor-pointer">
                            {isClient ? "Actualizaciones de pedidos" : "Notificaciones de órdenes"}
                          </Label>
                          <Switch
                            id="email-orders"
                            checked={!!settings.notifications.email?.orders}
                            onCheckedChange={(checked) => setField(['notifications', 'email', 'orders'], checked)}
                          />
                        </div>
                        {isClient && (
                          <>
                            <div className="flex items-center justify-between">
                              <Label htmlFor="email-loyalty" className="cursor-pointer">
                                Puntos de lealtad
                              </Label>
                              <Switch
                                id="email-loyalty"
                                checked={!!settings.notifications.email?.loyalty}
                                onCheckedChange={(checked) => setField(['notifications', 'email', 'loyalty'], checked)}
                              />
                            </div>
                            <div className="flex items-center justify-between">
                              <Label htmlFor="email-events" className="cursor-pointer">
                                Eventos y promociones
                              </Label>
                              <Switch
                                id="email-events"
                                checked={!!settings.notifications.email?.events}
                                onCheckedChange={(checked) => setField(['notifications', 'email', 'events'], checked)}
                              />
                            </div>
                            <div className="flex items-center justify-between">
                              <Label htmlFor="email-new-products" className="cursor-pointer">
                                Nuevos productos
                              </Label>
                              <Switch
                                id="email-new-products"
                                checked={!!settings.notifications.email?.newProducts}
                                onCheckedChange={(checked) => setField(['notifications', 'email', 'newProducts'], checked)}
                              />
                            </div>
                          </>
                        )}
                      </div>
                    </div>
                  
                  <Separator />
                  
                  <div className="space-y-3">
                    <h3 className="font-medium">Notificaciones del sistema</h3>
                    <div className="grid gap-3">
                      <div className="flex items-center justify-between">
                        <Label htmlFor="system-quotes" className="cursor-pointer">
                          Cotizaciones aprobadas
                        </Label>
                        <Switch
                          id="system-quotes"
                          checked={!!settings.notifications.system?.quotes}
                          onCheckedChange={(checked) => setField(['notifications', 'system', 'quotes'], checked)}
                        />
                      </div>
                      <div className="flex items-center justify-between">
                        <Label htmlFor="system-stock" className="cursor-pointer">
                          Alertas de stock
                        </Label>
                        <Switch
                          id="system-stock"
                          checked={!!settings.notifications.system?.stock}
                          onCheckedChange={(checked) => setField(['notifications', 'system', 'stock'], checked)}
                        />
                      </div>
                      <div className="flex items-center justify-between">
                        <Label htmlFor="system-account" className="cursor-pointer">
                          Seguridad de la cuenta
                        </Label>
                        <Switch
                          id="system-account"
                          checked={!!settings.notifications.system?.account}
                          onCheckedChange={(checked) => setField(['notifications', 'system', 'account'], checked)}
                        />
                      </div>
                    </div>
                  </div>
                </div>
                
                <Button onClick={() => void save()} disabled={loading}>
                  Guardar configuración
                </Button>
              </CardContent>
            </Card>
          </TabsContent>
          
          {/* Account Tab */}
          <TabsContent value="account" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <User className="mr-2 h-5 w-5" />
                  Información de la cuenta
                </CardTitle>
                <CardDescription>
                  Actualiza tu información personal y datos de contacto
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <Label htmlFor="name">Nombre</Label>
                    <div className="mt-1 bg-muted/40 p-2 rounded-md text-sm">
                      {user?.name || "Usuario CLUB HX"}
                    </div>
                  </div>
                  <div>
                    <Label htmlFor="email">Email</Label>
                    <div className="mt-1 bg-muted/40 p-2 rounded-md text-sm">
                      {user?.email || "usuario@example.com"}
                    </div>
                  </div>
                  <div>
                    <Label htmlFor="role">Rol</Label>
                    <div className="mt-1 bg-muted/40 p-2 rounded-md text-sm capitalize">
                      {user?.role || "client"}
                    </div>
                  </div>
                  <div>
                    <Label htmlFor="member-since">Miembro desde</Label>
                    <div className="mt-1 bg-muted/40 p-2 rounded-md text-sm">
                      Enero 2023
                    </div>
                  </div>
                </div>
                
                <Button onClick={() => toast.success("Perfil actualizado")}>
                  Actualizar perfil
                </Button>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Lock className="mr-2 h-5 w-5" />
                  Seguridad
                </CardTitle>
                <CardDescription>
                  Administra tu contraseña y la seguridad de tu cuenta
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <Button variant="outline" onClick={() => toast.success("Email de cambio de contraseña enviado")}>
                  Cambiar contraseña
                </Button>
                
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label>Autenticación de dos factores</Label>
                    <p className="text-sm text-muted-foreground">
                      Añade una capa extra de seguridad a tu cuenta
                    </p>
                  </div>
                  <Switch id="two-factor" />
                </div>
              </CardContent>
            </Card>
          </TabsContent>
          
          {/* Billing Tab - Only for non-clients */}
          {!isClient && (
            <TabsContent value="billing" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <CreditCard className="mr-2 h-5 w-5" />
                    Facturación
                  </CardTitle>
                  <CardDescription>
                    Administra tus métodos de pago y configuración de facturación
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="space-y-4">
                    <div>
                      <h3 className="font-medium mb-2">Límite de crédito</h3>
                      <div className="bg-muted/40 p-3 rounded-md">
                        <div className="flex justify-between items-center">
                          <span className="text-sm">Límite actual:</span>
                          <span className="font-medium">$5.000.000 CLP</span>
                        </div>
                        <div className="flex justify-between items-center mt-1">
                          <span className="text-sm">Utilizado:</span>
                          <span className="font-medium">$2.150.000 CLP</span>
                        </div>
                        <div className="flex justify-between items-center mt-1">
                          <span className="text-sm">Disponible:</span>
                          <span className="font-medium text-green-600">$2.850.000 CLP</span>
                        </div>
                      </div>
                    </div>
                    
                    <Separator />
                    
                    <div>
                      <h3 className="font-medium mb-2">Información tributaria</h3>
                      <div className="space-y-2">
                        <div className="flex justify-between">
                          <span className="text-sm">RUT:</span>
                          <span>76.123.456-7</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-sm">Razón Social:</span>
                          <span>Salón de Belleza Profesional SpA</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-sm">Giro:</span>
                          <span>Peluquería y salón de belleza</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-sm">Dirección Fiscal:</span>
                          <span>Av. Providencia 1234, Providencia, Santiago</span>
                        </div>
                      </div>
                      <Button variant="outline" size="sm" className="mt-3" onClick={() => toast.success("Información tributaria actualizada")}>
                        Actualizar información
                      </Button>
                    </div>
                    
                    <Separator />
                    
                    <div>
                      <h3 className="font-medium mb-2">Preferencias de facturación</h3>
                      <div className="space-y-3">
                        <div className="flex items-center justify-between">
                          <Label htmlFor="electronic-invoice" className="cursor-pointer">
                            Recibir facturas electrónicas
                          </Label>
                          <Switch id="electronic-invoice" defaultChecked />
                        </div>
                        <div className="flex items-center justify-between">
                          <Label htmlFor="monthly-statement" className="cursor-pointer">
                            Recibir estado de cuenta mensual
                          </Label>
                          <Switch id="monthly-statement" defaultChecked />
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  <Button onClick={() => toast.success("Configuración de facturación actualizada")}>
                    Guardar configuración
                  </Button>
                </CardContent>
              </Card>
            </TabsContent>
          )}
        </Tabs>
      </div>
    </div>
  );
}
