
import React from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { ArrowLeft, Edit, UserCheck, Users } from "lucide-react";
import { useIsMobile } from "@/hooks/use-mobile";
import { EditCreditLimitDialog } from "@/components/admin/EditCreditLimitDialog";

interface CustomerProfileHeaderProps {
  customerData: any;
  onEditCustomer: () => void;
  onChangeStatus: () => void;
  onChangeVendor: () => void;
  onCreditLimitUpdate: (newLimit: number) => void;
}

export const CustomerProfileHeader: React.FC<CustomerProfileHeaderProps> = ({
  customerData,
  onEditCustomer,
  onChangeStatus,
  onChangeVendor,
  onCreditLimitUpdate,
}) => {
  const isMobile = useIsMobile();

  return (
    <>
      <div className="flex items-center gap-2 mb-6">
        <Button asChild variant="ghost" size="sm">
          <Link to="/main/admin/customers">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Volver a Clientes
          </Link>
        </Button>
      </div>
      
      <div className="bg-card border rounded-lg p-4 md:p-6 mb-6 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <Avatar className={`${isMobile ? 'h-12 w-12' : 'h-16 w-16'}`}>
            <AvatarImage src={customerData.profileImage} alt={customerData.name} />
            <AvatarFallback>{customerData.name.substring(0, 2)}</AvatarFallback>
          </Avatar>
          <div>
            <div className="flex items-center gap-2 flex-wrap">
              <h1 className={`${isMobile ? 'text-xl' : 'text-2xl'} font-bold`}>{customerData.name}</h1>
              <Badge className={
                customerData.status === "active" ? "bg-green-500" : 
                customerData.status === "inactive" ? "bg-amber-500" : "bg-purple-500"
              }>
                {customerData.status === "active" ? "Activo" : 
                customerData.status === "inactive" ? "Inactivo" : "Pendiente"}
              </Badge>
            </div>
            <p className="text-muted-foreground">{customerData.contact}</p>
            <p className="text-sm text-muted-foreground">Vendedor asignado: {customerData.assignedVendor}</p>
          </div>
        </div>
        <div className="flex flex-wrap gap-2">
          <EditCreditLimitDialog
            currentLimit={customerData.creditLimit}
            customerName={customerData.name}
            onSave={onCreditLimitUpdate}
          />
          {!isMobile && (
            <>
              <Button size="sm" variant="outline" onClick={onChangeStatus}>
                <UserCheck className="mr-2 h-4 w-4" />
                Cambiar Estado
              </Button>
              <Button size="sm" variant="outline" onClick={onChangeVendor}>
                <Users className="mr-2 h-4 w-4" />
                Cambiar Vendedor
              </Button>
            </>
          )}
          <Button size="sm" variant="default" onClick={onEditCustomer}>
            <Edit className="mr-2 h-4 w-4" />
            Editar Cliente
          </Button>
        </div>
      </div>
    </>
  );
};
