import React, { useState } from "react";
import { useParams } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { 
  Users,
  Phone,
  Mail,
  ShoppingCart,
  History,
  MessageSquare
} from "lucide-react";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { ScheduleVisitDialog } from "@/components/sales/ScheduleVisitDialog";
import { AddTeamMemberDialog } from "@/components/sales/AddTeamMemberDialog";
import { CreditLimitRequestDialog } from "@/components/sales/CreditLimitRequestDialog";
import { CustomerCreditTab } from "@/components/sales/CustomerCreditTab";
import { CustomerProfileHeader } from "@/components/sales/CustomerProfileHeader";
import { CustomerStatsCards } from "@/components/sales/CustomerStatsCards";
import { CustomerOverviewTab } from "@/components/sales/CustomerOverviewTab";
import { CustomerOrdersTab } from "@/components/sales/CustomerOrdersTab";
import { useToast } from "@/hooks/use-toast";
const getCreditRequestsByCustomer = (_customerId: string) => [] as any[];
const getCreditHistoryByCustomer = (_customerId: string) => [] as any[];

// Mock customer data - Updated to include credit information
const customers = {
  "C001": {
    id: "C001",
    name: "Salon Elegance",
    contact: "María González",
    phone: "+56 9 2235 4678",
    email: "maria@salonelegance.cl",
    address: "Av. Providencia 1423, Providencia",
    city: "Santiago",
    region: "Metropolitana",
    zipCode: "7500000",
    lastOrder: "2023-05-01",
    lastContact: "2023-05-03",
    nextVisit: "2023-05-15",
    status: "active",
    loyaltyPoints: 3450,
    creditLimit: 2000000,
    outstandingBalance: 850000,
    profileImage: "https://randomuser.me/api/portraits/women/32.jpg",
    notes: "Cliente VIP. Prefiere productos de alta gama. Interesada en la nueva línea de coloración.",
    stats: {
      totalOrders: 48,
      totalSpent: 8456000,
      averageOrderValue: 176167,
      lastYearGrowth: 12
    },
    orders: [
      { id: "ORD-2023-048", date: "2023-05-01", status: "completed", total: 450000, items: 8 },
      { id: "ORD-2023-042", date: "2023-04-15", status: "completed", total: 320000, items: 5 },
      { id: "ORD-2023-035", date: "2023-03-28", status: "completed", total: 510000, items: 10 },
      { id: "ORD-2023-027", date: "2023-03-12", status: "completed", total: 280000, items: 4 },
      { id: "ORD-2023-020", date: "2023-02-24", status: "completed", total: 390000, items: 7 }
    ],
    team: [
      { name: "Laura Díaz", role: "Estilista Principal", email: "laura@salonelegance.cl" },
      { name: "Juan Pérez", role: "Colorista", email: "juan@salonelegance.cl" },
      { name: "Ana Torres", role: "Administradora", email: "ana@salonelegance.cl" }
    ],
    activities: [
      { 
        type: "visit", 
        date: "2023-05-03", 
        description: "Visita para presentar nuevos productos de la línea BLONDME.",
        notes: "Interesados en hacer un pedido grande próximamente."
      },
      { 
        type: "call", 
        date: "2023-04-28", 
        description: "Llamada de seguimiento sobre capacitación.",
        notes: "Confirmaron participación para el taller del 15 de mayo."
      },
      { 
        type: "email", 
        date: "2023-04-25", 
        description: "Envío de catálogo actualizado y lista de precios.",
        notes: "Solicitaron más información sobre descuentos por volumen."
      },
      { 
        type: "order", 
        date: "2023-04-15", 
        description: "Realizaron pedido #ORD-2023-042.",
        notes: "Entrega programada para el 18 de abril."
      }
    ]
  },
  "C002": {
    id: "C002",
    name: "Hair Design Studio",
    contact: "Carlos Pérez",
    phone: "+56 9 7764 5511",
    email: "carlos@hairdesign.cl",
    address: "Av. Libertad 789, Viña del Mar",
    city: "Viña del Mar",
    region: "Valparaíso",
    zipCode: "2520000",
    lastOrder: "2023-04-28",
    lastContact: "2023-05-02",
    nextVisit: "2023-05-17",
    status: "active",
    loyaltyPoints: 2150,
    creditLimit: 1500000,
    outstandingBalance: 320000,
    profileImage: "https://randomuser.me/api/portraits/men/45.jpg",
    notes: "Cliente regular. Especializado en cortes modernos y técnicas de coloración avanzada.",
    stats: {
      totalOrders: 32,
      totalSpent: 5234000,
      averageOrderValue: 163563,
      lastYearGrowth: 8
    },
    orders: [
      { id: "ORD-2023-045", date: "2023-04-28", status: "completed", total: 380000, items: 6 },
      { id: "ORD-2023-038", date: "2023-04-10", status: "completed", total: 290000, items: 4 },
      { id: "ORD-2023-031", date: "2023-03-22", status: "completed", total: 420000, items: 8 }
    ],
    team: [
      { name: "Carlos Pérez", role: "Propietario", email: "carlos@hairdesign.cl" },
      { name: "Sofia Martínez", role: "Estilista", email: "sofia@hairdesign.cl" }
    ],
    activities: [
      { 
        type: "visit", 
        date: "2023-05-02", 
        description: "Presentación de nuevos productos OSiS+.",
        notes: "Mostraron interés en ampliar su stock de productos de peinado."
      },
      { 
        type: "order", 
        date: "2023-04-28", 
        description: "Realizaron pedido #ORD-2023-045.",
        notes: "Entrega programada para el 2 de mayo."
      }
    ]
  }
};

