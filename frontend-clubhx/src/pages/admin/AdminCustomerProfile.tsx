
import React, { useState } from "react";
import { useParams } from "react-router-dom";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";
import { useIsMobile } from "@/hooks/use-mobile";
import { CustomerProfileHeader } from "@/components/admin/customer/CustomerProfileHeader";
import { CustomerStatsCards } from "@/components/admin/customer/CustomerStatsCards";
import { CustomerOverviewTab } from "@/components/admin/customer/CustomerOverviewTab";
import { CustomerOrdersTab } from "@/components/admin/customer/CustomerOrdersTab";
import { CustomerActivityTab } from "@/components/admin/customer/CustomerActivityTab";
import { CustomerTeamTab } from "@/components/admin/customer/CustomerTeamTab";
import { CustomerNotesTab } from "@/components/admin/customer/CustomerNotesTab";
import ClientWishlistTab from "@/components/admin/wishlist/ClientWishlistTab";

// Mock customer data expanded for admin view
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
    profileImage: "https://randomuser.me/api/portraits/women/32.jpg",
    notes: "Cliente VIP. Prefiere productos de alta gama. Interesada en la nueva línea de coloración.",
    assignedVendor: "Ana López",
    vendorId: "V001",
    registrationDate: "2021-03-15",
    creditLimit: 2000000,
    paymentTerms: "30 días",
    stats: {
      totalOrders: 48,
      totalSpent: 8456000,
      averageOrderValue: 176167,
      lastYearGrowth: 12,
      outstandingBalance: 450000
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
        description: "Visita comercial realizada por Ana López.",
        notes: "Cliente interesado en ampliar pedido mensual. Próxima reunión programada."
      },
      { 
        type: "call", 
        date: "2023-04-28", 
        description: "Llamada de seguimiento post-venta.",
        notes: "Cliente satisfecho con último pedido. Consulta sobre nuevos productos."
      },
      { 
        type: "email", 
        date: "2023-04-25", 
        description: "Envío de catálogo actualizado y condiciones comerciales.",
        notes: "Cliente solicitó información sobre descuentos por volumen."
      },
      { 
        type: "order", 
        date: "2023-04-15", 
        description: "Pedido #ORD-2023-042 procesado exitosamente.",
        notes: "Entrega realizada en tiempo y forma. Cliente satisfecho."
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
    profileImage: "https://randomuser.me/api/portraits/men/45.jpg",
    notes: "Cliente regular. Especializado en cortes modernos y técnicas de coloración avanzada.",
    assignedVendor: "Roberto Silva",
    vendorId: "V002",
    registrationDate: "2021-08-20",
    creditLimit: 1500000,
    paymentTerms: "15 días",
    stats: {
      totalOrders: 32,
      totalSpent: 5234000,
      averageOrderValue: 163563,
      lastYearGrowth: 8,
      outstandingBalance: 280000
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
        notes: "Cliente interesado en ampliar stock de productos de peinado."
      },
      { 
        type: "order", 
        date: "2023-04-28", 
        description: "Pedido #ORD-2023-045 procesado.",
        notes: "Entrega programada exitosamente."
      }
    ]
  }
};

export default function AdminCustomerProfile() {
  const { id } = useParams<{ id: string }>();
  const [customerData, setCustomerData] = useState(id ? customers[id as keyof typeof customers] : null);
  const { toast } = useToast();
  const isMobile = useIsMobile();

  console.log("AdminCustomerProfile - Customer ID:", id);
  console.log("AdminCustomerProfile - Customer found:", customerData);

  const handleEditCustomer = () => {
    toast({
      title: "Función en desarrollo",
      description: "La edición de clientes estará disponible próximamente",
    });
  };

  const handleChangeVendor = () => {
    toast({
      title: "Función en desarrollo", 
      description: "El cambio de vendedor estará disponible próximamente",
    });
  };

  const handleChangeStatus = () => {
    toast({
      title: "Función en desarrollo",
      description: "El cambio de estado estará disponible próximamente", 
    });
  };

  const handleCreditLimitUpdate = (newLimit: number) => {
    if (customerData) {
      setCustomerData({
        ...customerData,
        creditLimit: newLimit
      });
    }
  };

  if (!customerData) {
    return (
      <div className="container max-w-7xl py-6">
        <div className="flex items-center gap-2 mb-6">
          <Button asChild variant="ghost" size="sm">
            <Link to="/main/admin/customers">
              Volver a Clientes
            </Link>
          </Button>
        </div>
        <Card className="text-center py-8">
          <CardContent>
            <p className="text-xl font-semibold">Cliente no encontrado</p>
            <p className="text-muted-foreground mt-2">El cliente que buscas no existe o ha sido eliminado.</p>
          </CardContent>
          <CardFooter className="justify-center pt-4">
            <Button asChild>
              <Link to="/main/admin/customers">Ver todos los clientes</Link>
            </Button>
          </CardFooter>
        </Card>
      </div>
    );
  }

  return (
    <div className="container max-w-7xl py-6 animate-enter">
      <CustomerProfileHeader
        customerData={customerData}
        onEditCustomer={handleEditCustomer}
        onChangeStatus={handleChangeStatus}
        onChangeVendor={handleChangeVendor}
        onCreditLimitUpdate={handleCreditLimitUpdate}
      />
      
      <CustomerStatsCards
        stats={customerData.stats}
        creditLimit={customerData.creditLimit}
        loyaltyPoints={customerData.loyaltyPoints}
      />
      
      <Tabs defaultValue="overview" className="w-full">
        <TabsList className={`w-full grid h-auto mb-6 ${isMobile ? 'grid-cols-4' : 'grid-cols-6'}`}>
          <TabsTrigger value="overview" className="py-2">Resumen</TabsTrigger>
          <TabsTrigger value="orders" className="py-2">Pedidos</TabsTrigger>
          <TabsTrigger value="wishlist" className="py-2">Lista Deseos</TabsTrigger>
          <TabsTrigger value="activity" className="py-2">Actividad</TabsTrigger>
          {!isMobile && <TabsTrigger value="team" className="py-2">Equipo</TabsTrigger>}
          {!isMobile && <TabsTrigger value="notes" className="py-2">Notas</TabsTrigger>}
        </TabsList>
        
        <TabsContent value="overview" className="mt-0">
          <CustomerOverviewTab customerData={customerData} />
        </TabsContent>
        
        <TabsContent value="orders" className="mt-0">
          <CustomerOrdersTab customerData={customerData} />
        </TabsContent>
        
        <TabsContent value="wishlist" className="mt-0">
          <ClientWishlistTab 
            clientId={customerData.id} 
            clientName={customerData.name} 
          />
        </TabsContent>
        
        <TabsContent value="activity" className="mt-0">
          <CustomerActivityTab customerData={customerData} />
        </TabsContent>
        
        {!isMobile && (
          <TabsContent value="team" className="mt-0">
            <CustomerTeamTab customerData={customerData} />
          </TabsContent>
        )}
        
        {!isMobile && (
          <TabsContent value="notes" className="mt-0">
            <CustomerNotesTab customerData={customerData} />
          </TabsContent>
        )}
      </Tabs>
    </div>
  );
}
