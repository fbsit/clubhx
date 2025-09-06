
import React from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { 
  Phone, 
  Mail, 
  ShoppingCart, 
  Users,
  History
} from "lucide-react";

interface CustomerActivityTabProps {
  customerData: any;
}

export const CustomerActivityTab: React.FC<CustomerActivityTabProps> = ({
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

  const getActivityIcon = (type: string) => {
    switch (type) {
      case "visit": return <Users className="h-4 w-4" />;
      case "call": return <Phone className="h-4 w-4" />;
      case "email": return <Mail className="h-4 w-4" />;
      case "order": return <ShoppingCart className="h-4 w-4" />;
      default: return <History className="h-4 w-4" />;
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Historial de Actividades</CardTitle>
        <CardDescription>
          Registro de interacciones con {customerData.name}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-8">
          {customerData.activities.map((activity: any, index: number) => (
            <div key={index} className="flex gap-4">
              <div className="mt-1">
                <div className="bg-primary/10 rounded-full p-2">
                  {getActivityIcon(activity.type)}
                </div>
              </div>
              <div className="space-y-1 flex-1">
                <div className="flex items-center justify-between">
                  <p className="font-medium">{activity.description}</p>
                  <Badge variant="outline">{formatDate(activity.date)}</Badge>
                </div>
                <p className="text-sm text-muted-foreground">{activity.notes}</p>
                {index < customerData.activities.length - 1 && (
                  <div className="pt-4 pb-0">
                    <div className="border-b border-dashed"></div>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};
