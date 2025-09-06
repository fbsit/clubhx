
import React from "react";
import { Card } from "@/components/ui/card";
import { Clock, User, Video, MapPin } from "lucide-react";
import { AdminVisit } from "@/utils/salesScheduleStore";

type CalendarVisitCardProps = {
  visit: AdminVisit;
  onClick: () => void;
};

export const CalendarVisitCard: React.FC<CalendarVisitCardProps> = ({
  visit,
  onClick,
}) => {
  const getStatusColor = (status: string) => {
    switch (status) {
      case "confirmed":
        return "bg-green-50 border-green-200 text-green-900";
      case "pending":
        return "bg-yellow-50 border-yellow-200 text-yellow-900";
      case "completed":
        return "bg-blue-50 border-blue-200 text-blue-900";
      case "cancelled":
        return "bg-red-50 border-red-200 text-red-900";
      case "rescheduled":
        return "bg-orange-50 border-orange-200 text-orange-900";
      default:
        return "bg-gray-50 border-gray-200 text-gray-900";
    }
  };
  
  const getTypeIcon = () => {
    // For now, assume all visits are presencial since AdminVisit doesn't have a type field
    return <MapPin className="h-3 w-3 text-emerald-600 flex-shrink-0" />;
  };
    
  const durationLabel =
    visit.duration === 60
      ? "1h"
      : visit.duration > 60
      ? `${Math.floor(visit.duration / 60)}h ${visit.duration % 60}m`
      : `${visit.duration}min`;

  return (
    <Card
      className={`p-3 mb-2 cursor-pointer hover:shadow-md transition-all duration-200 ${getStatusColor(
        visit.status
      )} border-l-4`}
      onClick={onClick}
    >
      <div className="flex items-start gap-3">
        <div className="flex-shrink-0 mt-0.5">
          {getTypeIcon()}
        </div>
        
        <div className="flex-1 min-w-0 space-y-2">
          {/* Time and Duration Row */}
          <div className="flex items-center gap-2 text-xs font-medium">
            <Clock className="h-3 w-3 flex-shrink-0" />
            <span className="truncate">{visit.time}</span>
            <span className="hidden sm:inline text-gray-400">·</span>
            <span className="hidden sm:inline text-gray-600">{durationLabel}</span>
          </div>
          
          {/* Client Name Row */}
          <div className="flex items-center gap-2">
            <User className="h-3 w-3 flex-shrink-0" />
            <span className="text-sm font-medium truncate" title={visit.clientName}>
              {visit.clientName}
            </span>
          </div>
          
          {/* Description Row */}
          <div className="space-y-1">
            <p className="text-xs text-gray-700 line-clamp-2 leading-relaxed" title={visit.description}>
              {visit.description}
            </p>
            
            {/* Mobile duration - only show on small screens */}
            <div className="sm:hidden text-xs text-gray-500">
              {durationLabel}
            </div>
          </div>
        </div>
      </div>
    </Card>
  );
};
