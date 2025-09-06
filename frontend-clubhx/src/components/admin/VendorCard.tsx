
import React from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { ChevronDown, ChevronRight, Target } from "lucide-react";

interface Vendor {
  id: string;
  name: string;
  email: string;
  region: string;
  customers: number;
  totalSales: number;
  salesTarget: number;
  targetCompletion: number;
  status: string;
  avatar: string;
}

interface VendorCardProps {
  vendor: Vendor;
  isExpanded: boolean;
  onToggleExpand: (vendorId: string) => void;
  onVendorClick: (vendorId: string) => void;
  onSetGoal?: (vendor: Vendor) => void;
}

export default function VendorCard({ vendor, isExpanded, onToggleExpand, onVendorClick, onSetGoal }: VendorCardProps) {
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('es-CL', {
      style: 'currency',
      currency: 'CLP'
    }).format(amount);
  };

  return (
    <Card className="overflow-hidden">
      <div 
        className="flex items-center justify-between p-4 cursor-pointer"
        onClick={() => onToggleExpand(vendor.id)}
      >
        <div className="flex items-center gap-3">
          <Avatar>
            <AvatarImage src={vendor.avatar} alt={vendor.name} />
            <AvatarFallback>{vendor.name.substring(0, 2)}</AvatarFallback>
          </Avatar>
          <div>
            <p className="font-medium">{vendor.name}</p>
            <p className="text-xs text-muted-foreground">{vendor.region}</p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <Badge className={vendor.status === "active" ? "bg-green-500" : "bg-amber-500"}>
            {vendor.status === "active" ? "Activo" : "Inactivo"}
          </Badge>
          {isExpanded ? 
            <ChevronDown className="h-5 w-5 text-muted-foreground" /> : 
            <ChevronRight className="h-5 w-5 text-muted-foreground" />
          }
        </div>
      </div>

      {isExpanded && (
        <div className="px-4 pb-4 pt-1 space-y-3 border-t">
          <div>
            <p className="text-xs text-muted-foreground">Email</p>
            <p className="text-sm">{vendor.email}</p>
          </div>
          
          <div className="grid grid-cols-2 gap-2">
            <div>
              <p className="text-xs text-muted-foreground">Clientes</p>
              <p className="text-sm font-medium">{vendor.customers}</p>
            </div>
            <div>
              <p className="text-xs text-muted-foreground">Avance Meta</p>
              <div className="flex items-center gap-2">
                <div className="w-12 bg-muted rounded-full h-2">
                  <div 
                    className="bg-primary h-2 rounded-full" 
                    style={{ width: `${vendor.targetCompletion}%` }}
                  ></div>
                </div>
                <span className="text-sm font-medium">{vendor.targetCompletion}%</span>
              </div>
            </div>
          </div>
          
          <div className="space-y-2">
            <p className="text-xs text-muted-foreground">Ventas</p>
            <p className="text-sm font-medium">{formatCurrency(vendor.totalSales)}</p>
            
            <p className="text-xs text-muted-foreground">Meta</p>
            <p className="text-sm font-medium">{formatCurrency(vendor.salesTarget)}</p>
          </div>
          
          <div className="pt-2 flex justify-between gap-2">
            {onSetGoal && (
              <Button 
                variant="outline" 
                size="sm"
                onClick={(e) => {
                  e.stopPropagation();
                  onSetGoal(vendor);
                }}
              >
                <Target className="h-4 w-4 mr-1" />
                Meta
              </Button>
            )}
            <Button 
              variant="outline" 
              size="sm"
              onClick={(e) => {
                e.stopPropagation();
                onVendorClick(vendor.id);
              }}
            >
              Ver Detalles
            </Button>
          </div>
        </div>
      )}
    </Card>
  );
}
