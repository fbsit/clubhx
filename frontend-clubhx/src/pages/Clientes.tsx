import React, { useEffect, useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
import CommonRoleTabs from "@/components/common/CommonRoleTabs";
import { ClientList } from "@/components/clients/ClientList";
import { ClientListFilters } from "@/components/clients/ClientListFilters";
import { ClientListStats } from "@/components/clients/ClientListStats";
import type { Cliente } from "@/components/clients/ClientCard";
import { useNavigate } from "react-router-dom";

import { clientsApi } from "@/services/clientsApi";

function adaptClient(dto: any): Cliente {
  return {
    id: dto.id,
    name: dto.fantasy_name || dto.name || "Cliente",
    contact: dto.contact || dto.name || "",
    phone: dto.phone || "",
    email: dto.email || "",
    city: dto.city || dto.municipality || "",
    lastOrder: dto.modified || dto.created || "",
    nextVisit: "",
    status: dto.is_active ? "active" : "inactive",
  } as Cliente;
}

export default function ClientesPage() {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState(user?.role === "admin" ? "admin" : "sales");
  const navigate = useNavigate();
  const [clients, setClients] = useState<Cliente[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        setLoading(true);
        setError(null);
        const data = await clientsApi.getClients({ limit: 200 });
        const mapped = (data.results || []).map(adaptClient);
        if (!cancelled) setClients(mapped);
      } catch (e) {
        if (!cancelled) {
          setError("No se pudieron cargar los clientes");
          setClients([]);
        }
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();
    return () => { cancelled = true; };
  }, []);

  // Ejemplo de lógica para filtrar asignados (en la real vendría de user.id vs asignación real)
  const misClientes = clients.slice(0, 5);
  const todosClientes = clients;

  // Dummy filtros y stats para ejemplo
  const [filters, setFilters] = useState({ estado: "", ciudad: "", vendedor: "" });
  const [searchQuery, setSearchQuery] = useState("");

  function onSearch(q: string) { setSearchQuery(q); }
  function onChangeFilter(name: string, value: string) {
    setFilters(f => ({ ...f, [name]: value }));
  }
  
  function handleSelect(clientId: string) {
    if (user?.role === "admin") {
      navigate(`/main/admin/customers/${clientId}`);
    } else {
      navigate(`/main/sales/customers/${clientId}`);
    }
  }
  
  function handleEditNote() { /* ... */ }
  function handleCall() { /* ... */ }

  // Simple logic for filter demo
  function filterClients(source: Cliente[]) {
    let filtered = source;
    if (searchQuery) {
      filtered = filtered.filter(c => c.name.toLowerCase().includes(searchQuery.toLowerCase()));
    }
    if (filters.estado) {
      filtered = filtered.filter(c => c.status === filters.estado);
    }
    if (filters.ciudad) {
      filtered = filtered.filter(c => c.city === filters.ciudad);
    }
    return filtered;
  }

  const adminClients = filterClients(todosClientes);
  const salesClients = filterClients(misClientes);

  return (
    <div className="container max-w-7xl py-8 animate-enter space-y-6">
      <h1 className="text-3xl font-bold">Clientes</h1>
      {loading && <p className="text-sm text-muted-foreground">Cargando clientes…</p>}
      {error && <p className="text-sm text-destructive">{error}</p>}
      <CommonRoleTabs activeTab={activeTab} setActiveTab={setActiveTab} userRole={user?.role ?? "sales"}>
        {{
          admin: (
            <div>
              <ClientListStats
                stats={[
                  { label: "Total clientes", value: adminClients.length },
                  { label: "Activos", value: adminClients.filter(c => c.status === "active").length, color: "#AAF9CC" },
                  { label: "Pendientes", value: adminClients.filter(c => c.status === "pending").length, color: "#DED5F2" }
                ]}
              />
              <ClientListFilters
                onSearch={onSearch}
                filters={filters}
                onChangeFilter={onChangeFilter}
                showAddClient={user?.role === "admin"}
                onAddClient={() => {}}
              />
              <ClientList
                clients={adminClients}
                onSelect={handleSelect}
                onEditNote={handleEditNote}
                onCall={handleCall}
              />
            </div>
          ),
          sales: (
            <div>
              <ClientListStats
                stats={[
                  { label: "Asignados", value: salesClients.length },
                  { label: "Activos", value: salesClients.filter(c => c.status === "active").length, color: "#AAF9CC" },
                  { label: "Pendientes", value: salesClients.filter(c => c.status === "pending").length, color: "#DED5F2" }
                ]}
              />
              <ClientListFilters
                onSearch={onSearch}
                filters={filters}
                onChangeFilter={onChangeFilter}
                showAddClient={false}
              />
              <ClientList
                clients={salesClients}
                onSelect={handleSelect}
                onEditNote={handleEditNote}
                onCall={handleCall}
              />
            </div>
          ),
          client: (
            <div>
              <p className="text-muted-foreground">Vista para clientes. (Oculta en este sistema B2B)</p>
            </div>
          )
        }}
      </CommonRoleTabs>
    </div>
  );
}
