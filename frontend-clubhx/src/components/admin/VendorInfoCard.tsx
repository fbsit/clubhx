
import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Mail, Phone, MapPin } from "lucide-react";

interface VendorInfoCardProps {
  vendor: {
    id: string;
    name: string;
    email: string;
    phone: string;
    region: string;
    status: string;
    avatar: string;
    assignedClients: Array<{
      id: string;
      name: string;
    }>;
  };
}

export default function VendorInfoCard({ vendor }: VendorInfoCardProps) {
  return (
    <Card>
      <CardContent className="p-6">
        <div className="flex items-start gap-6">
          <Avatar className="h-24 w-24">
            <AvatarImage src={vendor.avatar} alt={vendor.name} />
            <AvatarFallback className="text-2xl">{vendor.name.substring(0, 2)}</AvatarFallback>
          </Avatar>
          
          <div className="flex-1">
            <div className="flex items-center gap-3 mb-2">
              <h2 className="text-2xl font-bold">{vendor.name}</h2>
              <Badge className={vendor.status === "active" ? "bg-green-500" : "bg-amber-500"}>
                {vendor.status === "active" ? "Activo" : "Inactivo"}
              </Badge>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="flex items-center gap-2 text-muted-foreground">
                <Mail className="h-4 w-4" />
                <span>{vendor.email}</span>
              </div>
              <div className="flex items-center gap-2 text-muted-foreground">
                <Phone className="h-4 w-4" />
                <span>{vendor.phone}</span>
              </div>
              <div className="flex items-center gap-2 text-muted-foreground">
                <MapPin className="h-4 w-4" />
                <span>{vendor.region}</span>
              </div>
            </div>
            
            <div className="mt-4">
              <p className="text-sm text-muted-foreground mb-2">Clientes asignados ({vendor.assignedClients.length}):</p>
              <div className="flex flex-wrap gap-2">
                {vendor.assignedClients.slice(0, 5).map((client) => (
                  <Badge key={client.id} variant="outline" className="text-xs">{client.name}</Badge>
                ))}
                {vendor.assignedClients.length > 5 && (
                  <Badge variant="outline" className="text-xs">+{vendor.assignedClients.length - 5} más</Badge>
                )}
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
