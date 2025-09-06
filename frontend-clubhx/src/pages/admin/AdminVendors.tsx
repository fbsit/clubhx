import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useIsMobile } from "@/hooks/use-mobile";
import { listVendors, setBulkVendorGoals, setVendorGoal, Vendor } from "@/services/vendorsApi";
import VendorSearch from "@/components/admin/VendorSearch";
import VendorTable from "@/components/admin/VendorTable";
import VendorCard from "@/components/admin/VendorCard";
import SetSalesGoalDialog from "@/components/admin/SetSalesGoalDialog";
import BulkSalesGoalDialog from "@/components/admin/BulkSalesGoalDialog";
import VendorCategoryProgress from "@/components/admin/VendorCategoryProgress";
import { Target, Users } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { toast } from "sonner";
const vendorGoals: any[] = [];

export default function AdminVendors() {
  const [searchQuery, setSearchQuery] = useState("");
  const [vendors, setVendors] = useState<Vendor[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [filteredVendors, setFilteredVendors] = useState<Vendor[]>([]);
  const [expandedVendors, setExpandedVendors] = useState<string[]>([]);
  const [selectedVendor, setSelectedVendor] = useState<any>(null);
  const [showGoalDialog, setShowGoalDialog] = useState(false);
  const [showBulkGoalDialog, setShowBulkGoalDialog] = useState(false);
  const [activeFilters, setActiveFilters] = useState({
    region: "all",
    status: "all",
    performanceRange: "all"
  });
  const isMobile = useIsMobile();
  const navigate = useNavigate();
  const { toast } = useToast();

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        setLoading(true);
        setError(null);
        const data = await listVendors();
        if (!cancelled) {
          setVendors(data);
          setFilteredVendors(data);
        }
      } catch (e: any) {
        if (!cancelled) setError(e?.message || "Error cargando vendedores");
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();
    return () => { cancelled = true; };
  }, []);

  const handleSearch = () => {
    applyFiltersAndSearch();
  };

  const applyFiltersAndSearch = () => {
    let filtered = vendors.filter(vendor => {
      // Filtro de búsqueda por texto
      const matchesSearch = searchQuery === "" || 
        vendor.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
        vendor.email.toLowerCase().includes(searchQuery.toLowerCase()) || 
        vendor.region.toLowerCase().includes(searchQuery.toLowerCase());

      // Filtro por región
      const matchesRegion = activeFilters.region === "all" || vendor.region === activeFilters.region;

      // Filtro por estado
      const matchesStatus = activeFilters.status === "all" || vendor.status === activeFilters.status;

      // Filtro por rendimiento
      let matchesPerformance = true;
      if (activeFilters.performanceRange !== "all") {
        if (activeFilters.performanceRange === "high" && vendor.targetCompletion <= 85) {
          matchesPerformance = false;
        } else if (activeFilters.performanceRange === "medium" && (vendor.targetCompletion < 65 || vendor.targetCompletion > 85)) {
          matchesPerformance = false;
        } else if (activeFilters.performanceRange === "low" && vendor.targetCompletion >= 65) {
          matchesPerformance = false;
        }
      }

      return matchesSearch && matchesRegion && matchesStatus && matchesPerformance;
    });

    setFilteredVendors(filtered);
  };

  const handleFilter = (filters: any) => {
    setActiveFilters(filters);
    // Aplicar filtros inmediatamente
    setTimeout(() => {
      applyFiltersAndSearch();
    }, 0);
  };

  const handleExport = () => {
    console.log("Exportando datos de vendedores:", filteredVendors);
    
    // Crear datos CSV
    const csvData = filteredVendors.map(vendor => ({
      ID: vendor.id,
      Nombre: vendor.name,
      Email: vendor.email,
      Región: vendor.region,
      Clientes: vendor.customers,
      "Ventas Totales": vendor.totalSales,
      "Meta de Ventas": vendor.salesTarget,
      "% Completado": vendor.targetCompletion,
      Estado: vendor.status === "active" ? "Activo" : "Inactivo"
    }));

    // Simular descarga de archivo
    const csvContent = [
      Object.keys(csvData[0]).join(","),
      ...csvData.map(row => Object.values(row).join(","))
    ].join("\n");

    const blob = new Blob([csvContent], { type: "text/csv" });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "vendedores.csv";
    a.click();
    window.URL.revokeObjectURL(url);

    toast({
      title: "Exportación completada",
      description: `Se han exportado ${filteredVendors.length} vendedores`,
    });
  };

  const toggleExpand = (vendorId: string) => {
    setExpandedVendors(prev => 
      prev.includes(vendorId) 
        ? prev.filter(id => id !== vendorId) 
        : [...prev, vendorId]
    );
  };

  const isExpanded = (vendorId: string) => expandedVendors.includes(vendorId);

  const handleVendorClick = (vendorId: string) => {
    navigate(`/main/admin/vendors/${vendorId}`);
  };

  const handleSetGoal = (vendor: any) => {
    setSelectedVendor(vendor);
    setShowGoalDialog(true);
  };

  const handleSaveGoal = async (goalData: { period: string; salesTarget: number }) => {
    if (!selectedVendor) return;
    try {
      await setVendorGoal(selectedVendor.id, goalData);
      toast.success(`Meta asignada a ${selectedVendor.name}`);
    } catch (e: any) {
      toast.error(e?.message || "No se pudo asignar la meta");
    }
  };

  const handleSaveBulkGoal = async (goalData: { vendorIds: string[]; period: string; salesTarget: number }) => {
    try {
      await setBulkVendorGoals(goalData);
      toast.success(`Metas asignadas a ${goalData.vendorIds.length} vendedores`);
    } catch (e: any) {
      toast.error(e?.message || "No se pudieron asignar las metas");
    }
  };

  return (
    <div className="container max-w-7xl py-6 animate-enter space-y-6">
      {/* Mobile Layout */}
      {loading && <div className="text-sm text-muted-foreground">Cargando…</div>}
      {error && <div className="text-sm text-red-600">{error}</div>}
      {isMobile ? (
        <div className="space-y-4">
          <h1 className="text-3xl font-bold">Gestión de Vendedores</h1>
          <Button 
            onClick={() => setShowBulkGoalDialog(true)}
            className="w-full"
          >
            <Users className="h-4 w-4 mr-2" />
            Asignar Meta Masiva
          </Button>
        </div>
      ) : (
        /* Desktop Layout */
        <div className="flex items-center justify-between">
          <h1 className="text-3xl font-bold">Gestión de Vendedores</h1>
          <div className="flex gap-3">
            <Button onClick={() => setShowBulkGoalDialog(true)}>
              <Users className="h-4 w-4 mr-2" />
              Asignar Meta Masiva
            </Button>
          </div>
        </div>
      )}

      {/* Category Progress Overview */}
      <VendorCategoryProgress goals={vendorGoals} />

      {/* Vendor Grid/Table */}
      <VendorSearch
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        onSearch={applyFiltersAndSearch}
        onFilter={handleFilter}
        onExport={handleExport}
      />

      {isMobile ? (
        <div className="space-y-4">
          {filteredVendors.map((vendor) => (
            <VendorCard
              key={vendor.id}
              vendor={vendor}
              isExpanded={isExpanded(vendor.id)}
              onToggleExpand={toggleExpand}
              onVendorClick={handleVendorClick}
              onSetGoal={handleSetGoal}
            />
          ))}
        </div>
      ) : (
        <Card>
          <CardHeader>
            <CardTitle>Lista de Vendedores</CardTitle>
            <CardDescription>
              Gestiona la información y metas de los vendedores del equipo
            </CardDescription>
          </CardHeader>
          <CardContent>
            <VendorTable
              vendors={filteredVendors}
              onVendorClick={handleVendorClick}
              onSetGoal={handleSetGoal}
            />
          </CardContent>
        </Card>
      )}

      {/* Dialogs */}
      <SetSalesGoalDialog
        open={showGoalDialog}
        onOpenChange={setShowGoalDialog}
        vendor={selectedVendor}
        onSave={handleSaveGoal}
      />

      <BulkSalesGoalDialog
        open={showBulkGoalDialog}
        onOpenChange={setShowBulkGoalDialog}
        vendors={vendors}
        onSave={handleSaveBulkGoal}
      />
    </div>
  );
}
