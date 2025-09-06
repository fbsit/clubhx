
import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { format, addMonths, subMonths } from "date-fns";
import { ChevronLeft, ChevronRight } from "lucide-react";

type CalendarSectionProps = {
  selectedDate: Date;
  currentMonth: Date;
  daysWithVisits: Date[];
  onDateSelect: (date: Date) => void;
  onMonthChange: (month: Date) => void;
};

export const CalendarSection: React.FC<CalendarSectionProps> = ({
  selectedDate,
  currentMonth,
  daysWithVisits,
  onDateSelect,
  onMonthChange,
}) => {
  return (
    <Card className="h-fit">
      <CardHeader className="pb-4">
        <div className="flex items-center justify-between">
          <CardTitle className="text-xl">{format(currentMonth, "MMMM yyyy")}</CardTitle>
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="icon"
              onClick={() => onMonthChange(subMonths(currentMonth, 1))}
              className="h-8 w-8"
            >
              <ChevronLeft className="h-4 w-4" />
            </Button>
            <Button
              variant="outline"
              size="icon"
              onClick={() => onMonthChange(addMonths(currentMonth, 1))}
              className="h-8 w-8"
            >
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </CardHeader>
      <CardContent className="pt-0">
        <Calendar
          mode="single"
          selected={selectedDate}
          onSelect={(date) => date && onDateSelect(date)}
          month={currentMonth}
          onMonthChange={onMonthChange}
          modifiers={{
            hasVisits: daysWithVisits,
          }}
          modifiersStyles={{
            hasVisits: {
              backgroundColor: '#dbeafe',
              color: '#1d4ed8',
              fontWeight: '600',
              borderRadius: '6px',
            },
          }}
          className="w-full"
          classNames={{
            months: "flex w-full",
            month: "w-full",
            table: "w-full border-collapse",
            head_row: "flex w-full",
            head_cell: "text-muted-foreground rounded-md w-full font-normal text-sm flex-1 text-center",
            row: "flex w-full mt-2",
            cell: "relative p-0 text-center text-sm focus-within:relative focus-within:z-20 flex-1",
            day: "h-9 w-full p-0 font-normal hover:bg-accent hover:text-accent-foreground inline-flex items-center justify-center rounded-md transition-colors",
            day_selected: "bg-primary text-primary-foreground hover:bg-primary hover:text-primary-foreground focus:bg-primary focus:text-primary-foreground",
            day_today: "bg-accent text-accent-foreground font-semibold",
            day_outside: "text-muted-foreground opacity-50",
            day_disabled: "text-muted-foreground opacity-50",
          }}
        />
      </CardContent>
    </Card>
  );
};
