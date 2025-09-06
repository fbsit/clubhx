
import { useAuth } from "@/contexts/AuthContext";
import ClientEventsView from "@/components/events/ClientEventsView";
import SalesEventsView from "@/components/events/SalesEventsView";
import AdminEventsView from "@/components/events/AdminEventsView";
import { useIsMobile } from "@/hooks/use-mobile";

export default function Events() {
  const { user } = useAuth();
  const isMobile = useIsMobile();

  // Admin ve su vista específica directamente sin tabs
  if (user?.role === "admin") {
    return (
      <div className="container max-w-7xl py-6 animate-enter">
        {!isMobile && <h1 className="text-3xl font-bold mb-6">Gestión de Eventos</h1>}
        <AdminEventsView />
      </div>
    );
  }

  // Sales ve su vista específica directamente
  if (user?.role === "sales") {
    return (
      <div className="container max-w-7xl py-6 animate-enter">
        <h1 className="text-3xl font-bold mb-6">Eventos</h1>
        <SalesEventsView />
      </div>
    );
  }

  // Cliente por defecto
  return (
    <div className="container max-w-7xl py-6 animate-enter">
      <h1 className="text-3xl font-bold mb-6">Eventos</h1>
      <ClientEventsView />
    </div>
  );
}
