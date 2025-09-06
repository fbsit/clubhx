
import React from "react";
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { 
  Phone, 
  Mail, 
  MapPin, 
  Calendar, 
  Clock,
  FileText
} from "lucide-react";

interface Customer {
  phone: string;
  email: string;
  address: string;
  city: string;
  region: string;
  zipCode: string;
  nextVisit: string;
}

interface CustomerOverviewTabProps {
  customer: Customer;
}

export const CustomerOverviewTab: React.FC<CustomerOverviewTabProps> = ({
  customer,
}) => {
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat('es-CL', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    }).format(date);
  };

  return (
    <div className="grid gap-6 md:grid-cols-2">
      <Card>
        <CardHeader>
          <CardTitle>Información de Contacto</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex items-start gap-3">
              <Phone className="h-5 w-5 text-muted-foreground mt-0.5" />
              <div>
                <p className="font-medium">Teléfono</p>
                <p className="text-muted-foreground">{customer.phone}</p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <Mail className="h-5 w-5 text-muted-foreground mt-0.5" />
              <div>
                <p className="font-medium">Correo Electrónico</p>
                <p className="text-muted-foreground">{customer.email}</p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <MapPin className="h-5 w-5 text-muted-foreground mt-0.5" />
              <div>
                <p className="font-medium">Dirección</p>
                <p className="text-muted-foreground">{customer.address}</p>
                <p className="text-muted-foreground">{customer.city}, {customer.region}, {customer.zipCode}</p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
      
      <Card>
        <CardHeader>
          <CardTitle>Próximas Actividades</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex justify-between items-center border-b pb-4">
              <div className="flex items-center gap-3">
                <div className="bg-primary/10 rounded-full p-2">
                  <Calendar className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <p className="font-medium">Próxima Visita</p>
                  <p className="text-muted-foreground">{formatDate(customer.nextVisit)}</p>
                </div>
              </div>
              <Badge variant="outline" className="whitespace-nowrap">En 10 días</Badge>
            </div>
            <div className="flex justify-between items-center border-b pb-4">
              <div className="flex items-center gap-3">
                <div className="bg-primary/10 rounded-full p-2">
                  <Clock className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <p className="font-medium">Seguimiento de Capacitación</p>
                  <p className="text-muted-foreground">22 de Mayo, 2023</p>
                </div>
              </div>
              <Badge variant="outline" className="whitespace-nowrap">En 17 días</Badge>
            </div>
            <div className="flex justify-between items-center">
              <div className="flex items-center gap-3">
                <div className="bg-primary/10 rounded-full p-2">
                  <FileText className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <p className="font-medium">Renovación de Contrato</p>
                  <p className="text-muted-foreground">30 de Mayo, 2023</p>
                </div>
              </div>
              <Badge variant="outline" className="whitespace-nowrap">En 25 días</Badge>
            </div>
          </div>
        </CardContent>
        <CardFooter>
          <Button variant="outline" size="sm" className="w-full">
            <Calendar className="h-4 w-4 mr-2" />
            Agendar Nueva Actividad
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
};
