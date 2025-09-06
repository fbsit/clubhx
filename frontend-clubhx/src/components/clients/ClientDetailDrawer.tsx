
import React from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

type Cliente = {
  id: string;
  name: string;
  contact: string;
  phone: string;
  email: string;
  city: string;
  lastOrder: string;
  nextVisit: string;
  status: "active" | "inactive" | "pending";
};

type Pedido = {
  id: string;
  fecha: string;
  resumen: string;
};

type Nota = {
  id: string;
  contenido: string;
  fecha: string;
};

type ClientDetailDrawerProps = {
  client: Cliente;
  historial: Pedido[];
  notas: Nota[];
  onClose: () => void;
  onEdit: () => void;
  onAddNote: () => void;
  onScheduleVisit: () => void;
};

export const ClientDetailDrawer: React.FC<ClientDetailDrawerProps> = ({
  client,
  historial,
  notas,
  onClose,
  onEdit,
  onAddNote,
  onScheduleVisit,
}) => {
  let badgeClass = "bg-green-500";
  let badgeText = "Activo";
  if (client.status === "inactive") {
    badgeClass = "bg-amber-500";
    badgeText = "Inactivo";
  }
  if (client.status === "pending") {
    badgeClass = "bg-purple-500";
    badgeText = "Pendiente";
  }

  return (
    <div className="fixed inset-0 flex justify-end z-40 bg-black/20 animate-fade-in">
      <div className="bg-background w-full max-w-md h-full shadow-xl flex flex-col px-7 py-6 animate-slide-in-right relative">
        {/* Header */}
        <div className="flex items-center justify-between border-b pb-4 mb-5">
          <div>
            <div className="text-xl font-bold">{client.name}</div>
            <Badge className={`${badgeClass} ml-1`}>{badgeText}</Badge>
          </div>
          <div className="flex gap-2">
            <Button variant="outline" size="sm" onClick={onEdit}>Editar</Button>
            <Button variant="ghost" size="icon" onClick={onClose} aria-label="Cerrar">✕</Button>
          </div>
        </div>
        {/* Info principal */}
        <div className="flex flex-col gap-1 mb-6">
          <div><b>Ciudad:</b> {client.city}</div>
          <div><b>Contacto:</b> {client.contact} / {client.email}</div>
          <div><b>Teléfono:</b> {client.phone}</div>
          <div><b>Última compra:</b> {client.lastOrder}</div>
          <div><b>Próxima visita:</b> {client.nextVisit}</div>
        </div>
        {/* Historial */}
        <div className="mb-7">
          <div className="font-medium mb-2">Historial reciente</div>
          <ul className="space-y-1 text-sm">
            {!historial.length && (
              <li className="text-muted-foreground">Sin historial.</li>
            )}
            {historial.map(h => (
              <li key={h.id}>
                <span className="font-medium">{h.fecha}:</span> {h.resumen}
              </li>
            ))}
          </ul>
        </div>
        {/* Notas internas */}
        <div className="mb-7">
          <div className="font-medium mb-2">Notas internas</div>
          <ul className="space-y-1 text-sm max-h-32 overflow-auto">
            {!notas.length && (
              <li className="text-muted-foreground">No hay notas aún.</li>
            )}
            {notas.map(n => (
              <li key={n.id}>
                <span className="font-mono text-xs text-muted-foreground">{n.fecha}:</span> {n.contenido}
              </li>
            ))}
          </ul>
          <Button variant="secondary" size="sm" className="mt-3" onClick={onAddNote}>Agregar nota</Button>
        </div>
        {/* Acciones */}
        <div className="flex gap-3 mt-auto pt-3 border-t">
          <Button variant="outline" onClick={onScheduleVisit}>Agendar visita</Button>
          <Button>Nuevo pedido</Button>
        </div>
      </div>
    </div>
  );
};
