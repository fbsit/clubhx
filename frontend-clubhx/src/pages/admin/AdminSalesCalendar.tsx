
import React, { useState, useEffect } from "react";
import { isSameDay } from "date-fns";
import { CalendarHeader } from "@/components/sales/CalendarHeader";
import { CalendarStatsCards } from "@/components/sales/CalendarStatsCards";
import { CalendarSection } from "@/components/sales/CalendarSection";
import { DailyVisitsList } from "@/components/sales/DailyVisitsList";
import { TeamActivitySummary } from "@/components/sales/TeamActivitySummary";
import { VisitDetailDialog } from "@/components/sales/VisitDetailDialog";
import { MobileAdminCalendarHeader } from "@/components/sales/MobileAdminCalendarHeader";
import { MobileAdminCalendarStats } from "@/components/sales/MobileAdminCalendarStats";
import { MobileAdminCalendarView } from "@/components/sales/MobileAdminCalendarView";
import { useIsMobile } from "@/hooks/use-mobile";
import { AdminVisit } from "@/utils/salesScheduleStore";
import { listVisits } from "@/services/visitsApi";
const salesPeople: any[] = [];

export default function AdminSalesCalendar() {
  const [isLoading, setIsLoading] = useState(true);
  const [selectedDate, setSelectedDate] = useState<Date>(new Date(2024, 11, 15));
  const [currentMonth, setCurrentMonth] = useState<Date>(new Date(2024, 11, 15));
  const [selectedSalesPerson, setSelectedSalesPerson] = useState<string>("all");
  const [selectedVisit, setSelectedVisit] = useState<AdminVisit | null>(null);
  const isMobile = useIsMobile();

  // Load visits for the month
  useEffect(() => {
    let cancelled = false;
    const from = new Date(currentMonth.getFullYear(), currentMonth.getMonth(), 1).toISOString();
    const to = new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1, 0).toISOString();
    (async () => {
      setIsLoading(true);
      try {
        const items = await listVisits({ from, to });
        if (!cancelled) {
          // For now we won’t store globally; filtering is simple in place
        }
      } finally {
        if (!cancelled) setIsLoading(false);
      }
    })();
    return () => { cancelled = true; };
  }, [currentMonth]);

  // Early loading state
  if (isLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-8 w-8 border-4 border-solid border-primary border-r-transparent"></div>
          <p className="mt-2 text-muted-foreground">Cargando calendario...</p>
        </div>
      </div>
    );
  }

  // Calculate performance metrics for filtering
  const salesPersonMetrics = salesPeople.map(person => {
    const personVisits: AdminVisit[] = [];
    const completedVisits = personVisits.filter(visit => visit.status === "completed").length;
    const totalVisits = personVisits.length;
    const successRate = totalVisits > 0 ? (completedVisits / totalVisits) * 100 : 0;
    
    return {
      ...person,
      successRate,
    };
  });

  // Filter visits based on selected criteria
  const getFilteredVisits = () => {
    if (selectedSalesPerson === "all") {
      return [] as AdminVisit[];
    } else if (selectedSalesPerson === "top") {
      // Top performers (success rate >= 80%)
      const topPerformerIds = salesPersonMetrics
        .filter(person => person.successRate >= 80)
        .map(person => person.id);
      return [] as AdminVisit[];
    } else if (selectedSalesPerson === "low") {
      // Low performers (success rate < 50%)
      const lowPerformerIds = salesPersonMetrics
        .filter(person => person.successRate < 50 && person.successRate > 0)
        .map(person => person.id);
      return [] as AdminVisit[];
    } else {
      // Individual salesperson
      return [] as AdminVisit[];
    }
  };

  const filteredVisits = getFilteredVisits();

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

  // Calculate stats for current month
  const monthVisits = filteredVisits.filter(v => 
    v.date.getMonth() === currentMonth.getMonth() &&
    v.date.getFullYear() === currentMonth.getFullYear()
  );

  const stats = {
    total: monthVisits.length,
    confirmed: monthVisits.filter(v => v.status === "confirmed").length,
    pending: monthVisits.filter(v => v.status === "pending").length,
    completed: monthVisits.filter(v => v.status === "completed").length,
    cancelled: monthVisits.filter(v => v.status === "cancelled").length,
    rescheduled: monthVisits.filter(v => v.status === "rescheduled").length,
  };

  const handleVisitClick = (visit: AdminVisit) => {
    setSelectedVisit(visit);
  };

  // Mobile Layout
  if (isMobile) {
    return (
      <div className="min-h-screen bg-background flex flex-col">
        <MobileAdminCalendarHeader 
          selectedSalesPerson={selectedSalesPerson}
          onSalesPersonChange={setSelectedSalesPerson}
        />
        
        <MobileAdminCalendarStats stats={stats} />
        
        <div className="flex-1">
          <MobileAdminCalendarView
            selectedDate={selectedDate}
            currentMonth={currentMonth}
            daysWithVisits={daysWithVisits}
            visits={selectedDateVisits}
            onDateSelect={setSelectedDate}
            onMonthChange={setCurrentMonth}
            onVisitClick={handleVisitClick}
          />
        </div>

        {/* Visit Detail Dialog */}
        <VisitDetailDialog 
          open={!!selectedVisit} 
          visit={selectedVisit} 
          onClose={() => setSelectedVisit(null)} 
        />
      </div>
    );
  }

  // Desktop Layout
  return (
    <div className="min-h-screen bg-background">
      <CalendarHeader 
        selectedSalesPerson={selectedSalesPerson}
        onSalesPersonChange={setSelectedSalesPerson}
      />

      <div className="p-6 max-w-7xl mx-auto space-y-6">
        <CalendarStatsCards stats={stats} />

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
          {/* Calendar Section */}
          <div className="lg:col-span-3">
            <CalendarSection 
              selectedDate={selectedDate}
              currentMonth={currentMonth}
              daysWithVisits={daysWithVisits}
              onDateSelect={setSelectedDate}
              onMonthChange={setCurrentMonth}
            />
          </div>

          {/* Right Sidebar */}
          <div className="lg:col-span-2 space-y-6">
            <DailyVisitsList 
              selectedDate={selectedDate}
              visits={selectedDateVisits}
              onVisitClick={handleVisitClick}
            />

            <TeamActivitySummary monthVisits={monthVisits} />
          </div>
        </div>
      </div>

      {/* Visit Detail Dialog */}
      <VisitDetailDialog 
        open={!!selectedVisit} 
        visit={selectedVisit} 
        onClose={() => setSelectedVisit(null)} 
      />
    </div>
  );
}
