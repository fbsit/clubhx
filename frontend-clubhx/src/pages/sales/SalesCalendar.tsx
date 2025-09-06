
import React, { useEffect, useState } from "react";
import { Calendar } from "@/components/ui/calendar";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { SalesVisitCard } from "@/components/sales/SalesVisitCard";
import { NewVisitDialog } from "@/components/sales/NewVisitDialog";
import { Plus, ChevronLeft, ChevronRight, Video, MapPin, Filter, X } from "lucide-react";
import { format, isSameDay, addMonths, subMonths } from "date-fns";
import { SalesVisitDetailDialog } from "@/components/sales/SalesVisitDetailDialog";
import { CalendarSettingsDialog, CalendarSettings, WorkingHours } from "@/components/sales/CalendarSettingsDialog";
import { useIsMobile } from "@/hooks/use-mobile";
import { MobileCalendarView } from "@/components/sales/MobileCalendarView";
import { CalendarKPICards } from "@/components/sales/CalendarKPICards";
import { ImprovedSalesVisitCard } from "@/components/sales/ImprovedSalesVisitCard";
import { PersonalPerformanceSection } from "@/components/sales/PersonalPerformanceSection";
import { AdminVisit } from "@/utils/salesScheduleStore";
import { listVisits, createVisit } from "@/services/visitsApi";

// Use AdminVisit type from mock data

// Default settings
const defaultWorkingHours: WorkingHours[] = [
  { day: "mon", enabled: true, start: "09:00", end: "18:00" },
  { day: "tue", enabled: true, start: "09:00", end: "18:00" },
  { day: "wed", enabled: true, start: "09:00", end: "18:00" },
  { day: "thu", enabled: true, start: "09:00", end: "18:00" },
  { day: "fri", enabled: true, start: "09:00", end: "18:00" },
  { day: "sat", enabled: false, start: "09:00", end: "13:00" },
  { day: "sun", enabled: false, start: "09:00", end: "13:00" },
];
const defaultSettings: CalendarSettings = {
  timezone: "America/Santiago",
  workingHours: defaultWorkingHours,
};

