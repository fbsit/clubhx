import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { 
  Search, 
  Eye, 
  Check, 
  X, 
  Clock, 
  Building2, 
  Mail, 
  Phone, 
  MapPin, 
  Filter,
  ChevronRight,
  User,
  Calendar
} from "lucide-react";
import { ClientRegistrationRequest, RegistrationStatus } from "@/types/auth";
import { getBusinessTypeLabel } from "@/data/businessTypes";
import { toast } from "sonner";

export default function MobileRegistrationRequestsView() {
  const [requests, setRequests] = useState<ClientRegistrationRequest[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<RegistrationStatus | "all">("all");
  const [selectedRequest, setSelectedRequest] = useState<ClientRegistrationRequest | null>(null);
  const [reviewDialog, setReviewDialog] = useState<{
    open: boolean;
    request: ClientRegistrationRequest | null;
    action: 'approve' | 'reject' | null;
  }>({ open: false, request: null, action: null });
  const [adminComments, setAdminComments] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [showFilters, setShowFilters] = useState(false);

  const filteredRequests = requests.filter(request => {
    const matchesSearch = 
      request.companyName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      request.contactName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      request.email.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesStatus = statusFilter === "all" || request.status === statusFilter;
    
    return matchesSearch && matchesStatus;
  });

  const getStatusColor = (status: RegistrationStatus) => {
    switch (status) {
      case 'pending':
        return 'bg-amber-100 text-amber-800 border-amber-300';
      case 'approved':
        return 'bg-green-100 text-green-800 border-green-300';
      case 'rejected':
        return 'bg-red-100 text-red-800 border-red-300';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-300';
    }
  };

  const getStatusIcon = (status: RegistrationStatus) => {
    switch (status) {
      case 'pending':
        return <Clock className="h-3 w-3" />;
      case 'approved':
        return <Check className="h-3 w-3" />;
      case 'rejected':
        return <X className="h-3 w-3" />;
    }
  };

  const handleReviewRequest = (request: ClientRegistrationRequest, action: 'approve' | 'reject') => {
    setReviewDialog({ open: true, request, action });
    setAdminComments("");
  };

  const confirmReview = async () => {
    if (!reviewDialog.request || !reviewDialog.action) return;

    setIsLoading(true);
    try {
      await new Promise(resolve => setTimeout(resolve, 1000));

      const updatedRequests = requests.map(req => {
        if (req.id === reviewDialog.request!.id) {
          return {
            ...req,
            status: reviewDialog.action === 'approve' ? 'approved' as RegistrationStatus : 'rejected' as RegistrationStatus,
            reviewedAt: new Date().toISOString(),
            reviewedBy: "admin@clubhx.com",
            adminComments: adminComments || undefined
          };
        }
        return req;
      });

      setRequests(updatedRequests);
      setReviewDialog({ open: false, request: null, action: null });
      
      toast.success(
        reviewDialog.action === 'approve' 
          ? "Solicitud aprobada exitosamente" 
          : "Solicitud rechazada"
      );
    } catch (error) {
      toast.error("Error al procesar la solicitud");
    } finally {
      setIsLoading(false);
    }
  };

  const pendingCount = requests.filter(r => r.status === 'pending').length;

  return (
    <div className="px-4 py-4 space-y-4 pb-20">
      {/* Header */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-xl font-bold">Solicitudes</h1>
            <p className="text-sm text-muted-foreground">Nuevos clientes</p>
          </div>
          {pendingCount > 0 && (
            <Badge variant="outline" className="text-amber-700 border-amber-300 text-xs">
              {pendingCount} pendiente{pendingCount !== 1 ? 's' : ''}
            </Badge>
          )}
        </div>

        {/* Search */}
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Buscar solicitudes..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-9 h-10"
          />
        </div>

        {/* Filter Toggle */}
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => setShowFilters(!showFilters)}
            className="flex items-center gap-2 h-8"
          >
            <Filter className="h-3 w-3" />
            Filtros
          </Button>
          {statusFilter !== "all" && (
            <Badge variant="secondary" className="text-xs">
              {statusFilter}
            </Badge>
          )}
        </div>

        {/* Filter Panel */}
        {showFilters && (
          <Card className="p-3">
            <Select 
              value={statusFilter} 
              onValueChange={(value) => setStatusFilter(value as RegistrationStatus | "all")}
            >
              <SelectTrigger className="h-9">
                <SelectValue placeholder="Estado" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todos</SelectItem>
                <SelectItem value="pending">Pendientes</SelectItem>
                <SelectItem value="approved">Aprobados</SelectItem>
                <SelectItem value="rejected">Rechazados</SelectItem>
              </SelectContent>
            </Select>
          </Card>
        )}
      </div>

      {/* Requests List */}
      <div className="space-y-3">
        {filteredRequests.length === 0 ? (
          <Card>
            <CardContent className="text-center py-8">
              <p className="text-sm text-muted-foreground">No se encontraron solicitudes</p>
            </CardContent>
          </Card>
        ) : (
          filteredRequests.map((request) => (
            <Card key={request.id} className="relative overflow-hidden">
              <CardContent className="p-4">
                <div className="space-y-3">
                  {/* Header */}
                  <div className="flex items-start justify-between">
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <Building2 className="h-4 w-4 text-muted-foreground flex-shrink-0" />
                        <h3 className="font-medium text-sm truncate">{request.companyName}</h3>
                      </div>
                      <p className="text-xs text-muted-foreground">
                        RUT: {request.rut}
                      </p>
                    </div>
                    <Badge className={`${getStatusColor(request.status)} text-xs flex-shrink-0`}>
                      {getStatusIcon(request.status)}
                      <span className="ml-1 capitalize">{request.status}</span>
                    </Badge>
                  </div>

                  {/* Business Type */}
                  <div className="bg-muted/50 rounded px-2 py-1">
                    <p className="text-xs font-medium text-muted-foreground">
                      {getBusinessTypeLabel(request.businessType)}
                    </p>
                  </div>

                  {/* Contact Info */}
                  <div className="space-y-1.5">
                    <div className="flex items-center gap-2">
                      <User className="h-3 w-3 text-muted-foreground" />
                      <span className="text-xs text-muted-foreground">{request.contactName}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Mail className="h-3 w-3 text-muted-foreground" />
                      <span className="text-xs text-muted-foreground truncate">{request.email}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Phone className="h-3 w-3 text-muted-foreground" />
                      <span className="text-xs text-muted-foreground">{request.phone}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <MapPin className="h-3 w-3 text-muted-foreground" />
                      <span className="text-xs text-muted-foreground">
                        {request.commune}, {request.region}
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Calendar className="h-3 w-3 text-muted-foreground" />
                      <span className="text-xs text-muted-foreground">
                        {new Date(request.createdAt).toLocaleDateString()}
                      </span>
                    </div>
                  </div>

                  {/* Admin Comments */}
                  {request.adminComments && (
                    <div className="p-2 bg-muted/30 rounded-lg">
                      <p className="text-xs">
                        <strong>Comentarios:</strong> {request.adminComments}
                      </p>
                    </div>
                  )}

                  {/* Actions */}
                  <div className="flex gap-2 pt-2 border-t">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setSelectedRequest(request)}
                      className="flex-1 h-8 text-xs"
                    >
                      <Eye className="h-3 w-3 mr-1" />
                      Ver
                    </Button>

                    {request.status === 'pending' && (
                      <>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleReviewRequest(request, 'reject')}
                          className="h-8 text-xs text-red-600 border-red-200 hover:bg-red-50"
                        >
                          <X className="h-3 w-3" />
                        </Button>
                        <Button
                          size="sm"
                          onClick={() => handleReviewRequest(request, 'approve')}
                          className="h-8 text-xs bg-green-600 hover:bg-green-700"
                        >
                          <Check className="h-3 w-3" />
                        </Button>
                      </>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          ))
        )}
      </div>

      {/* Review Dialog */}
      <Dialog 
        open={reviewDialog.open} 
        onOpenChange={(open) => setReviewDialog({ open, request: null, action: null })}
      >
        <DialogContent className="mx-4 max-w-sm">
          <DialogHeader>
            <DialogTitle className="text-base">
              {reviewDialog.action === 'approve' ? 'Aprobar' : 'Rechazar'}
            </DialogTitle>
            <DialogDescription className="text-sm">
              {reviewDialog.request?.companyName}
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-3">
            <div className="space-y-2">
              <Label htmlFor="adminComments" className="text-sm">
                Comentarios {reviewDialog.action === 'reject' ? '(requerido)' : '(opcional)'}
              </Label>
              <Textarea
                id="adminComments"
                placeholder={
                  reviewDialog.action === 'approve' 
                    ? "Comentarios sobre la aprobación..."
                    : "Motivo del rechazo..."
                }
                value={adminComments}
                onChange={(e) => setAdminComments(e.target.value)}
                className="min-h-16 text-sm"
                required={reviewDialog.action === 'reject'}
              />
            </div>

            <div className="flex gap-2">
              <Button
                variant="outline"
                onClick={() => setReviewDialog({ open: false, request: null, action: null })}
                className="flex-1 h-9 text-sm"
              >
                Cancelar
              </Button>
              <Button
                onClick={confirmReview}
                disabled={isLoading || (reviewDialog.action === 'reject' && !adminComments.trim())}
                className={`flex-1 h-9 text-sm ${
                  reviewDialog.action === 'approve' 
                    ? "bg-green-600 hover:bg-green-700" 
                    : "bg-red-600 hover:bg-red-700"
                }`}
              >
                {isLoading ? "..." : (
                  reviewDialog.action === 'approve' ? 'Aprobar' : 'Rechazar'
                )}
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Detail Sheet */}
      <Sheet 
        open={!!selectedRequest} 
        onOpenChange={() => setSelectedRequest(null)}
      >
        <SheetContent side="bottom" className="h-[90vh] overflow-y-auto">
          <SheetHeader className="text-left pb-4">
            <SheetTitle className="text-lg">Detalle de Solicitud</SheetTitle>
            <SheetDescription className="text-sm">
              Información completa
            </SheetDescription>
          </SheetHeader>

          {selectedRequest && (
            <div className="space-y-6 pb-4">
              {/* Company Info */}
              <div className="space-y-3">
                <h4 className="font-medium text-sm">Información de la Empresa</h4>
                <div className="space-y-3">
                  <div className="flex items-center gap-3 p-3 bg-muted/30 rounded-lg">
                    <Building2 className="h-4 w-4 text-muted-foreground" />
                    <div className="flex-1 min-w-0">
                      <p className="font-medium text-sm">{selectedRequest.companyName}</p>
                      <p className="text-xs text-muted-foreground">RUT: {selectedRequest.rut}</p>
                    </div>
                  </div>
                  <div className="p-3 bg-muted/30 rounded-lg">
                    <p className="text-xs text-muted-foreground mb-1">Tipo de Negocio</p>
                    <p className="text-sm font-medium">{getBusinessTypeLabel(selectedRequest.businessType)}</p>
                  </div>
                </div>
              </div>

              {/* Contact Info */}
              <div className="space-y-3">
                <h4 className="font-medium text-sm">Contacto</h4>
                <div className="space-y-2">
                  <div className="flex items-center gap-3 p-3 bg-muted/30 rounded-lg">
                    <User className="h-4 w-4 text-muted-foreground" />
                    <div>
                      <p className="font-medium text-sm">{selectedRequest.contactName}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3 p-3 bg-muted/30 rounded-lg">
                    <Mail className="h-4 w-4 text-muted-foreground" />
                    <div>
                      <p className="text-sm">{selectedRequest.email}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3 p-3 bg-muted/30 rounded-lg">
                    <Phone className="h-4 w-4 text-muted-foreground" />
                    <div>
                      <p className="text-sm">{selectedRequest.phone}</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Address */}
              <div className="space-y-3">
                <h4 className="font-medium text-sm">Dirección</h4>
                <div className="flex items-start gap-3 p-3 bg-muted/30 rounded-lg">
                  <MapPin className="h-4 w-4 text-muted-foreground mt-0.5" />
                  <div>
                    <p className="text-sm font-medium">{selectedRequest.address}</p>
                    <p className="text-xs text-muted-foreground">
                      {selectedRequest.commune}, {selectedRequest.region}
                    </p>
                  </div>
                </div>
              </div>

              {/* Status */}
              <div className="space-y-3">
                <h4 className="font-medium text-sm">Estado</h4>
                <div className="space-y-2">
                  <Badge className={getStatusColor(selectedRequest.status)}>
                    {getStatusIcon(selectedRequest.status)}
                    <span className="ml-1 capitalize">{selectedRequest.status}</span>
                  </Badge>
                  <p className="text-xs text-muted-foreground">
                    Solicitado: {new Date(selectedRequest.createdAt).toLocaleDateString()}
                  </p>
                  {selectedRequest.reviewedAt && (
                    <p className="text-xs text-muted-foreground">
                      Revisado: {new Date(selectedRequest.reviewedAt).toLocaleDateString()}
                    </p>
                  )}
                </div>
              </div>

              {/* Admin Comments */}
              {selectedRequest.adminComments && (
                <div className="space-y-2">
                  <h4 className="font-medium text-sm">Comentarios del Admin</h4>
                  <div className="p-3 bg-muted/30 rounded-lg">
                    <p className="text-sm">{selectedRequest.adminComments}</p>
                  </div>
                </div>
              )}
            </div>
          )}
        </SheetContent>
      </Sheet>
    </div>
  );
}