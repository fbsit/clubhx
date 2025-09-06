
import React, { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Search, Download, Filter } from "lucide-react";
import VendorFilterDialog from "./VendorFilterDialog";
import { useToast } from "@/hooks/use-toast";

interface VendorSearchProps {
  searchQuery: string;
  onSearchChange: (value: string) => void;
  onSearch: () => void;
  onFilter?: (filters: any) => void;
  onExport?: () => void;
}

export default function VendorSearch({ 
  searchQuery, 
  onSearchChange, 
  onSearch, 
  onFilter,
  onExport
}: VendorSearchProps) {
  const [showFilterDialog, setShowFilterDialog] = useState(false);
  const [filters, setFilters] = useState({
    region: "all",
    status: "all",
    performanceRange: "all"
  });
  const { toast } = useToast();

  const handleApplyFilters = () => {
    console.log("Aplicando filtros:", filters);
    if (onFilter) {
      onFilter(filters);
    }
    toast({
      title: "Filtros aplicados",
      description: "Los filtros se han aplicado correctamente",
    });
  };

  const handleClearFilters = () => {
    const clearedFilters = {
      region: "all",
      status: "all",
      performanceRange: "all"
    };
    setFilters(clearedFilters);
    if (onFilter) {
      onFilter(clearedFilters);
    }
    toast({
      title: "Filtros limpiados",
      description: "Se han eliminado todos los filtros",
    });
  };

  const handleExport = () => {
    console.log("Exportando datos de vendedores...");
    if (onExport) {
      onExport();
    } else {
      // Funcionalidad de exportación por defecto
      toast({
        title: "Exportando datos",
        description: "La exportación comenzará en breve...",
      });
      
      // Simular exportación
      setTimeout(() => {
        toast({
          title: "Exportación completada",
          description: "Los datos se han exportado correctamente",
        });
      }, 2000);
    }
  };

  return (
    <>
      <div className="flex flex-wrap items-center gap-3">
        <div className="flex flex-1 items-center gap-2">
          <Input
            placeholder="Buscar vendedores..."
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            className="md:w-80"
          />
          <Button variant="outline" size="icon" onClick={onSearch}>
            <Search className="h-4 w-4" />
          </Button>
        </div>
        <div className="flex items-center gap-2 ml-auto">
          <Button 
            variant="outline" 
            size="sm"
            onClick={() => setShowFilterDialog(true)}
          >
            <Filter className="h-4 w-4 mr-2" />
            Filtrar
          </Button>
          <Button 
            variant="outline" 
            size="sm"
            onClick={handleExport}
          >
            <Download className="h-4 w-4 mr-2" />
            Exportar
          </Button>
        </div>
      </div>

      <VendorFilterDialog
        open={showFilterDialog}
        onOpenChange={setShowFilterDialog}
        filters={filters}
        onFiltersChange={setFilters}
        onApplyFilters={handleApplyFilters}
        onClearFilters={handleClearFilters}
      />
    </>
  );
}