export default function SalesCustomerDetail() {
  const { id } = useParams<{ id: string }>();
  const customer = id ? customers[id as keyof typeof customers] : null;
  const { toast } = useToast();
  
  const [isScheduleDialogOpen, setIsScheduleDialogOpen] = useState(false);
  const [isAddTeamMemberDialogOpen, setIsAddTeamMemberDialogOpen] = useState(false);
  const [isCreditRequestDialogOpen, setIsCreditRequestDialogOpen] = useState(false);

  const handleScheduleVisit = (visitData: { date: Date; time: string; purpose: string; notes: string }) => {
    console.log("Programando visita:", visitData);
    toast({
      title: "Visita programada",
      description: `Visita programada para ${visitData.date.toLocaleDateString()} a las ${visitData.time}`,
    });
  };

  const handleAddTeamMember = (member: { name: string; role: string; email: string }) => {
    console.log("Agregando miembro del equipo:", member);
    toast({
      title: "Contacto agregado",
      description: `${member.name} ha sido agregado al equipo de ${customer?.name}`,
    });
  };

  const handleCreditLimitRequest = (request: {
    customerId: string;
    currentLimit: number;
    requestedLimit: number;
    reason: string;
  }) => {
    console.log("Solicitando cambio de límite:", request);
    return Promise.resolve();
  };

  if (!customer) {
    return (
      <div className="container max-w-7xl py-6">
        <CustomerProfileHeader
          customer={{ id: "", name: "", contact: "", phone: "", email: "", status: "", creditLimit: 0, outstandingBalance: 0, profileImage: "" }}
          onScheduleVisit={() => {}}
          onCreditLimitRequest={() => {}}
        />
        <Card className="text-center py-8">
          <CardContent>
            <p className="text-xl font-semibold">Cliente no encontrado</p>
            <p className="text-muted-foreground mt-2">El cliente que buscas no existe o ha sido eliminado.</p>
          </CardContent>
          <CardFooter className="justify-center pt-4">
            <Button>Ver todos los clientes</Button>
          </CardFooter>
        </Card>
      </div>
    );
  }

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat('es-CL', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    }).format(date);
  };

  const getActivityIcon = (type: string) => {
    switch (type) {
      case "visit": return <Users className="h-4 w-4" />;
      case "call": return <Phone className="h-4 w-4" />;
      case "email": return <Mail className="h-4 w-4" />;
      case "order": return <ShoppingCart className="h-4 w-4" />;
      default: return <History className="h-4 w-4" />;
    }
  };

  // Credit information
  const creditRequests = getCreditRequestsByCustomer(customer.id);
  const creditHistory = getCreditHistoryByCustomer(customer.id);
  const pendingRequests = creditRequests.filter(req => req.status === 'pending');

  return (
    <div className="container max-w-7xl py-6 animate-enter">
      <CustomerProfileHeader
        customer={customer}
        onScheduleVisit={() => setIsScheduleDialogOpen(true)}
        onCreditLimitRequest={() => setIsCreditRequestDialogOpen(true)}
      />
      
      <CustomerStatsCards
        stats={customer.stats}
        loyaltyPoints={customer.loyaltyPoints}
      />
      
      <Tabs defaultValue="overview" className="w-full">
        <TabsList className="w-full grid grid-cols-6 h-auto mb-6">
          <TabsTrigger value="overview" className="py-2">Resumen</TabsTrigger>
          <TabsTrigger value="orders" className="py-2">Pedidos</TabsTrigger>
          <TabsTrigger value="credit" className="py-2">Crédito</TabsTrigger>
          <TabsTrigger value="activity" className="py-2">Actividad</TabsTrigger>
          <TabsTrigger value="team" className="py-2">Equipo</TabsTrigger>
          <TabsTrigger value="notes" className="py-2">Notas</TabsTrigger>
        </TabsList>
        
        <TabsContent value="overview" className="mt-0">
          <CustomerOverviewTab customer={customer} />
        </TabsContent>
        
        <TabsContent value="orders" className="mt-0">
          <CustomerOrdersTab orders={customer.orders} customerName={customer.name} />
        </TabsContent>
        
        <TabsContent value="credit" className="mt-0">
          <CustomerCreditTab
            currentLimit={customer.creditLimit}
            outstandingBalance={customer.outstandingBalance}
            creditHistory={creditHistory}
            pendingRequests={pendingRequests}
          />
        </TabsContent>
        
        {/* Activity Tab */}
        <TabsContent value="activity" className="mt-0">
          <Card>
            <CardHeader>
              <CardTitle>Historial de Actividades</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-8">
                {customer.activities.map((activity, index) => (
                  <div key={index} className="flex gap-4">
                    <div className="mt-1">
                      <div className="bg-primary/10 rounded-full p-2">
                        {getActivityIcon(activity.type)}
                      </div>
                    </div>
                    <div className="space-y-1 flex-1">
                      <div className="flex items-center justify-between">
                        <p className="font-medium">{activity.description}</p>
                        <Badge variant="outline">{formatDate(activity.date)}</Badge>
                      </div>
                      <p className="text-sm text-muted-foreground">{activity.notes}</p>
                      {index < customer.activities.length - 1 && (
                        <div className="pt-4 pb-0">
                          <div className="border-b border-dashed"></div>
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
            <CardFooter>
              <Button variant="outline" size="sm" className="w-full">
                <MessageSquare className="mr-2 h-4 w-4" />
                Registrar Nueva Actividad
              </Button>
            </CardFooter>
          </Card>
        </TabsContent>
        
        {/* Team Tab */}
        <TabsContent value="team" className="mt-0">
          <Card>
            <CardHeader>
              <CardTitle>Equipo del Cliente</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {customer.team.map((member, index) => (
                  <div key={index} className="flex items-center justify-between border-b pb-4 last:border-0 last:pb-0">
                    <div className="flex items-center gap-3">
                      <Avatar>
                        <AvatarFallback>{member.name.substring(0, 2)}</AvatarFallback>
                      </Avatar>
                      <div>
                        <p className="font-medium">{member.name}</p>
                        <p className="text-sm text-muted-foreground">{member.role}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <Button variant="ghost" size="sm">
                        <Mail className="h-4 w-4 mr-2" />
                        {member.email}
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
            <CardFooter>
              <Button 
                variant="outline" 
                size="sm" 
                className="w-full"
                onClick={() => setIsAddTeamMemberDialogOpen(true)}
              >
                <Users className="mr-2 h-4 w-4" />
                Agregar Contacto
              </Button>
            </CardFooter>
          </Card>
        </TabsContent>
        
        {/* Notes Tab */}
        <TabsContent value="notes" className="mt-0">
          <Card>
            <CardHeader>
              <CardTitle>Notas del Cliente</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="border rounded-md p-4 bg-muted/30">
                <p className="whitespace-pre-line">{customer.notes}</p>
              </div>
            </CardContent>
            <CardFooter>
              <Button variant="outline" size="sm">
                Editar Notas
              </Button>
            </CardFooter>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Dialogs */}
      <ScheduleVisitDialog
        isOpen={isScheduleDialogOpen}
        onClose={() => setIsScheduleDialogOpen(false)}
        customerName={customer.name}
        onSchedule={handleScheduleVisit}
      />

      <AddTeamMemberDialog
        isOpen={isAddTeamMemberDialogOpen}
        onClose={() => setIsAddTeamMemberDialogOpen(false)}
        customerName={customer.name}
        onAdd={handleAddTeamMember}
      />

      <CreditLimitRequestDialog
        isOpen={isCreditRequestDialogOpen}
        onClose={() => setIsCreditRequestDialogOpen(false)}
        customerName={customer.name}
        currentLimit={customer.creditLimit}
        customerId={customer.id}
        onSubmit={handleCreditLimitRequest}
      />
    </div>
  );
}
