import { useState, useMemo } from "react";
import { startOfWeek, endOfWeek, startOfYear, endOfYear, subDays, subYears, isWithinInterval } from "date-fns";
import type { SummaryPeriod } from "@/components/events/SummaryPeriodSelector";
import type { Event } from "@/types/event";

export function useEventsFilter(events: Event[]) {
  const [searchValue, setSearchValue] = useState("");
  const [selectedBrand, setSelectedBrand] = useState<string | null>(null);
  const [selectedStatus, setSelectedStatus] = useState<string | null>(null);
  const [selectedEventType, setSelectedEventType] = useState<string | null>(null);
  const [summaryPeriod, setSummaryPeriod] = useState<SummaryPeriod>("month");

  // Obtener marcas únicas
  const availableBrands = useMemo(() => {
    return Array.from(new Set(events.map(event => event.brand))).sort();
  }, [events]);

  // Filtrar eventos
  const filteredEvents = useMemo(() => {
    return events.filter(event => {
      // Filtro de búsqueda
      if (searchValue) {
        const searchLower = searchValue.toLowerCase();
        const matchesSearch = 
          event.title.toLowerCase().includes(searchLower) ||
          event.description.toLowerCase().includes(searchLower) ||
          event.location.toLowerCase().includes(searchLower) ||
          event.brand.toLowerCase().includes(searchLower);
        
        if (!matchesSearch) return false;
      }

      // Filtro por marca
      if (selectedBrand && event.brand !== selectedBrand) {
        return false;
      }

      // Filtro por estado
      if (selectedStatus) {
        if (selectedStatus === "active" && event.isPast) return false;
        if (selectedStatus === "past" && !event.isPast) return false;
      }

      // Filtro por tipo de evento
      if (selectedEventType && event.eventType !== selectedEventType) {
        return false;
      }

      return true;
    });
  }, [events, searchValue, selectedBrand, selectedStatus, selectedEventType]);

  // Calcular estadísticas del período seleccionado
  const summaryStats = useMemo(() => {
    const now = new Date();
    let startDate: Date;
    let endDate: Date = now;

    switch (summaryPeriod) {
      case "3days":
        startDate = subDays(now, 3);
        break;
      case "week":
        startDate = startOfWeek(now, { weekStartsOn: 1 });
        endDate = endOfWeek(now, { weekStartsOn: 1 });
        break;
      case "month":
        startDate = new Date(now.getFullYear(), now.getMonth(), 1);
        endDate = new Date(now.getFullYear(), now.getMonth() + 1, 0);
        break;
      case "year":
        startDate = startOfYear(now);
        endDate = endOfYear(now);
        break;
      case "2years":
        startDate = subYears(now, 2);
        break;
      case "all":
        return {
          total: filteredEvents.length,
          active: filteredEvents.filter(e => !e.isPast).length,
          past: filteredEvents.filter(e => e.isPast).length,
          online: filteredEvents.filter(e => e.eventType === "online").length,
          presencial: filteredEvents.filter(e => e.eventType === "presencial").length
        };
      default:
        startDate = new Date(now.getFullYear(), now.getMonth(), 1);
    }

    const periodEvents = filteredEvents.filter(event => {
      const eventDate = new Date(event.date);
      return isWithinInterval(eventDate, { start: startDate, end: endDate });
    });

    return {
      total: periodEvents.length,
      active: periodEvents.filter(e => !e.isPast).length,
      past: periodEvents.filter(e => e.isPast).length,
      online: periodEvents.filter(e => e.eventType === "online").length,
      presencial: periodEvents.filter(e => e.eventType === "presencial").length
    };
  }, [filteredEvents, summaryPeriod]);

  return {
    // Estados
    searchValue,
    selectedBrand,
    selectedStatus,
    selectedEventType,
    summaryPeriod,
    
    // Datos procesados
    filteredEvents,
    availableBrands,
    summaryStats,
    
    // Funciones de control
    setSearchValue,
    setSelectedBrand,
    setSelectedStatus,
    setSelectedEventType,
    setSummaryPeriod
  };
}
