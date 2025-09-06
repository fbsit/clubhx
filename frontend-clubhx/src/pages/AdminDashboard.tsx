
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Link } from "react-router-dom";
import { CreditCard, ArrowRight, Clock } from "lucide-react";
const mockCreditRequests: any[] = [];

export default function AdminDashboard() {
  const pendingCreditRequests = mockCreditRequests.filter(r => r.status === 'pending');

  return (
    <div className="container max-w-7xl py-6 animate-enter space-y-6">
      <h1 className="text-3xl font-bold">Dashboard de Administración</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-lg">Ventas Totales</CardTitle>
            <CardDescription>Últimos 30 días</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold">$15,982,450</p>
            <p className="text-sm text-muted-foreground">+12.5% respecto al mes anterior</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-lg">Cotizaciones</CardTitle>
            <CardDescription>Últimos 30 días</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold">248</p>
            <p className="text-sm text-muted-foreground">Tasa de conversión: 68%</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-lg">Clientes Activos</CardTitle>
            <CardDescription>Total</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold">127</p>
            <p className="text-sm text-muted-foreground">+5 nuevos este mes</p>
          </CardContent>
        </Card>
      </div>

      {/* Credit Requests Alert */}
      {pendingCreditRequests.length > 0 && (
        <Card className="border-amber-200 bg-amber-50">
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <CreditCard className="h-5 w-5 text-amber-600" />
                <CardTitle className="text-lg text-amber-800">Solicitudes de Crédito Pendientes</CardTitle>
              </div>
              <Badge className="bg-amber-500">
                <Clock className="h-3 w-3 mr-1" />
                {pendingCreditRequests.length} pendiente{pendingCreditRequests.length > 1 ? 's' : ''}
              </Badge>
            </div>
            <CardDescription className="text-amber-700">
              Hay solicitudes de aumento de límite de crédito que requieren su atención
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            {pendingCreditRequests.slice(0, 3).map((request) => (
              <div key={request.id} className="flex items-center justify-between p-3 bg-white rounded-lg border">
                <div>
                  <p className="font-medium">{request.customerName}</p>
                  <p className="text-sm text-muted-foreground">
                    Solicita {new Intl.NumberFormat('es-CL', {
                      style: 'currency',
                      currency: 'CLP'
                    }).format(request.requestedLimit)} (actual: {new Intl.NumberFormat('es-CL', {
                      style: 'currency',
                      currency: 'CLP'
                    }).format(request.currentLimit)})
                  </p>
                </div>
                <div className="text-xs text-muted-foreground">
                  {new Date(request.requestDate).toLocaleDateString('es-CL')}
                </div>
              </div>
            ))}
            <div className="pt-2">
              <Button asChild size="sm">
                <Link to="/main/admin/credit-requests">
                  Ver Todas las Solicitudes
                  <ArrowRight className="h-4 w-4 ml-1" />
                </Link>
              </Button>
            </div>
          </CardContent>
        </Card>
      )}
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Productos con Mayor Demanda</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <div>
                  <p className="font-medium">IGORA Royal 60ml (#633)</p>
                  <p className="text-sm text-muted-foreground">Schwarzkopf</p>
                </div>
                <p>845 unidades</p>
              </div>
              <div className="flex justify-between items-center">
                <div>
                  <p className="font-medium">BC Bonacure Shampoo</p>
                  <p className="text-sm text-muted-foreground">Schwarzkopf</p>
                </div>
                <p>738 unidades</p>
              </div>
              <div className="flex justify-between items-center">
                <div>
                  <p className="font-medium">BLONDME Toner</p>
                  <p className="text-sm text-muted-foreground">Schwarzkopf</p>
                </div>
                <p>692 unidades</p>
              </div>
              <div className="flex justify-between items-center">
                <div>
                  <p className="font-medium">OSiS+ Dust It</p>
                  <p className="text-sm text-muted-foreground">Schwarzkopf</p>
                </div>
                <p>587 unidades</p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle>Clientes Recientes</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <div>
                  <p className="font-medium">Salon Elegance</p>
                  <p className="text-sm text-muted-foreground">Providencia, Santiago</p>
                </div>
                <p className="text-green-600">Activo</p>
              </div>
              <div className="flex justify-between items-center">
                <div>
                  <p className="font-medium">Arte y Estilo Spa</p>
                  <p className="text-sm text-muted-foreground">Las Condes, Santiago</p>
                </div>
                <p className="text-green-600">Activo</p>
              </div>
              <div className="flex justify-between items-center">
                <div>
                  <p className="font-medium">Beauty Zone</p>
                  <p className="text-sm text-muted-foreground">Ñuñoa, Santiago</p>
                </div>
                <p className="text-green-600">Activo</p>
              </div>
              <div className="flex justify-between items-center">
                <div>
                  <p className="font-medium">Hair Design Studio</p>
                  <p className="text-sm text-muted-foreground">Viña del Mar</p>
                </div>
                <p className="text-amber-600">Pendiente</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