export default function SalesCalendar() {
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());
  const [currentMonth, setCurrentMonth] = useState<Date>(new Date());
  const [visits, setVisits] = useState<AdminVisit[]>([]);
  const [isNewVisitOpen, setIsNewVisitOpen] = useState(false);
  const [showCalendarSettings, setShowCalendarSettings] = useState(false);
  const [calendarSettings, setCalendarSettings] = useState<CalendarSettings>(defaultSettings);
  const [selectedVisit, setSelectedVisit] = useState<AdminVisit | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  useEffect(() => {
    let cancelled = false;
    const from = new Date(currentMonth.getFullYear(), currentMonth.getMonth(), 1).toISOString();
    const to = new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1, 0).toISOString();
    (async () => {
      try {
        setLoading(true);
        setError(null);
        const items = await listVisits({ from, to });
        if (!cancelled) {
          setVisits(
            items.map((v) => ({
              id: v.id,
              clientName: v.customerName,
              clientCompany: v.customerName,
              date: new Date(v.date),
              time: v.time,
              duration: v.duration,
              status: v.status,
              salesPersonId: v.salesPersonId,
              salesPersonName: v.salesPersonName || "",
              visitType: v.visitType,
              meetingType: v.meetingType,
              description: v.description || "",
              location: v.meetingType === "presencial" ? v.customerName : `Videollamada - ${v.meetingLink || ""}`,
              priority: v.priority || "medium",
              isUrgent: false,
              followUp: false,
              notes: v.description || "",
              meetingLink: v.meetingLink,
            }))
          );
        }
      } catch (e: any) {
        if (!cancelled) setError(e?.message || "Error cargando visitas");
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();
    return () => { cancelled = true; };
  }, [currentMonth]);
  
  // Multi-filter state
  const [activeFilters, setActiveFilters] = useState({
    meetingTypes: [] as string[],
    visitTypes: [] as string[],
    statuses: [] as string[],
    priorities: [] as string[]
  });

  // Apply multi-filters
  const filteredVisits = visits.filter(visit => {
    // Meeting type filter
    if (activeFilters.meetingTypes.length > 0 && !activeFilters.meetingTypes.includes(visit.meetingType)) {
      return false;
    }
    
    // Visit type filter
    if (activeFilters.visitTypes.length > 0 && !activeFilters.visitTypes.includes(visit.visitType)) {
      return false;
    }
    
    // Status filter
    if (activeFilters.statuses.length > 0 && !activeFilters.statuses.includes(visit.status)) {
      return false;
    }
    
    // Priority filter
    if (activeFilters.priorities.length > 0 && !activeFilters.priorities.includes(visit.priority)) {
      return false;
    }
    
    return true;
  });

  // Get visits for selected date
  const selectedDateVisits = filteredVisits.filter(
    (visit) => isSameDay(visit.date, selectedDate)
  );

  // Get days with visits for the current month
  const daysWithVisits = filteredVisits
    .filter(
      (visit) =>
        visit.date.getMonth() === currentMonth.getMonth() &&
        visit.date.getFullYear() === currentMonth.getFullYear()
    )
    .map((visit) => visit.date);

  const handleScheduleVisit = async (visitData: {
    customerId: string;
    customerName: string;
    date: Date;
    time: string;
    purpose: string;
    notes: string;
    type: "presencial" | "videollamada";
    duration: number;
    meetingLink?: string;
  }) => {
    try {
      const created = await createVisit({
        id: "" as any,
        salesPersonId: "sp1",
        salesPersonName: "María González",
        customerId: visitData.customerId,
        customerName: visitData.customerName,
        date: visitData.date.toISOString(),
        time: visitData.time,
        duration: visitData.duration,
        status: "pending",
        visitType: "consultation",
        meetingType: visitData.type,
        description: visitData.purpose,
        meetingLink: visitData.meetingLink,
        priority: "medium",
      } as any);
      const newVisit: AdminVisit = {
        id: created.id,
        clientName: created.customerName,
        clientCompany: created.customerName,
        date: new Date(created.date),
        time: created.time,
        duration: created.duration,
        status: created.status,
        salesPersonId: created.salesPersonId,
        salesPersonName: created.salesPersonName || "",
        visitType: created.visitType,
        meetingType: created.meetingType,
        description: created.description || "",
        location: created.meetingType === "presencial" ? created.customerName : `Videollamada - ${created.meetingLink || ""}`,
        priority: created.priority || "medium",
        isUrgent: false,
        followUp: false,
        notes: created.description || "",
        meetingLink: created.meetingLink,
      };
      setVisits((prev) => [...prev, newVisit]);
    } catch (e) {
      console.error(e);
    }
  };

  const handleVisitClick = (visit: AdminVisit) => {
    setSelectedVisit(visit);
  };

  // Helper to get zona horaria label
  const tzLabel = calendarSettings.timezone;

  const isMobile = useIsMobile();

  return (
    <div className="h-full bg-background">
      {/* Header */}
      <div className="bg-white border-b border-border px-4 sm:px-6 py-4">
        <div className="space-y-4">
          {/* Title and main actions */}
          <div className="flex items-center justify-between gap-3">
            <div>
              <h1 className="text-2xl font-bold text-foreground">Mi Calendario</h1>
              <p className="text-sm text-muted-foreground">
                Gestiona tus citas programadas
              </p>
              {/* Mostrar zona horaria */}
              <span className="mt-1 text-xs text-slate-500">Zona horaria: <b>{tzLabel}</b></span>
            </div>
            <div className="flex items-center gap-2">
              <Button
                onClick={() => setShowCalendarSettings(true)}
                variant="outline"
                className="hidden sm:flex"
              >
                Configurar calendario
              </Button>
              <Button onClick={() => setIsNewVisitOpen(true)}>
                <Plus className="h-4 w-4 mr-2" />
                <span className="hidden sm:inline">Nueva Cita</span>
                <span className="sm:hidden">Nueva</span>
              </Button>
            </div>
          </div>
          
          {/* Filters section - separate row for mobile */}
          <div className="flex flex-wrap items-center gap-3">
            {/* Multi-Filter Popover */}
            <Popover>
              <PopoverTrigger asChild>
                <Button variant="outline" className="gap-2">
                  <Filter className="h-4 w-4" />
                  <span className="hidden sm:inline">Filtros</span>
                  {(activeFilters.meetingTypes.length + activeFilters.visitTypes.length + activeFilters.statuses.length + activeFilters.priorities.length) > 0 && (
                    <Badge variant="secondary" className="ml-1 px-1.5 py-0.5 text-xs">
                      {activeFilters.meetingTypes.length + activeFilters.visitTypes.length + activeFilters.statuses.length + activeFilters.priorities.length}
                    </Badge>
                  )}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-80" align="start">
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <h4 className="font-medium">Filtros de Citas</h4>
                    <Button 
                      variant="ghost" 
                      size="sm"
                      onClick={() => setActiveFilters({ meetingTypes: [], visitTypes: [], statuses: [], priorities: [] })}
                      className="text-xs"
                    >
                      Limpiar todo
                    </Button>
                  </div>
                  
                  {/* Meeting Type Filters */}
                  <div>
                    <h5 className="text-sm font-medium mb-2">Tipo de Reunión</h5>
                    <div className="space-y-2">
                      {[
                        { value: "presencial", label: "Presencial", icon: MapPin },
                        { value: "videollamada", label: "Videollamada", icon: Video }
                      ].map((type) => (
                        <div key={type.value} className="flex items-center space-x-2">
                          <Checkbox
                            id={`meeting-${type.value}`}
                            checked={activeFilters.meetingTypes.includes(type.value)}
                            onCheckedChange={(checked) => {
                              if (checked) {
                                setActiveFilters(prev => ({
                                  ...prev,
                                  meetingTypes: [...prev.meetingTypes, type.value]
                                }));
                              } else {
                                setActiveFilters(prev => ({
                                  ...prev,
                                  meetingTypes: prev.meetingTypes.filter(t => t !== type.value)
                                }));
                              }
                            }}
                          />
                          <label htmlFor={`meeting-${type.value}`} className="text-sm flex items-center gap-2">
                            <type.icon className="h-3 w-3" />
                            {type.label}
                          </label>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Visit Type Filters */}
                  <div>
                    <h5 className="text-sm font-medium mb-2">Propósito de la Cita</h5>
                    <div className="space-y-2">
                      {[
                        { value: "product_presentation", label: "Presentación de productos nuevos" },
                        { value: "order_followup", label: "Seguimiento de pedidos" },
                        { value: "price_negotiation", label: "Negociación de precios/descuentos" },
                        { value: "product_training", label: "Capacitación en productos" },
                        { value: "problem_resolution", label: "Resolución de problemas/quejas" },
                        { value: "commercial_strategy", label: "Planificación estrategia comercial" },
                        { value: "courtesy_visit", label: "Visita de cortesía/mantenimiento" },
                        { value: "payment_management", label: "Gestión de cobranzas" },
                        { value: "prospecting", label: "Prospección/primera visita" },
                        { value: "contract_renewal", label: "Renovación de contrato" },
                        { value: "consultation", label: "Consulta general" },
                        { value: "technical_support", label: "Soporte técnico" },
                        { value: "other", label: "Otro" }
                      ].map((type) => (
                        <div key={type.value} className="flex items-center space-x-2">
                          <Checkbox
                            id={`visit-${type.value}`}
                            checked={activeFilters.visitTypes.includes(type.value)}
                            onCheckedChange={(checked) => {
                              if (checked) {
                                setActiveFilters(prev => ({
                                  ...prev,
                                  visitTypes: [...prev.visitTypes, type.value]
                                }));
                              } else {
                                setActiveFilters(prev => ({
                                  ...prev,
                                  visitTypes: prev.visitTypes.filter(t => t !== type.value)
                                }));
                              }
                            }}
                          />
                          <label htmlFor={`visit-${type.value}`} className="text-sm">
                            {type.label}
                          </label>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Status Filters */}
                  <div>
                    <h5 className="text-sm font-medium mb-2">Estado</h5>
                    <div className="space-y-2">
                      {[
                        { value: "pending", label: "Pendiente" },
                        { value: "confirmed", label: "Confirmada" },
                        { value: "completed", label: "Completada" },
                        { value: "cancelled", label: "Cancelada" },
                        { value: "rescheduled", label: "Reagendada" }
                      ].map((status) => (
                        <div key={status.value} className="flex items-center space-x-2">
                          <Checkbox
                            id={`status-${status.value}`}
                            checked={activeFilters.statuses.includes(status.value)}
                            onCheckedChange={(checked) => {
                              if (checked) {
                                setActiveFilters(prev => ({
                                  ...prev,
                                  statuses: [...prev.statuses, status.value]
                                }));
                              } else {
                                setActiveFilters(prev => ({
                                  ...prev,
                                  statuses: prev.statuses.filter(s => s !== status.value)
                                }));
                              }
                            }}
                          />
                          <label htmlFor={`status-${status.value}`} className="text-sm">
                            {status.label}
                          </label>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Priority Filters */}
                  <div>
                    <h5 className="text-sm font-medium mb-2">Prioridad</h5>
                    <div className="space-y-2">
                      {[
                        { value: "high", label: "Alta" },
                        { value: "medium", label: "Media" },
                        { value: "low", label: "Baja" }
                      ].map((priority) => (
                        <div key={priority.value} className="flex items-center space-x-2">
                          <Checkbox
                            id={`priority-${priority.value}`}
                            checked={activeFilters.priorities.includes(priority.value)}
                            onCheckedChange={(checked) => {
                              if (checked) {
                                setActiveFilters(prev => ({
                                  ...prev,
                                  priorities: [...prev.priorities, priority.value]
                                }));
                              } else {
                                setActiveFilters(prev => ({
                                  ...prev,
                                  priorities: prev.priorities.filter(p => p !== priority.value)
                                }));
                              }
                            }}
                          />
                          <label htmlFor={`priority-${priority.value}`} className="text-sm">
                            {priority.label}
                          </label>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </PopoverContent>
            </Popover>

            {/* Calendar settings for mobile */}
            <Button
              onClick={() => setShowCalendarSettings(true)}
              variant="outline"
              className="sm:hidden"
              size="sm"
            >
              Configurar
            </Button>

            {/* Active Filters Display */}
            {(activeFilters.meetingTypes.length + activeFilters.visitTypes.length + activeFilters.statuses.length + activeFilters.priorities.length) > 0 && (
              <div className="flex items-center gap-1 flex-wrap w-full sm:w-auto">
                {activeFilters.meetingTypes.map(type => (
                  <Badge key={`meeting-${type}`} variant="secondary" className="text-xs">
                    {type === "presencial" ? "Presencial" : "Videollamada"}
                    <X 
                      className="h-3 w-3 ml-1 cursor-pointer" 
                      onClick={() => setActiveFilters(prev => ({
                        ...prev,
                        meetingTypes: prev.meetingTypes.filter(t => t !== type)
                      }))}
                    />
                  </Badge>
                ))}
                {activeFilters.visitTypes.map(type => (
                  <Badge key={`visit-${type}`} variant="secondary" className="text-xs">
                    {type === "product_presentation" ? "Presentación productos" : 
                     type === "order_followup" ? "Seguimiento pedidos" :
                     type === "price_negotiation" ? "Negociación precios" :
                     type === "product_training" ? "Capacitación" :
                     type === "problem_resolution" ? "Resolución problemas" :
                     type === "commercial_strategy" ? "Estrategia comercial" :
                     type === "courtesy_visit" ? "Visita cortesía" :
                     type === "payment_management" ? "Gestión cobranzas" :
                     type === "prospecting" ? "Prospección" :
                     type === "contract_renewal" ? "Renovación contrato" :
                     type === "consultation" ? "Consulta" :
                     type === "technical_support" ? "Soporte técnico" : "Otro"}
                    <X 
                      className="h-3 w-3 ml-1 cursor-pointer" 
                      onClick={() => setActiveFilters(prev => ({
                        ...prev,
                        visitTypes: prev.visitTypes.filter(t => t !== type)
                      }))}
                    />
                  </Badge>
                ))}
                {activeFilters.statuses.map(status => (
                  <Badge key={`status-${status}`} variant="secondary" className="text-xs">
                    {status === "pending" ? "Pendiente" :
                     status === "confirmed" ? "Confirmada" :
                     status === "completed" ? "Completada" :
                     status === "cancelled" ? "Cancelada" : "Reagendada"}
                    <X 
                      className="h-3 w-3 ml-1 cursor-pointer" 
                      onClick={() => setActiveFilters(prev => ({
                        ...prev,
                        statuses: prev.statuses.filter(s => s !== status)
                      }))}
                    />
                  </Badge>
                ))}
                {activeFilters.priorities.map(priority => (
                  <Badge key={`priority-${priority}`} variant="secondary" className="text-xs">
                    {priority === "high" ? "Alta" : priority === "medium" ? "Media" : "Baja"}
                    <X 
                      className="h-3 w-3 ml-1 cursor-pointer" 
                      onClick={() => setActiveFilters(prev => ({
                        ...prev,
                        priorities: prev.priorities.filter(p => p !== priority)
                      }))}
                    />
                  </Badge>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="p-6 space-y-6">
        {loading && <div className="text-sm text-muted-foreground">Cargando…</div>}
        {error && <div className="text-sm text-red-600">{error}</div>}
        {isMobile ? (
          // Mobile optimized view
          <MobileCalendarView
            selectedDate={selectedDate}
            setSelectedDate={setSelectedDate}
            visits={filteredVisits}
            onNewVisit={() => setIsNewVisitOpen(true)}
            onVisitClick={handleVisitClick}
            currentMonth={currentMonth}
            setCurrentMonth={setCurrentMonth}
            activeFilters={activeFilters}
            onFiltersChange={setActiveFilters}
          />
        ) : (
          <>
            {/* KPI Cards */}
            <CalendarKPICards visits={visits} currentMonth={currentMonth} />

            {/* Main Layout - Calendar and Selected Day */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Calendar Section - Takes more space */}
              <div className="lg:col-span-2">
                <Card className="overflow-hidden">
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <CardTitle className="text-xl">{format(currentMonth, "MMMM yyyy")}</CardTitle>
                      <div className="flex items-center gap-2">
                        <Button
                          variant="outline"
                          size="icon"
                          onClick={() => setCurrentMonth(subMonths(currentMonth, 1))}
                        >
                          <ChevronLeft className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="outline"
                          onClick={() => setCurrentMonth(new Date())}
                          size="sm"
                        >
                          Hoy
                        </Button>
                        <Button
                          variant="outline"
                          size="icon"
                          onClick={() => setCurrentMonth(addMonths(currentMonth, 1))}
                        >
                          <ChevronRight className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent className="p-4">
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
                          backgroundColor: 'hsl(var(--primary) / 0.1)',
                          border: '2px solid hsl(var(--primary))',
                          color: 'hsl(var(--primary))',
                          fontWeight: '600',
                          borderRadius: '6px',
                        },
                        today: {
                          backgroundColor: 'hsl(var(--accent))',
                          color: 'hsl(var(--accent-foreground))',
                          fontWeight: '600',
                          border: '2px solid hsl(var(--primary))',
                        }
                      }}
                      className="w-full pointer-events-auto rounded-md border-0"
                      classNames={{
                        months: "flex flex-col sm:flex-row space-y-4 sm:space-x-4 sm:space-y-0 w-full",
                        month: "space-y-4 w-full",
                        caption: "flex justify-center pt-1 relative items-center mb-4",
                        caption_label: "text-lg font-semibold",
                        nav: "space-x-1 flex items-center",
                        nav_button: "h-8 w-8 bg-transparent p-0 opacity-50 hover:opacity-100 border border-input hover:bg-accent hover:text-accent-foreground rounded-md",
                        nav_button_previous: "absolute left-1",
                        nav_button_next: "absolute right-1",
                        table: "w-full border-collapse",
                        head_row: "flex w-full mb-2",
                        head_cell: "text-muted-foreground rounded-md flex-1 font-medium text-sm text-center py-2",
                        row: "flex w-full mb-1",
                        cell: "text-center text-sm p-1 relative flex-1 min-h-[50px] max-h-[50px]",
                        day: "h-full w-full p-2 font-normal hover:bg-accent hover:text-accent-foreground rounded-lg transition-all duration-200 relative overflow-hidden border-2 border-transparent",
                        day_selected: "bg-primary text-primary-foreground hover:bg-primary hover:text-primary-foreground focus:bg-primary focus:text-primary-foreground border-primary ring-2 ring-primary ring-offset-2 shadow-lg transform scale-105",
                        day_today: "bg-accent text-accent-foreground font-semibold border-accent",
                        day_outside: "text-muted-foreground opacity-50",
                        day_disabled: "text-muted-foreground opacity-50",
                        day_range_middle: "aria-selected:bg-accent aria-selected:text-accent-foreground",
                        day_hidden: "invisible",
                      }}
                    />
                  </CardContent>
                </Card>
              </div>

              {/* Selected Day Visits */}
              <div className="lg:col-span-1">
                <Card className="sticky top-6">
                  <CardHeader className="pb-3">
                    <CardTitle className="text-lg flex items-center gap-2">
                      <div className="w-3 h-3 bg-primary rounded-full animate-pulse"></div>
                      Citas - {format(selectedDate, "dd MMM yyyy")}
                    </CardTitle>
                    <p className="text-sm text-muted-foreground">
                      Fecha seleccionada en el calendario
                    </p>
                  </CardHeader>
                  <CardContent className="max-h-[500px] overflow-y-auto">
                    {selectedDateVisits.length > 0 ? (
                      <div className="space-y-3">
                        {selectedDateVisits.map((visit) => (
                          <ImprovedSalesVisitCard
                            key={visit.id}
                            visit={visit}
                            onClick={() => handleVisitClick(visit)}
                          />
                        ))}
                      </div>
                    ) : (
                      <div className="text-center py-8 text-muted-foreground">
                        <p className="mb-3">
                          No hay citas programadas para esta fecha
                        </p>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => setIsNewVisitOpen(true)}
                        >
                          <Plus className="h-4 w-4 mr-1" />
                          Programar Cita
                        </Button>
                      </div>
                    )}
                  </CardContent>
                </Card>
              </div>
            </div>

            {/* Personal Performance Section */}
            <PersonalPerformanceSection visits={visits} currentMonth={currentMonth} />
          </>
        )}
      </div>

      {/* New Visit Dialog */}
      <NewVisitDialog
        isOpen={isNewVisitOpen}
        onClose={() => setIsNewVisitOpen(false)}
        onSchedule={handleScheduleVisit}
        calendarSettings={calendarSettings}
      />
      {/* Visit Detail Dialog */}
      <SalesVisitDetailDialog open={!!selectedVisit} visit={selectedVisit} onClose={() => setSelectedVisit(null)} />
      <CalendarSettingsDialog
        open={showCalendarSettings}
        initialSettings={calendarSettings}
        onSave={setCalendarSettings}
        onClose={() => setShowCalendarSettings(false)}
      />
    </div>
  );
}
