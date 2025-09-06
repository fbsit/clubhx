import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { format, isSameDay, addDays, subDays, addMonths, subMonths } from "date-fns";
import { ChevronLeft, ChevronRight, Plus, Calendar as CalendarIcon, Clock, User, MapPin, Video, Filter } from "lucide-react";
import { AdminVisit } from "@/utils/salesScheduleStore";

type MobileCalendarViewProps = {
  selectedDate: Date;
  setSelectedDate: (date: Date) => void;
  visits: AdminVisit[];
  onNewVisit: () => void;
  onVisitClick: (visit: AdminVisit) => void;
  currentMonth: Date;
  setCurrentMonth: (date: Date) => void;
  activeFilters: {
    meetingTypes: string[];
    visitTypes: string[];
    statuses: string[];
    priorities: string[];
  };
  onFiltersChange: (filters: {
    meetingTypes: string[];
    visitTypes: string[];
    statuses: string[];
    priorities: string[];
  }) => void;
};

// Mobile KPI Card Component
const MobileKPICard = ({ 
  title, 
  value, 
  icon: Icon, 
  color = "bg-card"
}: {
  title: string;
  value: number;
  icon: React.ComponentType<any>;
  color?: string;
}) => (
  <Card className={`${color} border hover:shadow-md transition-shadow`}>
    <CardContent className="p-3">
      <div className="flex items-center gap-3">
        <div className="p-2 bg-primary/10 rounded-lg">
          <Icon className="h-4 w-4 text-primary" />
        </div>
        <div>
          <p className="text-lg font-bold">{value}</p>
          <p className="text-xs text-muted-foreground">{title}</p>
        </div>
      </div>
    </CardContent>
  </Card>
);

