import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Separator } from "@/components/ui/separator";
import { ArrowLeft, Edit, Users, Target, TrendingUp, Calendar, Mail, Phone, MapPin } from "lucide-react";

interface MobileAdminVendorProfileProps {
  vendor: any;
  onBack: () => void;
}

export default function MobileAdminVendorProfile({ vendor, onBack }: MobileAdminVendorProfileProps) {
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('es-CL', {
      style: 'currency',
      currency: 'CLP'
    }).format(amount);
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Fixed Header */}
      <div className="sticky top-0 z-50 bg-background/95 backdrop-blur-sm border-b px-4 py-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Button variant="outline" size="icon" onClick={onBack} className="h-9 w-9">
              <ArrowLeft className="h-4 w-4" />
            </Button>
            <div>
              <h1 className="text-lg font-bold">Perfil Vendedor</h1>
              <p className="text-xs text-muted-foreground">ID: {vendor.id}</p>
            </div>
          </div>
          <Button size="sm">
            <Edit className="h-4 w-4" />
          </Button>
        </div>
      </div>

      {/* Content */}
      <div className="px-4 pb-24 space-y-4">
        {/* Vendor Profile Card */}
        <Card className="mt-4">
          <CardContent className="p-4">
            <div className="flex items-start gap-4">
              <Avatar className="h-16 w-16">
                <AvatarImage src={vendor.avatar} alt={vendor.name} />
                <AvatarFallback className="text-lg">{vendor.name.substring(0, 2)}</AvatarFallback>
              </Avatar>
              
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-2">
                  <h2 className="text-xl font-bold">{vendor.name}</h2>
                  <Badge className={vendor.status === "active" ? "bg-green-500" : "bg-amber-500"}>
                    {vendor.status === "active" ? "Activo" : "Inactivo"}
                  </Badge>
                </div>
                
                <div className="space-y-2">
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <Mail className="h-4 w-4" />
                    <span>{vendor.email}</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <Phone className="h-4 w-4" />
                    <span>{vendor.phone}</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <MapPin className="h-4 w-4" />
                    <span>{vendor.region}</span>
                  </div>
                </div>
              </div>
            </div>
            
            <Separator className="my-4" />
            
            <div>
              <p className="text-sm font-medium mb-2">Clientes asignados ({vendor.assignedClients.length}):</p>
              <div className="flex flex-wrap gap-2">
                {vendor.assignedClients.slice(0, 3).map((client) => (
                  <Badge key={client.id} variant="outline" className="text-xs">{client.name}</Badge>
                ))}
                {vendor.assignedClients.length > 3 && (
                  <Badge variant="outline" className="text-xs">+{vendor.assignedClients.length - 3} más</Badge>
                )}
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Performance Stats */}
        <div className="grid grid-cols-2 gap-3">
          <Card className="p-3">
            <div className="text-center">
              <div className="w-10 h-10 bg-blue-100 rounded-lg mx-auto mb-2 flex items-center justify-center">
                <Users className="h-5 w-5 text-blue-600" />
              </div>
              <div className="text-sm text-muted-foreground">Clientes</div>
              <div className="text-xl font-bold">{vendor.customers}</div>
            </div>
          </Card>
          
          <Card className="p-3">
            <div className="text-center">
              <div className="w-10 h-10 bg-purple-100 rounded-lg mx-auto mb-2 flex items-center justify-center">
                <Target className="h-5 w-5 text-purple-600" />
              </div>
              <div className="text-sm text-muted-foreground">Meta Anual</div>
              <div className="text-xl font-bold">{vendor.targetCompletion}%</div>
            </div>
          </Card>
        </div>

        {/* Sales Performance */}
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-base flex items-center gap-2">
              <TrendingUp className="h-4 w-4 text-green-600" />
              Rendimiento de Ventas
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-3">
              <div>
                <div className="flex justify-between items-center mb-1">
                  <span className="text-sm text-muted-foreground">Ventas totales</span>
                  <span className="text-sm font-bold">{formatCurrency(vendor.totalSales)}</span>
                </div>
              </div>
              
              <div>
                <div className="flex justify-between items-center mb-1">
                  <span className="text-sm text-muted-foreground">Meta anual</span>
                  <span className="text-sm font-bold">{formatCurrency(vendor.salesTarget)}</span>
                </div>
                <div className="w-full bg-muted rounded-full h-2">
                  <div 
                    className="bg-green-600 h-2 rounded-full transition-all duration-300" 
                    style={{ width: `${vendor.targetCompletion}%` }}
                  ></div>
                </div>
              </div>
              
              <div className="grid grid-cols-2 gap-4 pt-2">
                <div>
                  <div className="text-xs text-muted-foreground">Ticket promedio</div>
                  <div className="text-sm font-bold">{formatCurrency(vendor.performance.avgDealSize)}</div>
                </div>
                <div>
                  <div className="text-xs text-muted-foreground">Tasa de conversión</div>
                  <div className="text-sm font-bold">{vendor.performance.conversionRate}%</div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Assigned Clients */}
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-base">Clientes Asignados</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {vendor.assignedClients.map((client) => (
                <div key={client.id} className="flex items-center justify-between p-3 bg-muted/30 rounded-lg">
                  <div>
                    <p className="font-medium text-sm">{client.name}</p>
                    <p className="text-xs text-muted-foreground">{client.contact}</p>
                    <p className="text-xs text-muted-foreground">{client.phone}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-xs text-muted-foreground">Último pedido</p>
                    <p className="text-sm font-medium">{client.lastOrder}</p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Top Clients */}
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-base">Mejores Clientes</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {vendor.topClients.map((client, index) => (
                <div key={client.name} className="flex items-center justify-between p-3 bg-muted/30 rounded-lg">
                  <div className="flex items-center gap-3">
                    <div className="w-6 h-6 bg-primary/10 rounded-full flex items-center justify-center">
                      <span className="text-xs font-bold text-primary">#{index + 1}</span>
                    </div>
                    <div>
                      <p className="font-medium text-sm">{client.name}</p>
                      <p className="text-xs text-muted-foreground">Último: {client.lastOrder}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="font-bold text-sm">{formatCurrency(client.totalSpent)}</p>
                    <p className="text-xs text-muted-foreground">Total</p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Action Buttons */}
        <div className="space-y-3 pt-4">
          <Button className="w-full">
            <Edit className="h-4 w-4 mr-2" />
            Editar Información
          </Button>
          <div className="grid grid-cols-2 gap-3">
            <Button variant="outline" size="sm">
              <Calendar className="h-4 w-4 mr-2" />
              Ver Calendario
            </Button>
            <Button variant="outline" size="sm">
              <Users className="h-4 w-4 mr-2" />
              Ver Clientes
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
