
import React from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";

interface VendorTopClientsProps {
  topClients: Array<{
    name: string;
    totalSpent: number;
    lastOrder: string;
  }>;
}

export default function VendorTopClients({ topClients }: VendorTopClientsProps) {
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('es-CL', {
      style: 'currency',
      currency: 'CLP'
    }).format(amount);
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Mejores Clientes</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {topClients.map((client, index) => (
            <div key={client.name} className="flex items-center justify-between p-3 border rounded-lg">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 bg-primary/10 rounded-full flex items-center justify-center">
                  <span className="text-sm font-bold text-primary">#{index + 1}</span>
                </div>
                <div>
                  <p className="font-medium">{client.name}</p>
                  <p className="text-sm text-muted-foreground">Último pedido: {client.lastOrder}</p>
                </div>
              </div>
              <div className="text-right">
                <p className="font-bold">{formatCurrency(client.totalSpent)}</p>
                <p className="text-xs text-muted-foreground">Total gastado</p>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
