
import React from "react";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Edit, Target } from "lucide-react";

interface VendorProfileHeaderProps {
  vendor: {
    id: string;
    name: string;
  };
  onBack: () => void;
  onEditVendor: () => void;
  onSetGoal: () => void;
}

export default function VendorProfileHeader({ vendor, onBack, onEditVendor, onSetGoal }: VendorProfileHeaderProps) {
  return (
    <div className="flex items-center justify-between">
      <div className="flex items-center gap-4">
        <Button variant="outline" size="icon" onClick={onBack}>
          <ArrowLeft className="h-4 w-4" />
        </Button>
        <div>
          <h1 className="text-3xl font-bold">Perfil del Vendedor</h1>
          <p className="text-muted-foreground">ID: {vendor.id}</p>
        </div>
      </div>
      <div className="flex gap-3">
        <Button variant="outline" onClick={onSetGoal}>
          <Target className="h-4 w-4 mr-2" />
          Asignar Meta
        </Button>
        <Button onClick={onEditVendor}>
          <Edit className="h-4 w-4 mr-2" />
          Editar Vendedor
        </Button>
      </div>
    </div>
  );
}