// Mobile Visit Card Component
const MobileVisitCard = ({ 
  visit, 
  onClick 
}: { 
  visit: AdminVisit; 
  onClick: () => void;
}) => {
  const getStatusColor = (status: string) => {
    switch (status) {
      case "confirmed": return "bg-green-100 text-green-800";
      case "pending": return "bg-yellow-100 text-yellow-800";
      case "completed": return "bg-blue-100 text-blue-800";
      case "cancelled": return "bg-red-100 text-red-800";
      case "rescheduled": return "bg-orange-100 text-orange-800";
      default: return "bg-gray-100 text-gray-800";
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case "confirmed": return "Confirmada";
      case "pending": return "Pendiente";
      case "completed": return "Completada";
      case "cancelled": return "Cancelada";
      case "rescheduled": return "Reagendada";
      default: return status;
    }
  };

  return (
    <Card className="hover:shadow-md transition-shadow cursor-pointer" onClick={onClick}>
      <CardContent className="p-4">
        <div className="flex justify-between items-start mb-2">
          <div className="flex-1">
            <h3 className="font-semibold text-sm">{visit.clientName}</h3>
            <p className="text-xs text-muted-foreground">{visit.clientCompany}</p>
          </div>
          <Badge className={getStatusColor(visit.status)}>
            {getStatusText(visit.status)}
          </Badge>
        </div>
        
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <Clock className="h-3 w-3 text-muted-foreground" />
            <span className="text-xs">{visit.time} ({visit.duration} min)</span>
          </div>
          <div className="flex items-center gap-2">
            <User className="h-3 w-3 text-muted-foreground" />
            <span className="text-xs">{visit.description}</span>
          </div>
          <div className="flex items-center gap-2">
            {visit.meetingType === "presencial" ? (
              <MapPin className="h-3 w-3 text-muted-foreground" />
            ) : (
              <Video className="h-3 w-3 text-muted-foreground" />
            )}
            <span className="text-xs">
              {visit.meetingType === "presencial" ? visit.location : "Videollamada"}
            </span>
            <Badge 
              variant="outline" 
              className={`text-xs ml-auto ${
                visit.meetingType === "presencial" 
                  ? "border-green-300 text-green-700" 
                  : "border-blue-300 text-blue-700"
              }`}
            >
              {visit.meetingType === "presencial" ? "Presencial" : "Video"}
            </Badge>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export const MobileCalendarView: React.FC<MobileCalendarViewProps> = ({
  selectedDate,
  setSelectedDate,
  visits,
  onNewVisit,
  onVisitClick,
  currentMonth,
  setCurrentMonth,
  activeFilters,
  onFiltersChange,
}) => {
  const [showFullCalendar, setShowFullCalendar] = useState(false);

  // Filter visits for current month for KPIs
  const monthVisits = visits.filter(
    (visit) =>
      visit.date.getMonth() === currentMonth.getMonth() &&
      visit.date.getFullYear() === currentMonth.getFullYear()
  );

  // Filter visits for selected date
  const todayVisits = visits.filter(v => isSameDay(v.date, selectedDate));

  // Get days with visits for the current month
  const daysWithVisits = visits
    .filter(
      (visit) =>
        visit.date.getMonth() === currentMonth.getMonth() &&
        visit.date.getFullYear() === currentMonth.getFullYear()
    )
    .map((visit) => visit.date);

  const totalVisits = monthVisits.length;
  const confirmedVisits = monthVisits.filter(v => v.status === "confirmed").length;
  const pendingVisits = monthVisits.filter(v => v.status === "pending").length;
  const completedVisits = monthVisits.filter(v => v.status === "completed").length;

  // Navigation functions
  const goPrevDay = () => setSelectedDate(subDays(selectedDate, 1));
  const goNextDay = () => setSelectedDate(addDays(selectedDate, 1));

  return (
    <div className="space-y-4 px-4 pb-24">
      {/* KPI Cards Row */}
      <div className="grid grid-cols-2 gap-3">
        <MobileKPICard
          title="Total Citas"
          value={totalVisits}
          icon={CalendarIcon}
          color="bg-slate-50"
        />
        <MobileKPICard
          title="Confirmadas"
          value={confirmedVisits}
          icon={CalendarIcon}
          color="bg-green-50"
        />
        <MobileKPICard
          title="Pendientes"
          value={pendingVisits}
          icon={Clock}
          color="bg-yellow-50"
        />
        <MobileKPICard
          title="Completadas"
          value={completedVisits}
          icon={CalendarIcon}
          color="bg-blue-50"
        />
      </div>

      {/* Active Filters Summary */}
      <Card>
        <CardContent className="p-4">
          <div className="flex items-center justify-between mb-3">
            <h3 className="font-medium">Filtros Activos</h3>
            <span className="text-xs text-muted-foreground">
              {activeFilters.meetingTypes.length + activeFilters.visitTypes.length + activeFilters.statuses.length + activeFilters.priorities.length} filtros
            </span>
          </div>
          
          {(activeFilters.meetingTypes.length + activeFilters.visitTypes.length + activeFilters.statuses.length + activeFilters.priorities.length) === 0 ? (
            <p className="text-sm text-muted-foreground">No hay filtros activos</p>
          ) : (
            <div className="space-y-2">
              {activeFilters.meetingTypes.length > 0 && (
                <div className="flex flex-wrap gap-1">
                  <span className="text-xs font-medium">Reunión:</span>
                  {activeFilters.meetingTypes.map(type => (
                    <Badge key={type} variant="secondary" className="text-xs">
                      {type === "presencial" ? "Presencial" : "Videollamada"}
                    </Badge>
                  ))}
                </div>
              )}
              {activeFilters.visitTypes.length > 0 && (
                <div className="flex flex-wrap gap-1">
                  <span className="text-xs font-medium">Propósito:</span>
                  {activeFilters.visitTypes.map(type => (
                    <Badge key={type} variant="secondary" className="text-xs">
                      {type === "product_presentation" ? "Presentación" : 
                       type === "order_followup" ? "Seguimiento" :
                       type === "price_negotiation" ? "Negociación" :
                       type === "product_training" ? "Capacitación" :
                       type === "problem_resolution" ? "Resolución" :
                       type === "commercial_strategy" ? "Estrategia" :
                       type === "courtesy_visit" ? "Cortesía" :
                       type === "payment_management" ? "Cobranzas" :
                       type === "prospecting" ? "Prospección" :
                       type === "contract_renewal" ? "Renovación" :
                       type === "consultation" ? "Consulta" :
                       type === "technical_support" ? "Soporte" : "Otro"}
                    </Badge>
                  ))}
                </div>
              )}
              {activeFilters.statuses.length > 0 && (
                <div className="flex flex-wrap gap-1">
                  <span className="text-xs font-medium">Estado:</span>
                  {activeFilters.statuses.map(status => (
                    <Badge key={status} variant="secondary" className="text-xs">
                      {status === "pending" ? "Pendiente" :
                       status === "confirmed" ? "Confirmada" :
                       status === "completed" ? "Completada" :
                       status === "cancelled" ? "Cancelada" : "Reagendada"}
                    </Badge>
                  ))}
                </div>
              )}
              {activeFilters.priorities.length > 0 && (
                <div className="flex flex-wrap gap-1">
                  <span className="text-xs font-medium">Prioridad:</span>
                  {activeFilters.priorities.map(priority => (
                    <Badge key={priority} variant="secondary" className="text-xs">
                      {priority === "high" ? "Alta" : priority === "medium" ? "Media" : "Baja"}
                    </Badge>
                  ))}
                </div>
              )}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Calendar Toggle Button */}
      <Card>
        <CardContent className="p-4">
          <Button 
            variant="outline" 
            className="w-full justify-between"
            onClick={() => setShowFullCalendar(!showFullCalendar)}
          >
            <span>{format(currentMonth, "MMMM yyyy")}</span>
            <ChevronRight className={`h-4 w-4 transition-transform ${showFullCalendar ? 'rotate-90' : ''}`} />
          </Button>
        </CardContent>
      </Card>

      {/* Full Calendar (Collapsible) */}
      {showFullCalendar && (
        <Card>
          <CardHeader className="pb-2">
            <div className="flex items-center justify-between">
              <CardTitle className="text-base">{format(currentMonth, "MMMM yyyy")}</CardTitle>
              <div className="flex items-center gap-1">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setCurrentMonth(subMonths(currentMonth, 1))}
                >
                  <ChevronLeft className="h-4 w-4" />
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setCurrentMonth(new Date())}
                >
                  Hoy
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setCurrentMonth(addMonths(currentMonth, 1))}
                >
                  <ChevronRight className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </CardHeader>
          <CardContent className="p-2">
            <Calendar
              mode="single"
              selected={selectedDate}
              onSelect={(date) => date && setSelectedDate(date)}
              month={currentMonth}
              onMonthChange={setCurrentMonth}
              modifiers={{
                hasVisits: daysWithVisits,
                today: [new Date()],
              }}
              modifiersStyles={{
                hasVisits: {
                  backgroundColor: 'hsl(var(--primary))',
                  color: 'hsl(var(--primary-foreground))',
                  fontWeight: '600',
                  borderRadius: '6px',
                },
                today: {
                  backgroundColor: 'hsl(var(--accent))',
                  color: 'hsl(var(--accent-foreground))',
                  fontWeight: '600',
                }
              }}
              className="w-full pointer-events-auto rounded-md border-0"
            />
          </CardContent>
        </Card>
      )}

      {/* Selected Date Navigation */}
      <Card>
        <CardContent className="p-4">
          <div className="flex items-center justify-between">
            <Button variant="ghost" size="sm" onClick={goPrevDay}>
              <ChevronLeft className="h-4 w-4" />
            </Button>
            <div className="text-center">
              <h2 className="font-semibold">{format(selectedDate, "dd MMM yyyy")}</h2>
              <p className="text-xs text-muted-foreground">{format(selectedDate, "EEEE")}</p>
            </div>
            <Button variant="ghost" size="sm" onClick={goNextDay}>
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Visits for Selected Date */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="text-base">
              Citas del día ({todayVisits.length})
            </CardTitle>
            <Button size="sm" onClick={onNewVisit}>
              <Plus className="h-4 w-4 mr-1" />
              Nueva
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          {todayVisits.length > 0 ? (
            <div className="space-y-3">
              {todayVisits.map((visit) => (
                <MobileVisitCard
                  key={visit.id}
                  visit={visit}
                  onClick={() => onVisitClick(visit)}
                />
              ))}
            </div>
          ) : (
            <div className="text-center py-6 text-muted-foreground">
              <p className="mb-3 text-sm">No hay citas para esta fecha</p>
              <Button variant="outline" size="sm" onClick={onNewVisit}>
                <Plus className="h-4 w-4 mr-1" />
                Programar Cita
              </Button>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};