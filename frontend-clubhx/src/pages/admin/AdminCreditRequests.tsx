
import React, { useState, useMemo, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { CreditRequestCard } from "@/components/admin/credit/CreditRequestCard";
import { CreditRequestDetailDialog } from "@/components/admin/credit/CreditRequestDetailDialog";
import { CreditRequestFilters } from "@/components/admin/credit/CreditRequestFilters";
import { CreditLimitRequest, listCreditRequests, approveCreditRequest, rejectCreditRequest } from "@/services/creditRequestsApi";
import { Download, FileText } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

export default function AdminCreditRequests() {
  const [requests, setRequests] = useState<CreditLimitRequest[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        setLoading(true);
        setError(null);
        const data = await listCreditRequests();
        if (!cancelled) setRequests(data);
      } catch (e: any) {
        if (!cancelled) setError(e?.message || "Error cargando solicitudes");
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();
    return () => { cancelled = true; };
  }, []);
  const [selectedRequest, setSelectedRequest] = useState<CreditLimitRequest | null>(null);
  const [isDetailDialogOpen, setIsDetailDialogOpen] = useState(false);
  
  // Filter states
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [vendorFilter, setVendorFilter] = useState("all");

  const { toast } = useToast();

  // Filter requests based on current filters
  const filteredRequests = useMemo(() => {
    return requests.filter(request => {
      const matchesSearch = searchQuery === '' || 
        request.customerName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        request.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
        request.requestedByName.toLowerCase().includes(searchQuery.toLowerCase());
      
      const matchesStatus = statusFilter === 'all' || request.status === statusFilter;
      const matchesVendor = vendorFilter === 'all' || request.requestedBy === vendorFilter;
      
      return matchesSearch && matchesStatus && matchesVendor;
    });
  }, [requests, searchQuery, statusFilter, vendorFilter]);

  // Calculate counts for filters
  const pendingCount = requests.filter(r => r.status === 'pending').length;
  const approvedCount = requests.filter(r => r.status === 'approved').length;
  const rejectedCount = requests.filter(r => r.status === 'rejected').length;

  const handleViewDetails = (request: CreditLimitRequest) => {
    setSelectedRequest(request);
    setIsDetailDialogOpen(true);
  };

  const handleApprove = async (request: CreditLimitRequest, notes?: string) => {
    try {
      const updated = await approveCreditRequest(request.id, notes);
      setRequests(prev => prev.map(r => r.id === updated.id ? updated : r));
    } catch (e: any) {
      toast({ title: "Error", description: e?.message || "No se pudo aprobar" });
    }
  };

  const handleReject = async (request: CreditLimitRequest, notes?: string) => {
    try {
      const updated = await rejectCreditRequest(request.id, notes);
      setRequests(prev => prev.map(r => r.id === updated.id ? updated : r));
    } catch (e: any) {
      toast({ title: "Error", description: e?.message || "No se pudo rechazar" });
    }
  };

  const handleClearFilters = () => {
    setSearchQuery("");
    setStatusFilter("all");
    setVendorFilter("all");
  };

  const handleExportRequests = () => {
    toast({
      title: "Exportación iniciada",
      description: "Se está preparando el archivo de exportación...",
    });
  };

  return (
    <div className="container max-w-7xl py-6 animate-enter space-y-6 px-3 sm:px-6">
      {/* Header - Responsive layout */}
      <div className="flex flex-col gap-4 sm:flex-row sm:justify-between sm:items-start">
        <div className="flex-1 min-w-0">
          <h1 className="text-2xl sm:text-3xl font-bold break-words">
            Solicitudes de Límite de Crédito
          </h1>
          <p className="text-muted-foreground mt-1 text-sm sm:text-base break-words">
            Gestione las solicitudes de aumento de límite de crédito de los clientes
          </p>
        </div>
        <div className="flex gap-2 flex-shrink-0">
          <Button variant="outline" size="sm" onClick={handleExportRequests} className="text-xs sm:text-sm">
            <Download className="h-4 w-4 mr-1 sm:mr-2" />
            <span className="hidden xs:inline">Exportar</span>
            <span className="xs:hidden">Export</span>
          </Button>
          <Button variant="outline" size="sm" className="text-xs sm:text-sm">
            <FileText className="h-4 w-4 mr-1 sm:mr-2" />
            <span className="hidden xs:inline">Reporte</span>
            <span className="xs:hidden">Report</span>
          </Button>
        </div>
      </div>

      {/* Filters */}
      <CreditRequestFilters
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        statusFilter={statusFilter}
        onStatusFilterChange={setStatusFilter}
        vendorFilter={vendorFilter}
        onVendorFilterChange={setVendorFilter}
        onClearFilters={handleClearFilters}
        pendingCount={pendingCount}
        approvedCount={approvedCount}
        rejectedCount={rejectedCount}
      />

      {/* Results */}
      <Card>
        <CardHeader>
          <CardTitle>
            Solicitudes ({filteredRequests.length})
          </CardTitle>
          <CardDescription>
            {filteredRequests.length === 0 && searchQuery ? 
              `No se encontraron solicitudes que coincidan con "${searchQuery}"` :
              "Lista de todas las solicitudes de límite de crédito"
            }
          </CardDescription>
        </CardHeader>
        <CardContent>
          {loading && <div className="text-sm text-muted-foreground">Cargando…</div>}
          {error && <div className="text-sm text-red-600">{error}</div>}
          {filteredRequests.length === 0 ? (
            <div className="text-center py-8 px-4">
              <FileText className="h-12 w-12 mx-auto text-muted-foreground mb-3" />
              <p className="text-muted-foreground break-words">
                {searchQuery ? "No se encontraron solicitudes" : "No hay solicitudes de crédito"}
              </p>
            </div>
          ) : (
            <div className="grid gap-4 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3 px-2 sm:px-0">
              {filteredRequests.map((request) => (
                <CreditRequestCard
                  key={request.id}
                  request={request}
                  onViewDetails={handleViewDetails}
                  onApprove={handleApprove}
                  onReject={handleReject}
                />
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Detail Dialog */}
      <CreditRequestDetailDialog
        request={selectedRequest}
        isOpen={isDetailDialogOpen}
        onClose={() => setIsDetailDialogOpen(false)}
        onApprove={handleApprove}
        onReject={handleReject}
      />
    </div>
  );
}
