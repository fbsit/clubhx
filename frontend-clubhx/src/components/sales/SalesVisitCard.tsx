
import React from "react";
import { Card } from "@/components/ui/card";
import { Clock, User, Video, MapPin } from "lucide-react";

type Visit = {
  id: string;
  customerId: string;
  customer: string;
  date: Date;
  time: string;
  purpose: string;
  status: "confirmed" | "pending" | "completed";
  notes?: string;
  type: "presencial" | "videollamada";
  duration: number;
  meetingLink?: string;
};

type SalesVisitCardProps = {
  visit: Visit;
  onClick: () => void;
};

export const SalesVisitCard: React.FC<SalesVisitCardProps> = ({
  visit,
  onClick,
}) => {
  const getStatusColor = (status: string) => {
    switch (status) {
      case "confirmed":
        return "bg-green-100 border-green-300 text-green-800";
      case "pending":
        return "bg-yellow-100 border-yellow-300 text-yellow-800";
      case "completed":
        return "bg-blue-100 border-blue-300 text-blue-800";
      default:
        return "bg-gray-100 border-gray-300 text-gray-800";
    }
  };
  
  const getTypeIcon = () => {
    return visit.type === "videollamada" ? (
      <Video className="h-3 w-3 text-blue-700" />
    ) : (
      <MapPin className="h-3 w-3 text-lime-700" />
    );
  };
    
  const durationLabel =
    visit.duration === 60
      ? "1h"
      : visit.duration > 60
      ? `${Math.floor(visit.duration / 60)}h ${visit.duration % 60}m`
      : `${visit.duration} min`;

  return (
    <Card
      className={`p-2 mb-1 cursor-pointer hover:shadow-md transition-shadow ${getStatusColor(
        visit.status
      )} flex items-start gap-2`}
      onClick={onClick}
    >
      <div>{getTypeIcon()}</div>
      <div className="space-y-1 flex-1">
        <div className="flex items-center gap-1">
          <Clock className="h-3 w-3" />
          <span className="text-xs font-medium">{visit.time}</span>
          <span className="mx-1 text-xs opacity-60">·</span>
          <span className="text-xs">{durationLabel}</span>
        </div>
        <div className="flex items-center gap-1">
          <User className="h-3 w-3" />
          <span className="text-xs">{visit.customer}</span>
        </div>
        <p className="text-xs opacity-80 truncate">{visit.purpose}</p>
      </div>
    </Card>
  );
};
