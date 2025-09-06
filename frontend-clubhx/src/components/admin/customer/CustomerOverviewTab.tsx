
import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { 
  Phone, 
  Mail, 
  MapPin, 
  Calendar, 
  TrendingUp,
  Clock,
  Users
} from "lucide-react";

interface CustomerOverviewTabProps {
  customerData: any;
}

export const CustomerOverviewTab: React.FC<CustomerOverviewTabProps> = ({
  customerData,
}) => {
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat('es-CL', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    }).format(date);
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('es-CL', {
      style: 'currency',
      currency: 'CLP'
    }).format(amount);
  };

  return (
    <div className="grid gap-6 md:grid-cols-2">
      <Card>
        <CardHeader>
          <CardTitle>Información Comercial</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex items-start gap-3">
              <Calendar className="h-5 w-5 text-muted-foreground mt-0.5" />
              <div>
                <p className="font-medium">Cliente desde</p>
                <p className="text-muted-foreground">{formatDate(customerData.registrationDate)}</p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <TrendingUp className="h-5 w-5 text-muted-foreground mt-0.5" />
              <div>
                <p className="font-medium">Límite de Crédito</p>
                <p className="text-muted-foreground">{formatCurrency(customerData.creditLimit)}</p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <Clock className="h-5 w-5 text-muted-foreground mt-0.5" />
              <div>
                <p className="font-medium">Términos de Pago</p>
                <p className="text-muted-foreground">{customerData.paymentTerms}</p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <Users className="h-5 w-5 text-muted-foreground mt-0.5" />
              <div>
                <p className="font-medium">Vendedor Asignado</p>
                <p className="text-muted-foreground">{customerData.assignedVendor}</p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
      
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
                <p className="text-muted-foreground">{customerData.phone}</p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <Mail className="h-5 w-5 text-muted-foreground mt-0.5" />
              <div>
                <p className="font-medium">Correo Electrónico</p>
                <p className="text-muted-foreground">{customerData.email}</p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <MapPin className="h-5 w-5 text-muted-foreground mt-0.5" />
              <div>
                <p className="font-medium">Dirección</p>
                <p className="text-muted-foreground">{customerData.address}</p>
                <p className="text-muted-foreground">{customerData.city}, {customerData.region}, {customerData.zipCode}</p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
