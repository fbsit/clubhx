import { useAuth } from "@/contexts/AuthContext";
import SalesEventsView from "@/components/events/SalesEventsView";

export default function SalesEvents() {
  const { user } = useAuth();

  return (
    <div className="h-full bg-background">
      {/* Header */}
      <div className="bg-white border-b border-border px-6 py-4">
        <div className="flex items-center justify-between gap-3 flex-wrap">
          <div>
            <h1 className="text-2xl font-bold text-foreground">Eventos de Clientes</h1>
            <p className="text-sm text-muted-foreground">
              Gestiona los eventos donde están inscritos tus clientes
            </p>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="p-6">
        <SalesEventsView />
      </div>
    </div>
  );
}
