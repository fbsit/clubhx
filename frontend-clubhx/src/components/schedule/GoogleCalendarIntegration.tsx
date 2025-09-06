import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Card, CardContent } from "@/components/ui/card";
import { Calendar, Check, Settings, Smartphone } from "lucide-react";
import { Badge } from "@/components/ui/badge";

interface GoogleCalendarIntegrationProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function GoogleCalendarIntegration({ open, onOpenChange }: GoogleCalendarIntegrationProps) {
  const [isConnected, setIsConnected] = useState(false);
  const [isConnecting, setIsConnecting] = useState(false);

  const handleConnect = async () => {
    setIsConnecting(true);
    
    // Simulate OAuth flow
    setTimeout(() => {
      setIsConnected(true);
      setIsConnecting(false);
    }, 2000);
  };

  const handleDisconnect = () => {
    setIsConnected(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Calendar className="h-5 w-5" />
            Integración con Google Calendar
          </DialogTitle>
          <DialogDescription>
            Sincroniza tus citas con tu calendario personal para mayor organización
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          {/* Estado de conexión */}
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-blue-100 rounded-lg">
                    <Calendar className="h-5 w-5 text-blue-600" />
                  </div>
                  <div>
                    <h3 className="font-medium">Google Calendar</h3>
                    <p className="text-sm text-muted-foreground">
                      {isConnected ? "Conectado" : "No conectado"}
                    </p>
                  </div>
                </div>
                <Badge variant={isConnected ? "default" : "secondary"}>
                  {isConnected ? (
                    <>
                      <Check className="h-3 w-3 mr-1" />
                      Activo
                    </>
                  ) : (
                    "Inactivo"
                  )}
                </Badge>
              </div>
            </CardContent>
          </Card>

          {/* Beneficios */}
          <div className="space-y-3">
            <h4 className="font-medium text-sm">¿Qué obtienes al conectar?</h4>
            <div className="grid gap-2">
              <div className="flex items-center gap-3 text-sm">
                <Check className="h-4 w-4 text-green-600 flex-shrink-0" />
                <span>Sincronización automática de citas confirmadas</span>
              </div>
              <div className="flex items-center gap-3 text-sm">
                <Check className="h-4 w-4 text-green-600 flex-shrink-0" />
                <span>Recordatorios automáticos en tu móvil</span>
              </div>
              <div className="flex items-center gap-3 text-sm">
                <Check className="h-4 w-4 text-green-600 flex-shrink-0" />
                <span>Enlaces de videollamada incluidos automáticamente</span>
              </div>
              <div className="flex items-center gap-3 text-sm">
                <Check className="h-4 w-4 text-green-600 flex-shrink-0" />
                <span>Actualización en tiempo real de cambios</span>
              </div>
            </div>
          </div>

          {/* Mock de configuración cuando está conectado */}
          {isConnected && (
            <Card className="bg-green-50 border-green-200">
              <CardContent className="p-4">
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium">Calendario sincronizado</span>
                    <Badge variant="outline" className="bg-white">
                      Club HX - Citas
                    </Badge>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm">Recordatorios</span>
                    <span className="text-sm text-muted-foreground">15 min antes</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm">Notificaciones móvil</span>
                    <Smartphone className="h-4 w-4 text-green-600" />
                  </div>
                </div>
              </CardContent>
            </Card>
          )}
        </div>

        <DialogFooter className="gap-2">
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cerrar
          </Button>
          {isConnected ? (
            <Button variant="outline" onClick={handleDisconnect}>
              <Settings className="h-4 w-4 mr-2" />
              Desconectar
            </Button>
          ) : (
            <Button onClick={handleConnect} disabled={isConnecting}>
              {isConnecting ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-2 border-solid border-current border-r-transparent mr-2"></div>
                  Conectando...
                </>
              ) : (
                <>
                  <Calendar className="h-4 w-4 mr-2" />
                  Conectar Google Calendar
                </>
              )}
            </Button>
          )}
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}