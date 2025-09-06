
import React from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogFooter,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { User, Clock, MapPin, Building } from "lucide-react";
import { AdminVisit } from "@/utils/salesScheduleStore";

type VisitDetailDialogProps = {
  open: boolean;
  visit: AdminVisit | null;
  onClose: () => void;
  onEdit?: (visit: AdminVisit) => void;
};

export const VisitDetailDialog: React.FC<VisitDetailDialogProps> = ({
  open,
  visit,
  onClose,
  onEdit,
}) => {
  if (!visit) return null;

  const durationLabel =
    visit.duration === 60
      ? "1h"
      : visit.duration > 60
      ? `${Math.floor(visit.duration / 60)}h ${visit.duration % 60}m`
      : `${visit.duration} min`;

  const getVisitTypeLabel = (type: string) => {
    switch (type) {
      case "consultation":
        return "Consulta";
      case "product_demo":
        return "Demostración de Producto";
      case "follow_up":
        return "Seguimiento";
      case "training":
        return "Capacitación";
      case "technical_support":
        return "Soporte Técnico";
      default:
        return type;
    }
  };

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
        return "Reprogramada";
      default:
        return status;
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
        <div className="space-y-3">
          <div className="flex items-center gap-2">
            <MapPin className="h-5 w-5 text-lime-700" />
            <span className="font-bold text-lg">{getVisitTypeLabel(visit.visitType)}</span>
            <span className="ml-2 px-2 py-0.5 rounded bg-gray-100 text-xs font-medium">
              {getStatusLabel(visit.status)}
            </span>
          </div>
          <div className="flex gap-2 items-center">
            <User className="h-4 w-4" />
            <span>{visit.clientName}</span>
          </div>
          <div className="flex gap-2 items-center">
            <Building className="h-4 w-4" />
            <span>{visit.clientCompany}</span>
          </div>
          <div className="flex gap-2 items-center">
            <Clock className="h-4 w-4" />
            <span>
              {visit.date.toLocaleDateString("es-CL", { day: "2-digit", month: "short", year: "numeric" })} {visit.time}
              {" · "}
              {durationLabel}
            </span>
          </div>
          <div className="flex gap-2 items-center">
            <MapPin className="h-4 w-4" />
            <span>{visit.location}</span>
          </div>
          <div className="flex gap-2 items-center">
            <span className="font-semibold">Descripción:</span>
            <span>{visit.description}</span>
          </div>
          {visit.notes && (
            <div>
              <span className="font-semibold">Notas:</span>
              <div className="ml-2 text-sm">{visit.notes}</div>
            </div>
          )}
          <div className="flex gap-2 items-center">
            <span className="font-semibold">Vendedor:</span>
            <span>{visit.salesPersonName}</span>
          </div>
          <div className="flex gap-2 items-center">
            <span className="font-semibold">Prioridad:</span>
            <span className={`px-2 py-1 rounded text-xs font-medium ${
              visit.priority === "high" ? "bg-red-100 text-red-800" :
              visit.priority === "medium" ? "bg-yellow-100 text-yellow-800" :
              "bg-green-100 text-green-800"
            }`}>
              {visit.priority === "high" ? "Alta" : visit.priority === "medium" ? "Media" : "Baja"}
            </span>
            {visit.isUrgent && (
              <span className="bg-red-100 text-red-800 px-2 py-1 rounded text-xs font-medium">
                Urgente
              </span>
            )}
          </div>
        </div>
        <DialogFooter>
          <Button onClick={onClose}>Cerrar</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
