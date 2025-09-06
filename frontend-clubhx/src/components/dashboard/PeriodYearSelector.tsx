import React from "react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";

interface PeriodYearSelectorProps {
  selectedMonth: string;
  selectedYears: string[];
  onMonthChange: (month: string) => void;
  onYearToggle: (year: string) => void;
  hideMonth?: boolean;
}

const months = [
  { value: "01", label: "Enero" },
  { value: "02", label: "Febrero" },
  { value: "03", label: "Marzo" },
  { value: "04", label: "Abril" },
  { value: "05", label: "Mayo" },
  { value: "06", label: "Junio" },
  { value: "07", label: "Julio" },
  { value: "08", label: "Agosto" },
  { value: "09", label: "Septiembre" },
  { value: "10", label: "Octubre" },
  { value: "11", label: "Noviembre" },
  { value: "12", label: "Diciembre" },
];

const availableYears = ["2023", "2024", "2025"];

export function PeriodYearSelector({ 
  selectedMonth, 
  selectedYears, 
  onMonthChange, 
  onYearToggle,
  hideMonth = false,
}: PeriodYearSelectorProps) {
  return (
    <Card className="mb-6">
      <CardContent className="p-4">
        <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center">
          {!hideMonth && (
            <div className="flex flex-col gap-2">
              <label className="text-sm font-medium">Período</label>
              <Select value={selectedMonth} onValueChange={onMonthChange}>
                <SelectTrigger className="w-[140px]">
                  <SelectValue placeholder="Seleccionar mes" />
                </SelectTrigger>
                <SelectContent>
                  {months.map((month) => (
                    <SelectItem key={month.value} value={month.value}>
                      {month.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          )}
          
          <div className="flex flex-col gap-2">
            <label className="text-sm font-medium">Años a Comparar</label>
            <div className="flex gap-4">
              {availableYears.map((year) => (
                <div key={year} className="flex items-center space-x-2">
                  <Checkbox
                    id={year}
                    checked={selectedYears.includes(year)}
                    onCheckedChange={() => onYearToggle(year)}
                  />
                  <label
                    htmlFor={year}
                    className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                  >
                    {year}
                  </label>
                </div>
              ))}
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}