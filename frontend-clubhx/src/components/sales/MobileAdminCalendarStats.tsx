
import React from "react";
import { CalendarIcon, CheckCircle, Clock, XCircle, AlertTriangle } from "lucide-react";

type CalendarStats = {
  total: number;
  confirmed: number;
  pending: number;
  completed: number;
  cancelled: number;
  rescheduled: number;
};

type MobileAdminCalendarStatsProps = {
  stats: CalendarStats;
};

export const MobileAdminCalendarStats: React.FC<MobileAdminCalendarStatsProps> = ({ stats }) => {
  const statsData = [
    {
      key: "total",
      label: "Total",
      value: stats.total,
      icon: CalendarIcon,
      color: "text-blue-600",
      bgColor: "bg-blue-50"
    },
    {
      key: "confirmed",
      label: "Confirmadas",
      value: stats.confirmed,
      icon: CheckCircle,
      color: "text-green-600",
      bgColor: "bg-green-50"
    },
    {
      key: "pending",
      label: "Pendientes",
      value: stats.pending,
      icon: Clock,
      color: "text-yellow-600",
      bgColor: "bg-yellow-50"
    },
    {
      key: "completed",
      label: "Completadas",
      value: stats.completed,
      icon: CheckCircle,
      color: "text-blue-600",
      bgColor: "bg-blue-50"
    },
    {
      key: "cancelled",
      label: "Canceladas",
      value: stats.cancelled,
      icon: XCircle,
      color: "text-red-600",
      bgColor: "bg-red-50"
    },
    {
      key: "rescheduled",
      label: "Reprog.",
      value: stats.rescheduled,
      icon: AlertTriangle,
      color: "text-orange-600",
      bgColor: "bg-orange-50"
    }
  ];

  return (
    <div className="px-4 pt-1 pb-0 bg-gray-50/50 w-full overflow-hidden">
      <div className="grid grid-cols-3 gap-2 w-full">
        {statsData.map(({ key, label, value, icon: Icon, color, bgColor }) => (
          <div key={key} className={`${bgColor} rounded-lg p-2 border border-gray-100 min-w-0 overflow-hidden`}>
            <div className="flex flex-col items-center text-center gap-1">
              <Icon className={`h-3.5 w-3.5 ${color} flex-shrink-0`} />
              <div className={`text-base font-bold ${color} leading-none`}>
                {value}
              </div>
              <div className="text-[10px] text-gray-600 leading-tight truncate w-full px-0.5">
                {label}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
