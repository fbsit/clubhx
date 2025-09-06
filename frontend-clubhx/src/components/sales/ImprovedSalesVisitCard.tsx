import React from "react";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Clock, MapPin, Video, User, AlertTriangle } from "lucide-react";
import { AdminVisit } from "@/utils/salesScheduleStore";

interface ImprovedSalesVisitCardProps {
  visit: AdminVisit;
  onClick: () => void;
}

export const ImprovedSalesVisitCard: React.FC<ImprovedSalesVisitCardProps> = ({
  visit,
  onClick,
}) => {
  const getStatusConfig = (status: string) => {
    switch (status) {
      case "confirmed":
        return {
          borderColor: "border-l-green-500",
          bgColor: "bg-green-50",
          textColor: "text-green-900",
          badgeVariant: "default" as const,
          badgeColor: "bg-green-100 text-green-800",
        };
      case "pending":
        return {
          borderColor: "border-l-yellow-500",
          bgColor: "bg-yellow-50",
          textColor: "text-yellow-900",
          badgeVariant: "secondary" as const,
          badgeColor: "bg-yellow-100 text-yellow-800",
        };
      case "completed":
        return {
          borderColor: "border-l-blue-500",
          bgColor: "bg-blue-50",
          textColor: "text-blue-900",
          badgeVariant: "default" as const,
          badgeColor: "bg-blue-100 text-blue-800",
        };
      case "cancelled":
        return {
          borderColor: "border-l-red-500",
          bgColor: "bg-red-50",
          textColor: "text-red-900",
          badgeVariant: "destructive" as const,
          badgeColor: "bg-red-100 text-red-800",
        };
      case "rescheduled":
        return {
          borderColor: "border-l-orange-500",
          bgColor: "bg-orange-50",
          textColor: "text-orange-900",
          badgeVariant: "secondary" as const,
          badgeColor: "bg-orange-100 text-orange-800",
        };
      default:
        return {
          borderColor: "border-l-gray-500",
          bgColor: "bg-gray-50",
          textColor: "text-gray-900",
          badgeVariant: "secondary" as const,
          badgeColor: "bg-gray-100 text-gray-800",
        };
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "high":
        return "text-red-600";
      case "medium":
        return "text-yellow-600";
      case "low":
        return "text-green-600";
      default:
        return "text-gray-600";
    }
  };

  const getVisitTypeIcon = () => {
    // For now assume all are presencial since AdminVisit doesn't have type field
    return <MapPin className="h-4 w-4 text-emerald-600" />;
  };

  const statusConfig = getStatusConfig(visit.status);
  const durationLabel =
    visit.duration === 60
      ? "1h"
      : visit.duration > 60
      ? `${Math.floor(visit.duration / 60)}h ${visit.duration % 60}m`
      : `${visit.duration}min`;

  return (
    <Card
      className={`p-4 cursor-pointer hover:shadow-md transition-all duration-200 ${statusConfig.bgColor} ${statusConfig.borderColor} border-l-4 mb-3`}
      onClick={onClick}
    >
      <div className="space-y-3">
        {/* Header with time and status */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Clock className="h-4 w-4 text-muted-foreground" />
            <span className="font-semibold text-sm">{visit.time}</span>
            <span className="text-xs text-muted-foreground">·</span>
            <span className="text-xs text-muted-foreground">{durationLabel}</span>
          </div>
          <div className="flex items-center gap-2">
            {visit.isUrgent && (
              <AlertTriangle className="h-4 w-4 text-red-500" />
            )}
            <Badge className={`text-xs ${statusConfig.badgeColor}`}>
              {visit.status}
            </Badge>
          </div>
        </div>

        {/* Client info */}
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <User className="h-4 w-4 text-muted-foreground" />
            <span className="font-medium text-sm">{visit.clientName}</span>
          </div>
          <p className="text-xs text-muted-foreground ml-6">{visit.clientCompany}</p>
        </div>

        {/* Visit details */}
        <div className="space-y-2">
          <div className="flex items-start gap-2">
            {getVisitTypeIcon()}
            <div className="flex-1">
              <p className="text-sm font-medium">{visit.description}</p>
              <div className="flex items-center gap-2 mt-1">
                {visit.meetingType === "presencial" ? (
                  <MapPin className="h-3 w-3 text-muted-foreground" />
                ) : (
                  <Video className="h-3 w-3 text-muted-foreground" />
                )}
                <p className="text-xs text-muted-foreground">
                  {visit.meetingType === "presencial" ? visit.location : "Videollamada"}
                </p>
                <Badge 
                  variant="outline" 
                  className={`text-xs ml-auto ${
                    visit.meetingType === "presencial" 
                      ? "border-green-300 text-green-700" 
                      : "border-blue-300 text-blue-700"
                  }`}
                >
                  {visit.meetingType === "presencial" ? "Presencial" : "Videollamada"}
                </Badge>
              </div>
            </div>
          </div>
        </div>

        {/* Footer with salesperson and priority */}
        <div className="flex items-center justify-between pt-2 border-t border-border/20">
          <span className="text-xs text-muted-foreground">
            {visit.salesPersonName}
          </span>
          <div className="flex items-center gap-1">
            <span className="text-xs text-muted-foreground">Prioridad:</span>
            <span className={`text-xs font-medium ${getPriorityColor(visit.priority)}`}>
              {visit.priority}
            </span>
          </div>
        </div>

        {/* Notes if available */}
        {visit.notes && (
          <div className="pt-2 border-t border-border/20">
            <p className="text-xs text-muted-foreground italic">{visit.notes}</p>
          </div>
        )}
      </div>
    </Card>
  );
};