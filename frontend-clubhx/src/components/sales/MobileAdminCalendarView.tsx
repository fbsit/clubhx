
import React, { useState } from "react";
import { format, isSameDay, addDays, subDays, startOfMonth, endOfMonth, eachDayOfInterval, isSameMonth, isToday } from "date-fns";
import { es } from "date-fns/locale";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { ChevronLeft, ChevronRight, Calendar as CalendarIcon } from "lucide-react";
import { cn } from "@/lib/utils";
import { AdminVisit } from "@/utils/salesScheduleStore";
import { CalendarVisitCard } from "./CalendarVisitCard";

type MobileAdminCalendarViewProps = {
  selectedDate: Date;
  currentMonth: Date;
  daysWithVisits: Date[];
  visits: AdminVisit[];
  onDateSelect: (date: Date) => void;
  onMonthChange: (date: Date) => void;
  onVisitClick: (visit: AdminVisit) => void;
};

export const MobileAdminCalendarView: React.FC<MobileAdminCalendarViewProps> = ({
  selectedDate,
  currentMonth,
  daysWithVisits,
  visits,
  onDateSelect,
  onMonthChange,
  onVisitClick,
}) => {
  const [viewMode, setViewMode] = useState<"calendar" | "list">("calendar");
  
  // Get visits for selected date
  const selectedDateVisits = visits.filter(visit => isSameDay(visit.date, selectedDate));

  // Generate calendar days
  const monthStart = startOfMonth(currentMonth);
  const monthEnd = endOfMonth(currentMonth);
  const calendarDays = eachDayOfInterval({ start: monthStart, end: monthEnd });

  const hasVisitsOnDate = (date: Date) => {
    return daysWithVisits.some(visitDate => isSameDay(visitDate, date));
  };

  const getVisitsCountForDate = (date: Date) => {
    return visits.filter(visit => isSameDay(visit.date, date)).length;
  };

  const goPrevMonth = () => onMonthChange(subDays(monthStart, 1));
  const goNextMonth = () => onMonthChange(addDays(monthEnd, 1));

  return (
    <div className="flex flex-col h-full w-full overflow-hidden">
      {/* Month Navigation */}
      <div className="flex items-center justify-between px-4 py-2 border-b bg-white sticky top-16 z-10 w-full overflow-hidden">
        <Button variant="ghost" size="icon" onClick={goPrevMonth} className="h-8 w-8 flex-shrink-0">
          <ChevronLeft className="h-4 w-4" />
        </Button>
        
        <div className="text-center flex-1 min-w-0 overflow-hidden">
          <h2 className="text-base font-semibold truncate">
            {format(currentMonth, "MMMM yyyy", { locale: es })}
          </h2>
        </div>
        
        <Button variant="ghost" size="icon" onClick={goNextMonth} className="h-8 w-8 flex-shrink-0">
          <ChevronRight className="h-4 w-4" />
        </Button>
      </div>

      {/* Calendar Grid */}
      <div className="px-4 py-2 bg-white w-full overflow-hidden">
        {/* Week headers */}
        <div className="grid grid-cols-7 gap-1 mb-2 w-full overflow-hidden">
          {['Dom', 'Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb'].map((day) => (
            <div key={day} className="text-center text-xs font-medium text-muted-foreground py-2 truncate">
              {day}
            </div>
          ))}
        </div>

        {/* Calendar days */}
        <div className="grid grid-cols-7 gap-1 w-full overflow-hidden">
          {calendarDays.map((day) => {
            const isSelected = isSameDay(day, selectedDate);
            const hasVisits = hasVisitsOnDate(day);
            const visitCount = getVisitsCountForDate(day);
            const isCurrentMonth = isSameMonth(day, currentMonth);
            const isCurrentDay = isToday(day);

            return (
              <button
                key={day.toString()}
                onClick={() => onDateSelect(day)}
                className={cn(
                  "relative h-14 w-full rounded-lg text-sm font-medium transition-colors",
                  "flex flex-col items-center justify-center min-w-0 overflow-hidden",
                  isSelected && "bg-primary text-primary-foreground",
                  !isSelected && isCurrentDay && "bg-blue-50 text-blue-600 border border-blue-200",
                  !isSelected && !isCurrentDay && isCurrentMonth && "hover:bg-muted",
                  !isCurrentMonth && "text-muted-foreground/50",
                  hasVisits && !isSelected && !isCurrentDay && "bg-green-50 text-green-700"
                )}
              >
                <span className="text-sm leading-none truncate">
                  {format(day, 'd')}
                </span>
                {hasVisits && visitCount > 0 && (
                  <div className={cn(
                    "absolute -top-0.5 -right-0.5 h-3.5 w-3.5 rounded-full text-[9px] font-bold",
                    "flex items-center justify-center leading-none flex-shrink-0",
                    isSelected ? "bg-primary-foreground text-primary" : "bg-red-500 text-white"
                  )}>
                    {visitCount}
                  </div>
                )}
              </button>
            );
          })}
        </div>
      </div>

      {/* Selected date visits */}
      <div className="flex-1 bg-gray-50 w-full overflow-hidden">
        <div className="px-4 py-2 border-b bg-white w-full overflow-hidden">
          <div className="flex items-center gap-2 min-w-0 overflow-hidden">
            <CalendarIcon className="h-4 w-4 text-primary flex-shrink-0" />
            <h3 className="font-medium truncate flex-1 min-w-0">
              {format(selectedDate, "dd 'de' MMMM", { locale: es })}
            </h3>
            {selectedDateVisits.length > 0 && (
              <span className="bg-primary/10 text-primary px-2 py-0.5 rounded-full text-xs font-medium flex-shrink-0">
                {selectedDateVisits.length}
              </span>
            )}
          </div>
        </div>

        <div className="p-4 space-y-3 pb-20 w-full overflow-hidden">
          {selectedDateVisits.length > 0 ? (
            selectedDateVisits
              .sort((a, b) => a.time.localeCompare(b.time))
              .map((visit) => (
                <div key={visit.id} className="animate-fade-in w-full overflow-hidden">
                  <CalendarVisitCard 
                    visit={visit} 
                    onClick={() => onVisitClick(visit)} 
                  />
                </div>
              ))
          ) : (
            <div className="text-center py-12 w-full overflow-hidden">
              <CalendarIcon className="h-12 w-12 mx-auto text-muted-foreground/30 mb-3" />
              <p className="text-muted-foreground font-medium">
                No hay citas programadas
              </p>
              <p className="text-sm text-muted-foreground">
                para esta fecha
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
