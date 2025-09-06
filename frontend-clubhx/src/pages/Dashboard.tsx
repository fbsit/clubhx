
import { useEffect, useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
import ClientDashboard from "@/components/dashboard/ClientDashboard";
import AdminDashboard from "@/components/dashboard/AdminDashboard";
import SalesDashboard from "@/components/dashboard/SalesDashboard";
import { Order, Event } from "@/components/dashboard/dashboardTypes";

export default function Dashboard() {
  const { user } = useAuth();
  const [recentOrders, setRecentOrders] = useState<Order[]>([]);
  const [upcomingEvents, setUpcomingEvents] = useState<Event[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [loyaltyPoints, setLoyaltyPoints] = useState(0);

  useEffect(() => {
    // Simulate API call
    const fetchDashboardData = async () => {
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Mock data
      setRecentOrders([
        {
          id: "ORD-2025-0473",
          date: "2024-05-02",
          total: 450000,
          status: "completed",
          items: 12
        },
        {
          id: "ORD-2025-0465",
          date: "2024-04-28",
          total: 125000,
          status: "shipped",
          items: 3
        },
        {
          id: "ORD-2025-0452",
          date: "2024-04-20",
          total: 780000,
          status: "invoiced",
          items: 8
        }
      ]);
      
      setUpcomingEvents([
        {
          id: "EVT-001",
          title: "Técnicas de coloración avanzada",
          date: "2024-05-15",
          type: "Workshop",
          brand: ""
        },
        {
          id: "EVT-002",
          title: "Lanzamiento colección Verano 2025",
          date: "2024-05-20",
          type: "Product Launch",
          brand: "Schwarzkopf"
        }
      ]);
      
      setLoyaltyPoints(1250);
      setIsLoading(false);
    };
    
    fetchDashboardData();
  }, [user?.role]);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-8 w-8 border-4 border-solid border-primary border-r-transparent align-middle"></div>
          <p className="mt-2 text-muted-foreground">Cargando...</p>
        </div>
      </div>
    );
  }

  // Cada rol ve su dashboard específico directamente sin tabs
  if (user?.role === "admin") {
    return (
      <div className="space-y-6 animate-enter">
        <AdminDashboard user={user} />
      </div>
    );
  }

  if (user?.role === "sales") {
    return (
      <div className="space-y-6 animate-enter">
        <SalesDashboard user={user} />
      </div>
    );
  }

  // Cliente por defecto
  return (
    <div className="space-y-6 animate-enter">
      <ClientDashboard 
        user={user}
        recentOrders={recentOrders}
        upcomingEvents={upcomingEvents}
        loyaltyPoints={loyaltyPoints}
        creditAvailable={0}
      />
    </div>
  );
}
