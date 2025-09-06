
import { CalendarEventsList } from "./CalendarEventsList";
import { CalendarSummaryCard } from "./CalendarSummaryCard";
import type { SummaryPeriod } from "./SummaryPeriodSelector";
import type { Event } from "@/types/event";

interface SummaryStats {
  total: number;
  active: number;
  past: number;
  presencial: number;
  online: number;
}

interface CalendarSidebarProps {
  selectedDate: Date | null;
  selectedDayEvents: Event[];
  summaryPeriod: SummaryPeriod;
  summaryStats: SummaryStats;
  filteredEventsCount: number;
  totalEventsCount: number;
  onEventClick: (event: Event) => void;
  onAddEvent: () => void;
  onSummaryPeriodChange: (period: SummaryPeriod) => void;
}

export function CalendarSidebar({
  selectedDate,
  selectedDayEvents,
  summaryPeriod,
  summaryStats,
  filteredEventsCount,
  totalEventsCount,
  onEventClick,
  onAddEvent,
  onSummaryPeriodChange
}: CalendarSidebarProps) {
  return (
    <div>
      <CalendarEventsList
        selectedDate={selectedDate}
        events={selectedDayEvents}
        onEventClick={onEventClick}
        onAddEvent={onAddEvent}
      />

      <div className="mt-4">
        <CalendarSummaryCard
          summaryPeriod={summaryPeriod}
          onSummaryPeriodChange={onSummaryPeriodChange}
          summaryStats={summaryStats}
          filteredEventsCount={filteredEventsCount}
          totalEventsCount={totalEventsCount}
        />
      </div>
    </div>
  );
}
