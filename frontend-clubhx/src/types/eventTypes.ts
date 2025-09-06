
export interface EventRegistration {
  id: string;
  eventId: string;
  userId: string;
  userName: string;
  userEmail: string;
  userAvatar?: string;
  registrationDate: string;
  attendanceStatus: "registered" | "attended" | "no-show";
  pointsEarned?: number;
}

export interface EventPerformance {
  totalRegistrations: number;
  actualAttendance: number;
  attendanceRate: number;
  pointsDistributed: number;
  averageRating?: number;
  feedback: EventFeedback[];
}

export interface EventFeedback {
  id: string;
  eventId: string;
  userId: string;
  userName: string;
  rating: number;
  comment?: string;
  submittedAt: string;
}
