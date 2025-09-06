import React, { useState } from "react";
import { PeriodYearSelector } from "./PeriodYearSelector";
import { SalesComparisonChart } from "./SalesComparisonChart";
import { ClientsComparisonChart } from "./ClientsComparisonChart";

export function YearComparisonCharts() {
  const [selectedMonth, setSelectedMonth] = useState("07"); // Julio por defecto
  const [selectedYears, setSelectedYears] = useState(["2023", "2024", "2025"]);

  const handleYearToggle = (year: string) => {
    setSelectedYears(prev => 
      prev.includes(year) 
        ? prev.filter(y => y !== year)
        : [...prev, year]
    );
  };

  return (
    <div className="space-y-6">
      <PeriodYearSelector
        selectedMonth={selectedMonth}
        selectedYears={selectedYears}
        onMonthChange={setSelectedMonth}
        onYearToggle={handleYearToggle}
      />
      
      <div className="grid grid-cols-1 xl:grid-cols-2 gap-4 sm:gap-6">
        <SalesComparisonChart 
          selectedMonth={selectedMonth}
          selectedYears={selectedYears}
        />
        <ClientsComparisonChart 
          selectedMonth={selectedMonth}
          selectedYears={selectedYears}
        />
      </div>
    </div>
  );
}