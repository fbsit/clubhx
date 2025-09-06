
import React from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { 
  Phone, 
  Mail, 
  Calendar,
  ArrowLeft,
  CreditCard
} from "lucide-react";

interface Customer {
  id: string;
  name: string;
  contact: string;
  phone: string;
  email: string;
  status: string;
  creditLimit: number;
  outstandingBalance: number;
  profileImage: string;
}

interface CustomerProfileHeaderProps {
  customer: Customer;
  onScheduleVisit: () => void;
  onCreditLimitRequest: () => void;
}

export const CustomerProfileHeader: React.FC<CustomerProfileHeaderProps> = ({
  customer,
  onScheduleVisit,
  onCreditLimitRequest,
}) => {
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('es-CL', {
      style: 'currency',
      currency: 'CLP'
    }).format(amount);
  };

  const availableCredit = customer.creditLimit - customer.outstandingBalance;
  const creditUsagePercentage = (customer.outstandingBalance / customer.creditLimit) * 100;

  return (
    <>
      <div className="flex items-center gap-2 mb-6">
        <Button asChild variant="ghost" size="sm">
          <Link to="/main/sales/customers">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Volver a Clientes
          </Link>
        </Button>
      </div>
      
      <div className="bg-white border rounded-lg p-6 mb-6">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-4">
          <div className="flex items-center gap-4">
            <Avatar className="h-16 w-16">
              <AvatarImage src={customer.profileImage} alt={customer.name} />
              <AvatarFallback>{customer.name.substring(0, 2)}</AvatarFallback>
            </Avatar>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-2xl font-bold">{customer.name}</h1>
                <Badge className={
                  customer.status === "active" ? "bg-green-500" : 
                  customer.status === "inactive" ? "bg-amber-500" : "bg-purple-500"
                }>
                  {customer.status === "active" ? "Activo" : 
                  customer.status === "inactive" ? "Inactivo" : "Pendiente"}
                </Badge>
              </div>
              <p className="text-muted-foreground">{customer.contact}</p>
            </div>
          </div>
          <div className="flex flex-wrap gap-2">
            <Button size="sm" variant="outline">
              <Phone className="mr-2 h-4 w-4" />
              Llamar
            </Button>
            <Button size="sm" variant="outline">
              <Mail className="mr-2 h-4 w-4" />
              Email
            </Button>
            <Button size="sm" variant="outline" onClick={onCreditLimitRequest}>
              <CreditCard className="mr-2 h-4 w-4" />
              Solicitar Límite
            </Button>
            <Button size="sm" variant="default" onClick={onScheduleVisit}>
              <Calendar className="mr-2 h-4 w-4" />
              Programar Visita
            </Button>
          </div>
        </div>
        
        {/* Credit Information Section */}
        <div className="grid gap-4 md:grid-cols-3 border-t pt-4">
          <div>
            <p className="text-sm text-muted-foreground">Límite de Crédito</p>
            <p className="text-xl font-semibold">{formatCurrency(customer.creditLimit)}</p>
          </div>
          <div>
            <p className="text-sm text-muted-foreground">Saldo Pendiente</p>
            <p className="text-xl font-semibold">{formatCurrency(customer.outstandingBalance)}</p>
          </div>
          <div>
            <p className="text-sm text-muted-foreground">Crédito Disponible</p>
            <p className="text-xl font-semibold text-green-600">{formatCurrency(availableCredit)}</p>
          </div>
        </div>
        
        <div className="mt-4">
          <div className="flex justify-between items-center mb-2">
            <span className="text-sm text-muted-foreground">Uso del Crédito</span>
            <span className="text-sm font-medium">{creditUsagePercentage.toFixed(1)}%</span>
          </div>
          <Progress value={creditUsagePercentage} className="h-2" />
        </div>
      </div>
    </>
  );
};
