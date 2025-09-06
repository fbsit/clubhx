import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Search, Eye, Check, X, Clock, Building2, Mail, Phone, MapPin } from "lucide-react";
import { ClientRegistrationRequest, RegistrationStatus } from "@/types/auth";
import { getBusinessTypeLabel } from "@/data/businessTypes";
import { toast } from "sonner";
import { useIsMobile } from "@/hooks/use-mobile";
import MobileRegistrationRequestsView from "./MobileRegistrationRequestsView";

export default function RegistrationRequestsView() {
  const isMobile = useIsMobile();
  
  // Use mobile version for better UX
  if (isMobile) {
    return <MobileRegistrationRequestsView />;
  }
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
      // Simulate API call
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
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Solicitudes de Registro</h1>
          <p className="text-muted-foreground">
            Gestiona las solicitudes de nuevos clientes
          </p>
        </div>
        {pendingCount > 0 && (
          <Badge variant="outline" className="text-amber-700 border-amber-300">
            <Clock className="h-3 w-3 mr-1" />
            {pendingCount} pendiente{pendingCount !== 1 ? 's' : ''}
          </Badge>
        )}
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Buscar por empresa, contacto o email..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-9"
          />
        </div>
        <Select 
          value={statusFilter} 
          onValueChange={(value) => setStatusFilter(value as RegistrationStatus | "all")}
        >
          <SelectTrigger className="w-full sm:w-48">
            <SelectValue placeholder="Filtrar por estado" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Todos los estados</SelectItem>
            <SelectItem value="pending">Pendientes</SelectItem>
            <SelectItem value="approved">Aprobados</SelectItem>
            <SelectItem value="rejected">Rechazados</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Requests List */}
      <div className="grid gap-4">
        {filteredRequests.length === 0 ? (
          <Card>
            <CardContent className="text-center py-8">
              <p className="text-muted-foreground">No se encontraron solicitudes</p>
            </CardContent>
          </Card>
        ) : (
          filteredRequests.map((request) => (
            <Card key={request.id} className="hover:shadow-md transition-shadow">
              <CardContent className="p-6">
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1 space-y-3">
                    <div className="flex items-center gap-3">
                      <Building2 className="h-5 w-5 text-muted-foreground" />
                      <div>
                        <h3 className="font-semibold">{request.companyName}</h3>
                        <p className="text-sm text-muted-foreground">
                          RUT: {request.rut} • {getBusinessTypeLabel(request.businessType)}
                        </p>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-sm">
                      <div className="flex items-center gap-2">
                        <Mail className="h-4 w-4 text-muted-foreground" />
                        <span>{request.contactName}</span>
                        <span className="text-muted-foreground">•</span>
                        <span className="text-muted-foreground">{request.email}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Phone className="h-4 w-4 text-muted-foreground" />
                        <span className="text-muted-foreground">{request.phone}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <MapPin className="h-4 w-4 text-muted-foreground" />
                        <span className="text-muted-foreground">
                          {request.commune}, {request.region}
                        </span>
                      </div>
                      <div className="text-muted-foreground">
                        Solicitado: {new Date(request.createdAt).toLocaleDateString()}
                      </div>
                    </div>
                  </div>

                  <div className="flex flex-col items-end gap-3">
                    <Badge className={getStatusColor(request.status)}>
                      {getStatusIcon(request.status)}
                      <span className="ml-1 capitalize">{request.status}</span>
                    </Badge>

                    <div className="flex gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setSelectedRequest(request)}
                      >
                        <Eye className="h-4 w-4 mr-1" />
                        Ver
                      </Button>

                      {request.status === 'pending' && (
                        <>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleReviewRequest(request, 'reject')}
                            className="text-red-600 border-red-200 hover:bg-red-50"
                          >
                            <X className="h-4 w-4 mr-1" />
                            Rechazar
                          </Button>
                          <Button
                            size="sm"
                            onClick={() => handleReviewRequest(request, 'approve')}
                            className="bg-green-600 hover:bg-green-700"
                          >
                            <Check className="h-4 w-4 mr-1" />
                            Aprobar
                          </Button>
                        </>
                      )}
                    </div>
                  </div>
                </div>

                {request.adminComments && (
                  <div className="mt-4 p-3 bg-muted/50 rounded-lg">
                    <p className="text-sm">
                      <strong>Comentarios del admin:</strong> {request.adminComments}
                    </p>
                  </div>
                )}
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
        <DialogContent>
          <DialogHeader>
            <DialogTitle>
              {reviewDialog.action === 'approve' ? 'Aprobar' : 'Rechazar'} Solicitud
            </DialogTitle>
            <DialogDescription>
              {reviewDialog.request?.companyName} - {reviewDialog.request?.contactName}
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="adminComments">
                Comentarios {reviewDialog.action === 'reject' ? '(requerido)' : '(opcional)'}
              </Label>
              <Textarea
                id="adminComments"
                placeholder={
                  reviewDialog.action === 'approve' 
                    ? "Comentarios adicionales sobre la aprobación..."
                    : "Explique el motivo del rechazo..."
                }
                value={adminComments}
                onChange={(e) => setAdminComments(e.target.value)}
                className="min-h-20"
                required={reviewDialog.action === 'reject'}
              />
            </div>

            <div className="flex justify-end gap-2">
              <Button
                variant="outline"
                onClick={() => setReviewDialog({ open: false, request: null, action: null })}
              >
                Cancelar
              </Button>
              <Button
                onClick={confirmReview}
                disabled={isLoading || (reviewDialog.action === 'reject' && !adminComments.trim())}
                className={
                  reviewDialog.action === 'approve' 
                    ? "bg-green-600 hover:bg-green-700" 
                    : "bg-red-600 hover:bg-red-700"
                }
              >
                {isLoading ? "Procesando..." : (
                  reviewDialog.action === 'approve' ? 'Aprobar' : 'Rechazar'
                )}
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Detail Dialog */}
      <Dialog 
        open={!!selectedRequest} 
        onOpenChange={() => setSelectedRequest(null)}
      >
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Detalle de Solicitud</DialogTitle>
            <DialogDescription>
              Información completa de la solicitud de registro
            </DialogDescription>
          </DialogHeader>

          {selectedRequest && (
            <div className="space-y-6">
              <div className="space-y-4">
                <div>
                  <h4 className="font-semibold mb-2">Información de la Empresa</h4>
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <span className="text-muted-foreground">Razón Social:</span>
                      <p className="font-medium">{selectedRequest.companyName}</p>
                    </div>
                    <div>
                      <span className="text-muted-foreground">RUT:</span>
                      <p className="font-medium">{selectedRequest.rut}</p>
                    </div>
                    <div className="col-span-2">
                      <span className="text-muted-foreground">Tipo de Negocio:</span>
                      <p className="font-medium">{getBusinessTypeLabel(selectedRequest.businessType)}</p>
                    </div>
                  </div>
                </div>

                <div>
                  <h4 className="font-semibold mb-2">Datos de Contacto</h4>
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <span className="text-muted-foreground">Nombre:</span>
                      <p className="font-medium">{selectedRequest.contactName}</p>
                    </div>
                    <div>
                      <span className="text-muted-foreground">Email:</span>
                      <p className="font-medium">{selectedRequest.email}</p>
                    </div>
                    <div className="col-span-2">
                      <span className="text-muted-foreground">Teléfono:</span>
                      <p className="font-medium">{selectedRequest.phone}</p>
                    </div>
                  </div>
                </div>

                <div>
                  <h4 className="font-semibold mb-2">Dirección</h4>
                  <div className="text-sm space-y-1">
                    <p className="font-medium">{selectedRequest.address}</p>
                    <p className="text-muted-foreground">
                      {selectedRequest.commune}, {selectedRequest.region}
                    </p>
                  </div>
                </div>

                <div>
                  <h4 className="font-semibold mb-2">Estado de la Solicitud</h4>
                  <div className="space-y-2">
                    <Badge className={getStatusColor(selectedRequest.status)}>
                      {getStatusIcon(selectedRequest.status)}
                      <span className="ml-1 capitalize">{selectedRequest.status}</span>
                    </Badge>
                    <p className="text-sm text-muted-foreground">
                      Solicitado: {new Date(selectedRequest.createdAt).toLocaleDateString()}
                    </p>
                    {selectedRequest.reviewedAt && (
                      <p className="text-sm text-muted-foreground">
                        Revisado: {new Date(selectedRequest.reviewedAt).toLocaleDateString()}
                      </p>
                    )}
                  </div>
                </div>

                {selectedRequest.adminComments && (
                  <div>
                    <h4 className="font-semibold mb-2">Comentarios del Administrador</h4>
                    <p className="text-sm bg-muted/50 p-3 rounded-lg">
                      {selectedRequest.adminComments}
                    </p>
                  </div>
                )}
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}