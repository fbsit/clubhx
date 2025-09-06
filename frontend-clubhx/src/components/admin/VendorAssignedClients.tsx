
import React from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";

interface VendorAssignedClientsProps {
  assignedClients: Array<{
    id: string;
    name: string;
    contact: string;
    phone: string;
    lastOrder: string;
  }>;
}

export default function VendorAssignedClients({ assignedClients }: VendorAssignedClientsProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Clientes Asignados</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {assignedClients.map((client) => (
            <div key={client.id} className="flex items-center justify-between p-3 border rounded-lg">
              <div>
                <p className="font-medium">{client.name}</p>
                <p className="text-sm text-muted-foreground">{client.contact}</p>
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
  );
}
