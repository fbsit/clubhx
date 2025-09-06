
import { EventRegistration, EventPerformance, EventFeedback } from "@/types/eventTypes";

export const mockEventRegistrations: EventRegistration[] = [
  {
    id: "reg-001",
    eventId: "evt-001",
    userId: "user-001",
    userName: "Ana María González",
    userEmail: "ana.gonzalez@salon.com",
    userAvatar: "https://images.unsplash.com/photo-1494790108755-2616b612b650?auto=format&fit=crop&q=80",
    registrationDate: "2025-06-10T10:30:00Z",
    attendanceStatus: "registered",
  },
  {
    id: "reg-002",
    eventId: "evt-001",
    userId: "user-002",
    userName: "Carlos Mendoza",
    userEmail: "carlos@bellesalon.cl",
    registrationDate: "2025-06-11T14:20:00Z",
    attendanceStatus: "registered",
  },
  {
    id: "reg-003",
    eventId: "evt-001",
    userId: "user-003",
    userName: "Patricia Silva",
    userEmail: "patricia@estilochic.com",
    userAvatar: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?auto=format&fit=crop&q=80",
    registrationDate: "2025-06-12T09:15:00Z",
    attendanceStatus: "registered",
  },
];

export const mockEventFeedback: EventFeedback[] = [
  {
    id: "fb-001",
    eventId: "evt-002",
    userId: "user-001",
    userName: "Ana María González",
    rating: 5,
    comment: "Excelente workshop, muy práctico y útil para mi salón.",
    submittedAt: "2025-06-19T16:30:00Z",
  },
  {
    id: "fb-002",
    eventId: "evt-002",
    userId: "user-004",
    userName: "Roberto Vargas",
    rating: 4,
    comment: "Buena información, me hubiera gustado más tiempo para preguntas.",
    submittedAt: "2025-06-19T17:15:00Z",
  },
];

export const getEventRegistrations = (eventId: string): EventRegistration[] => {
  return mockEventRegistrations.filter(reg => reg.eventId === eventId);
};

export const getEventPerformance = (eventId: string): EventPerformance => {
  const registrations = getEventRegistrations(eventId);
  const feedback = mockEventFeedback.filter(fb => fb.eventId === eventId);
  
  const totalRegistrations = registrations.length;
  const actualAttendance = registrations.filter(r => r.attendanceStatus === "attended").length;
  const attendanceRate = totalRegistrations > 0 ? (actualAttendance / totalRegistrations) * 100 : 0;
  const pointsDistributed = registrations.reduce((sum, reg) => sum + (reg.pointsEarned || 0), 0);
  const averageRating = feedback.length > 0 
    ? feedback.reduce((sum, fb) => sum + fb.rating, 0) / feedback.length 
    : undefined;

  return {
    totalRegistrations,
    actualAttendance,
    attendanceRate,
    pointsDistributed,
    averageRating,
    feedback,
  };
};
