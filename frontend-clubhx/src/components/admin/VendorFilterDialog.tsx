
import React from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { Filter, X } from "lucide-react";

interface VendorFilterDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  filters: {
    region: string;
    status: string;
    performanceRange: string;
  };
  onFiltersChange: (filters: any) => void;
  onApplyFilters: () => void;
  onClearFilters: () => void;
}

export default function VendorFilterDialog({ 
  open, 
  onOpenChange, 
  filters, 
  onFiltersChange, 
  onApplyFilters, 
  onClearFilters 
}: VendorFilterDialogProps) {
  const regions = ["Metropolitana", "Valparaíso", "Bío Bío", "Antofagasta", "O'Higgins"];
  const performanceRanges = [
    { value: "high", label: "Alto rendimiento (>85%)" },
    { value: "medium", label: "Rendimiento medio (65-85%)" },
    { value: "low", label: "Bajo rendimiento (<65%)" }
  ];

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Filter className="h-5 w-5" />
            Filtrar Vendedores
          </DialogTitle>
        </DialogHeader>
        
        <div className="space-y-4">
          <div>
            <Label htmlFor="region">Región</Label>
            <Select 
              value={filters.region} 
              onValueChange={(value) => onFiltersChange({ ...filters, region: value })}
            >
              <SelectTrigger>
                <SelectValue placeholder="Seleccionar región" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todas las regiones</SelectItem>
                {regions.map((region) => (
                  <SelectItem key={region} value={region}>
                    {region}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div>
            <Label htmlFor="status">Estado</Label>
            <Select 
              value={filters.status} 
              onValueChange={(value) => onFiltersChange({ ...filters, status: value })}
            >
              <SelectTrigger>
                <SelectValue placeholder="Seleccionar estado" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todos los estados</SelectItem>
                <SelectItem value="active">Activo</SelectItem>
                <SelectItem value="inactive">Inactivo</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div>
            <Label htmlFor="performance">Rendimiento</Label>
            <Select 
              value={filters.performanceRange} 
              onValueChange={(value) => onFiltersChange({ ...filters, performanceRange: value })}
            >
              <SelectTrigger>
                <SelectValue placeholder="Seleccionar rendimiento" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todos los niveles</SelectItem>
                {performanceRanges.map((range) => (
                  <SelectItem key={range.value} value={range.value}>
                    {range.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>

        <div className="flex justify-between gap-3 pt-4">
          <Button variant="outline" onClick={onClearFilters}>
            <X className="h-4 w-4 mr-2" />
            Limpiar
          </Button>
          <div className="flex gap-2">
            <Button variant="outline" onClick={() => onOpenChange(false)}>
              Cancelar
            </Button>
            <Button onClick={() => { onApplyFilters(); onOpenChange(false); }}>
              Aplicar Filtros
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
