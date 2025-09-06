export type AdminVisit = {
  id: string;
  clientName: string;
  clientCompany: string;
  date: Date;
  time: string;
  duration: number;
  status: "scheduled" | "confirmed" | "completed" | "canceled";
  salesPersonId: string;
  salesPersonName: string;
  visitType: string;
  meetingType: string;
  description?: string;
  location?: string;
  priority?: "low" | "medium" | "high";
  isUrgent?: boolean;
  followUp?: boolean;
  meetingLink?: string;
};
import { Event } from "@/types/event";

const APPTS_KEY = "sales-event-appointments";
const REGS_KEY = "sales-event-registrations";

export type SalesEventRegistration = {
  id: string;
  eventId: string;
  companyName: string;
  createdAt: string;
};

// ---- Appointments store ----
export function getSalesAppointments(): AdminVisit[] {
  try {
    const raw = localStorage.getItem(APPTS_KEY);
    if (!raw) return [];
    const parsed: (Omit<AdminVisit, "date"> & { date: string })[] = JSON.parse(raw);
    return parsed.map((v) => ({ ...v, date: new Date(v.date) }));
  } catch (e) {
    console.error("Error reading sales appointments:", e);
    return [];
  }
}

export function saveSalesAppointments(appts: AdminVisit[]) {
  try {
    const serializable = appts.map((v) => ({ ...v, date: v.date.toISOString() }));
    localStorage.setItem(APPTS_KEY, JSON.stringify(serializable));
    dispatchVisitsUpdated();
  } catch (e) {
    console.error("Error saving sales appointments:", e);
  }
}

export function addSalesAppointment(appt: AdminVisit) {
  const current = getSalesAppointments();
  saveSalesAppointments([...current, appt]);
}

export function subscribeToSalesVisits(cb: () => void) {
  const handler = () => cb();
  window.addEventListener("sales-visits-updated", handler as EventListener);
  return () => window.removeEventListener("sales-visits-updated", handler as EventListener);
}

function dispatchVisitsUpdated() {
  window.dispatchEvent(new CustomEvent("sales-visits-updated"));
}

// ---- Registrations store ----
export function getSalesEventRegistrations(): SalesEventRegistration[] {
  try {
    const raw = localStorage.getItem(REGS_KEY);
    if (!raw) return [];
    return JSON.parse(raw) as SalesEventRegistration[];
  } catch (e) {
    console.error("Error reading event registrations:", e);
    return [];
  }
}

export function saveSalesEventRegistrations(regs: SalesEventRegistration[]) {
  try {
    localStorage.setItem(REGS_KEY, JSON.stringify(regs));
    dispatchRegistrationsUpdated();
  } catch (e) {
    console.error("Error saving event registrations:", e);
  }
}

export function addSalesEventRegistration(reg: SalesEventRegistration) {
  const current = getSalesEventRegistrations();
  saveSalesEventRegistrations([...current, reg]);
}

export function getCompanyRegistrationsForEvent(eventId: string, companyName: string) {
  return getSalesEventRegistrations().filter(
    (r) => r.eventId === eventId && r.companyName === companyName
  );
}

export function subscribeToEventRegistrations(cb: () => void) {
  const handler = () => cb();
  window.addEventListener("event-registrations-updated", handler as EventListener);
  return () => window.removeEventListener("event-registrations-updated", handler as EventListener);
}

function dispatchRegistrationsUpdated() {
  window.dispatchEvent(new CustomEvent("event-registrations-updated"));
}

// ---- Helpers ----
export function eventToAppointment(event: Event, companyName: string): AdminVisit {
  // Build Date from event.date (YYYY-MM-DD or similar)
  const date = new Date(event.date);
  const duration = 120; // default 2h
  return {
    id: `evtapp-${Date.now()}`,
    clientName: `Evento: ${event.title}`,
    clientCompany: companyName,
    date,
    time: event.time,
    duration,
    status: "confirmed",
    salesPersonId: "sp1",
    salesPersonName: "María González",
    visitType: "product_training",
    meetingType: event.eventType === "online" ? "videollamada" : "presencial",
    description: `Asistencia a curso: ${event.title} (${event.brand})`,
    location:
      event.eventType === "online"
        ? `Online${event.onlineUrl ? ` · ${event.onlineUrl}` : ""}`
        : event.address?.street
        ? `${event.location} - ${event.address.street}${event.address.city ? ", " + event.address.city : ""}`
        : event.location,
    priority: "low",
    isUrgent: false,
    followUp: false,
    notes: event.description,
    meetingLink: event.onlineUrl,
  };
}
