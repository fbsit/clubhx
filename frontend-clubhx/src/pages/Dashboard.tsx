
import { useEffect, useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
import ClientDashboard from "@/components/dashboard/ClientDashboard";
import AdminDashboard from "@/components/dashboard/AdminDashboard";
import SalesDashboard from "@/components/dashboard/SalesDashboard";
import { Order, Event } from "@/components/dashboard/dashboardTypes";
import { listOrdersByClient } from "@/services/ordersApi";
import { eventsApi } from "@/services/eventsApi";

export default function Dashboard() {
  const { user } = useAuth();
  const [recentOrders, setRecentOrders] = useState<Order[]>([]);
  const [upcomingEvents, setUpcomingEvents] = useState<Event[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [loyaltyPoints, setLoyaltyPoints] = useState(0);
  const [ordersError, setOrdersError] = useState<string | null>(null);
  const [eventsError, setEventsError] = useState<string | null>(null);
  const [ordersTotal, setOrdersTotal] = useState<number>(0);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        setIsLoading(true);
        setOrdersError(null);
        setEventsError(null);
        const ordersPromise = (async () => {
          console.log("user", user);
          // Solo aplica a clientes; otros roles no muestran este bloque
          if (user?.role !== "client") return [] as Order[];
          try {
            //if (!user?.providerClientPk) return [] as Order[];
            const resp = await listOrdersByClient(user.providerClientPk || "1", 1);
            const raw = (resp as any).results ?? resp;
            const totalCount = Number((resp as any)?.count ?? (Array.isArray(raw) ? raw.length : 0));
            const finalTotal = Number.isFinite(totalCount) ? totalCount : 0;
            setOrdersTotal(finalTotal);
            try { localStorage.setItem('client-orders-total', String(finalTotal)); } catch {}
            const mapped: Order[] = (Array.isArray(raw) ? raw : [])
              .map((o: any) => ({
                id: String(o.id ?? o.order_id ?? o.pk ?? ""),
                date: String(o.date ?? o.created ?? o.created_at ?? o.updated_at ?? new Date().toISOString()),
                total: Number(o.total ?? o.total_amount ?? o.amount ?? 0),
                status: (o.status ?? "requested") as Order["status"],
                items: Number(o.items_count ?? (Array.isArray(o.items) ? o.items.length : 0)),
              }))
              .filter(o => o.id)
              .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
              .slice(0, 5);
            return mapped;
          } catch {
            setOrdersError("No hay datos para mostrar o ocurrió un error cargando tus órdenes.");
            setOrdersTotal(0);
            try { localStorage.setItem('client-orders-total', '0'); } catch {}
            return [] as Order[];
          }
        })();

        const eventsPromise = (async () => {
          try {
            const dtos = await eventsApi.getUpcomingPublicEvents(5);
            const mapped: Event[] = dtos.map(d => ({
              id: String(d.id),
              title: d.title,
              date: (d.start_date instanceof Date ? d.start_date : new Date(d.start_date as any)).toISOString().slice(0, 10),
              type: d.category || d.status || "Evento",
              brand: d.tags?.[0] || "",
            }));
            return mapped;
          } catch {
            setEventsError("No hay eventos próximos para mostrar o ocurrió un error.");
            return [] as Event[];
          }
        })();

        const [orders, events] = await Promise.all([ordersPromise, eventsPromise]);
        setRecentOrders(orders);
        setUpcomingEvents(events);
      } finally {
        setIsLoading(false);
      }
    };

    fetchDashboardData();
  }, [user?.role, user?.providerClientPk]);

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
        ordersError={ordersError}
        eventsError={eventsError}
        creditAvailable={0}
      />
    </div>
  );
}
