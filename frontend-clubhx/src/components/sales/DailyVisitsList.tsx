
import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { CalendarVisitCard } from "@/components/sales/CalendarVisitCard";
import { format } from "date-fns";
import { CalendarIcon, CheckCircle, Clock, XCircle, AlertTriangle } from "lucide-react";
import { AdminVisit } from "@/utils/salesScheduleStore";

type DailyVisitsListProps = {
  selectedDate: Date;
  visits: AdminVisit[];
  onVisitClick: (visit: AdminVisit) => void;
};

export const DailyVisitsList: React.FC<DailyVisitsListProps> = ({
  selectedDate,
  visits,
  onVisitClick,
}) => {
  const getStatusIcon = (status: string) => {
    switch (status) {
      case "confirmed":
        return <CheckCircle className="h-4 w-4 text-green-600" />;
      case "pending":
        return <Clock className="h-4 w-4 text-yellow-600" />;
      case "completed":
        return <CheckCircle className="h-4 w-4 text-blue-600" />;
      case "cancelled":
        return <XCircle className="h-4 w-4 text-red-600" />;
      case "rescheduled":
        return <AlertTriangle className="h-4 w-4 text-orange-600" />;
      default:
        return <Clock className="h-4 w-4 text-gray-600" />;
    }
  };

  return (
    <Card className="h-fit">
      <CardHeader className="pb-4">
        <CardTitle className="text-lg flex items-center gap-2">
          <CalendarIcon className="h-5 w-5 flex-shrink-0" />
          <span className="truncate">{format(selectedDate, "dd MMM yyyy")}</span>
          {visits.length > 0 && (
            <span className="text-sm font-normal bg-muted px-2 py-1 rounded-full flex-shrink-0">
              {visits.length}
            </span>
          )}
        </CardTitle>
      </CardHeader>
      <CardContent className="pt-0">
        {visits.length > 0 ? (
          <div className="space-y-3 max-h-96 overflow-y-auto">
            {visits
              .sort((a, b) => a.time.localeCompare(b.time))
              .map((visit) => (
              <div key={visit.id} className="space-y-2">
                <div className="flex items-start gap-3">
                  <div className="flex-shrink-0 mt-1">
                    {getStatusIcon(visit.status)}
                  </div>
                  <div className="flex-1 min-w-0">
                    <CalendarVisitCard
                      visit={visit}
                      onClick={() => onVisitClick(visit)}
                    />
                    
                    {/* Metadata tags */}
                    <div className="ml-2 mt-2 flex items-center gap-2 flex-wrap">
                      <div className="flex items-center gap-1 text-xs text-muted-foreground">
                        <span className="truncate max-w-32" title={visit.salesPersonName}>
                          👤 {visit.salesPersonName}
                        </span>
                      </div>
                      
                      <div className="flex gap-1 flex-wrap">
                        {visit.isUrgent && (
                          <span className="bg-red-100 text-red-800 px-1.5 py-0.5 rounded-full text-xs font-medium whitespace-nowrap">
                            Urgente
                          </span>
                        )}
                        {visit.followUp && (
                          <span className="bg-blue-100 text-blue-800 px-1.5 py-0.5 rounded-full text-xs font-medium whitespace-nowrap">
                            Seguimiento
                          </span>
                        )}
                        {visit.priority === "high" && (
                          <span className="bg-orange-100 text-orange-800 px-1.5 py-0.5 rounded-full text-xs font-medium whitespace-nowrap">
                            Alta prioridad
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-12 text-muted-foreground">
            <CalendarIcon className="h-12 w-12 mx-auto mb-3 opacity-30" />
            <p className="font-medium mb-1">No hay citas programadas</p>
            <p className="text-sm">para esta fecha</p>
          </div>
        )}
      </CardContent>
    </Card>
  );
};
