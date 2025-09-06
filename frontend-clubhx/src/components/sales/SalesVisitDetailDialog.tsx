
import React from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogFooter,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { User, Clock, MapPin, Video, ExternalLink, AlertTriangle, Briefcase } from "lucide-react";
import { AdminVisit } from "@/utils/salesScheduleStore";

type SalesVisitDetailDialogProps = {
  open: boolean;
  visit: AdminVisit | null;
  onClose: () => void;
};

export const SalesVisitDetailDialog: React.FC<SalesVisitDetailDialogProps> = ({
  open,
  visit,
  onClose,
}) => {
  if (!visit) return null;

  const durationLabel =
    visit.duration === 60
      ? "1h"
      : visit.duration > 60
      ? `${Math.floor(visit.duration / 60)}h ${visit.duration % 60}m`
      : `${visit.duration} min`;

  const getStatusLabel = (status: string) => {
    switch (status) {
      case "confirmed":
        return "Confirmada";
      case "pending":
        return "Pendiente";
      case "completed":
        return "Completada";
      case "cancelled":
        return "Cancelada";
      case "rescheduled":
        return "Reagendada";
      default:
        return status;
    }
  };

  const getVisitTypeLabel = (visitType: string) => {
    switch (visitType) {
      case "consultation":
        return "Consulta";
      case "product_demo":
        return "Demostración";
      case "follow_up":
        return "Seguimiento";
      case "training":
        return "Capacitación";
      case "technical_support":
        return "Soporte Técnico";
      default:
        return visitType;
    }
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>
            Detalle de Cita
          </DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
          {/* Header with status and urgency */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <MapPin className="h-5 w-5 text-emerald-600" />
              <span className="font-bold text-lg">Visita Presencial</span>
            </div>
            <div className="flex items-center gap-2">
              {visit.isUrgent && (
                <Badge variant="destructive" className="text-xs">
                  <AlertTriangle className="h-3 w-3 mr-1" />
                  Urgente
                </Badge>
              )}
              <Badge variant="secondary" className="text-xs">
                {getStatusLabel(visit.status)}
              </Badge>
            </div>
          </div>

          {/* Client Information */}
          <div className="bg-muted/20 p-3 rounded-lg space-y-2">
            <div className="flex gap-2 items-center">
              <User className="h-4 w-4 text-muted-foreground" />
              <span className="font-medium">{visit.clientName}</span>
            </div>
            <div className="ml-6 text-sm text-muted-foreground">
              {visit.clientCompany}
            </div>
          </div>

          {/* Visit Details */}
          <div className="space-y-3">
            <div className="flex gap-2 items-center">
              <Clock className="h-4 w-4 text-muted-foreground" />
              <span>
                {visit.date.toLocaleDateString("es-CL", { 
                  day: "2-digit", 
                  month: "short", 
                  year: "numeric" 
                })} a las {visit.time}
                {" · "}
                {durationLabel}
              </span>
            </div>

            <div className="space-y-1">
              <div className="flex gap-2 items-start">
                <span className="font-semibold text-sm">Tipo de visita:</span>
                <span className="text-sm">{getVisitTypeLabel(visit.visitType)}</span>
              </div>
              <div className="flex gap-2 items-start">
                <span className="font-semibold text-sm">Descripción:</span>
                <span className="text-sm">{visit.description}</span>
              </div>
            </div>

            <div className="flex gap-2 items-start">
              <MapPin className="h-4 w-4 text-muted-foreground mt-0.5" />
              <div>
                <span className="font-semibold text-sm">Ubicación:</span>
                <p className="text-sm text-muted-foreground">{visit.location}</p>
              </div>
            </div>

            {/* Sales Person */}
            <div className="flex gap-2 items-center">
              <Briefcase className="h-4 w-4 text-muted-foreground" />
              <span className="text-sm">
                <span className="font-semibold">Vendedor asignado:</span> {visit.salesPersonName}
              </span>
            </div>

            {/* Priority */}
            <div className="flex gap-2 items-center">
              <span className="font-semibold text-sm">Prioridad:</span>
              <Badge 
                variant="outline" 
                className={`text-xs ${
                  visit.priority === 'high' ? 'border-red-200 text-red-800' :
                  visit.priority === 'medium' ? 'border-yellow-200 text-yellow-800' :
                  'border-green-200 text-green-800'
                }`}
              >
                {visit.priority === 'high' ? 'Alta' : 
                 visit.priority === 'medium' ? 'Media' : 'Baja'}
              </Badge>
            </div>
          </div>

          {/* Notes */}
          {visit.notes && (
            <div className="border-t pt-3">
              <span className="font-semibold text-sm">Notas:</span>
              <div className="mt-1 text-sm text-muted-foreground bg-muted/20 p-2 rounded">
                {visit.notes}
              </div>
            </div>
          )}

          {/* Follow-up indicator */}
          {visit.followUp && (
            <div className="border-t pt-3">
              <Badge variant="outline" className="text-xs">
                Requiere seguimiento
              </Badge>
            </div>
          )}
        </div>
        <DialogFooter>
          <Button onClick={onClose}>Cerrar</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
