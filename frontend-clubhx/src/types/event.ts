export interface Event {
  id: string;
  title: string;
  brand: string;
  date: string;
  time: string;
  location: string;
  description: string;
  image: string;
  speaker?: {
    name: string;
    role: string;
    avatar: string;
  };
  spots: number;
  spotsLeft: number;
  pointsCost: number;
  isRegistered: boolean;
  registeredAttendees?: number;
  isPast: boolean;
  eventType: "online" | "presencial";
  address?: {
    street: string;
    city: string;
    country: string;
    details?: string;
  };
  onlineUrl?: string;
  color?: string;
  maxAttendeesPerCompany?: number;
}