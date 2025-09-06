
import { ResponsiveEventCalendar } from "./ResponsiveEventCalendar";
import { CalendarSidebar } from "./CalendarSidebar";
import type { SummaryPeriod } from "./SummaryPeriodSelector";
import type { Event } from "@/types/event";

interface SummaryStats {
  total: number;
  active: number;
  past: number;
  presencial: number;
  online: number;
}

interface DesktopCalendarLayoutProps {
  currentDate: Date;
  filteredEvents: Event[];
  selectedDate: Date | null;
  selectedDayEvents: Event[];
  summaryPeriod: SummaryPeriod;
  summaryStats: SummaryStats;
  totalEventsCount: number;
  onDateSelect: (date: Date) => void;
  onPreviousMonth: () => void;
  onNextMonth: () => void;
  onToday: () => void;
  onEventClick: (event: Event) => void;
  onAddEvent: () => void;
  onSummaryPeriodChange: (period: SummaryPeriod) => void;
}

export function DesktopCalendarLayout({
  currentDate,
  filteredEvents,
  selectedDate,
  selectedDayEvents,
  summaryPeriod,
  summaryStats,
  totalEventsCount,
  onDateSelect,
  onPreviousMonth,
  onNextMonth,
  onToday,
  onEventClick,
  onAddEvent,
  onSummaryPeriodChange
}: DesktopCalendarLayoutProps) {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      <div className="lg:col-span-2">
        <ResponsiveEventCalendar
          currentDate={currentDate}
          events={filteredEvents}
          selectedDate={selectedDate}
          onDateSelect={onDateSelect}
          onPreviousMonth={onPreviousMonth}
          onNextMonth={onNextMonth}
          onToday={onToday}
        />
      </div>

      <div>
        <CalendarSidebar
          selectedDate={selectedDate}
          selectedDayEvents={selectedDayEvents}
          summaryPeriod={summaryPeriod}
          summaryStats={summaryStats}
          filteredEventsCount={filteredEvents.length}
          totalEventsCount={totalEventsCount}
          onEventClick={onEventClick}
          onAddEvent={onAddEvent}
          onSummaryPeriodChange={onSummaryPeriodChange}
        />
      </div>
    </div>
  );
}
