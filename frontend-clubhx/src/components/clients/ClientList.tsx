
import React from "react";
import { ClientCard, Cliente } from "./ClientCard";
import { useAuth } from "@/contexts/AuthContext";

type ClientListProps = {
  clients: Cliente[];
  onSelect: (clientId: string) => void;
  onEditNote: (clientId: string) => void;
  onCall: (clientId: string) => void;
};

export const ClientList: React.FC<ClientListProps> = ({
  clients,
  onSelect,
  onEditNote,
  onCall,
}) => {
  const { user } = useAuth();

  if (!clients.length) {
    return (
      <div className="text-center py-14 text-muted-foreground animate-fade-in">
        <p className="text-lg font-semibold mb-4">No tienes clientes asignados.</p>
        <p>Cuando registres nuevos clientes aquí aparecerán.</p>
      </div>
    );
  }

  return (
    <div className="divide-y rounded-xl border bg-white shadow-sm overflow-hidden animate-fade-in">
      {clients.map((client) => (
        <ClientCard
          key={client.id}
          client={client}
          onSelect={() => onSelect(client.id)}
          onEditNote={() => onEditNote(client.id)}
          onCall={() => onCall(client.id)}
          userRole={user?.role}
        />
      ))}
    </div>
  );
};
