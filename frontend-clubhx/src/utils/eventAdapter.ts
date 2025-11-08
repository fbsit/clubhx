import { Event } from '@/types/event';
import { EventDto, CreateEventDto, UpdateEventDto } from '@/services/eventsApi';

// Convertir de EventDto (backend) a Event (frontend)
export function adaptEventFromDto(dto: EventDto): Event {
  const startDate = new Date(dto.start_date);
  const endDate = new Date(dto.end_date);
  const now = new Date();
  const pad = (n: number) => String(n).padStart(2, '0');
  const localDateStr = `${startDate.getFullYear()}-${pad(startDate.getMonth() + 1)}-${pad(startDate.getDate())}`;
  
  return {
    id: dto.id,
    title: dto.title,
    brand: dto.category || 'General',
    date: localDateStr, // YYYY-MM-DD in local time
    time: `${startDate.toLocaleTimeString('es-CL', { 
      hour: '2-digit', 
      minute: '2-digit' 
    })} - ${endDate.toLocaleTimeString('es-CL', { 
      hour: '2-digit', 
      minute: '2-digit' 
    })}`,
    location: dto.location || '',
    description: dto.description || '',
    image: dto.image_url || dto.banner_url || '',
    spots: dto.max_capacity,
    spotsLeft: dto.max_capacity - dto.current_registrations,
    pointsCost: dto.price || 0,
    isRegistered: false, // Esto se determinará por el contexto del usuario
    isPast: startDate < now,
    eventType: dto.location ? 'presencial' : 'online',
    address: dto.address ? {
      street: dto.address,
      city: '',
      country: '',
    } : undefined,
    onlineUrl: dto.location ? undefined : dto.location,
    color: '#3b82f6', // Color por defecto
    maxAttendeesPerCompany: 5, // Valor por defecto
  };
}

// Convertir de Event (frontend) a CreateEventDto (backend)
function toOffsetIso(date: Date): string {
  const pad = (n: number) => String(n).padStart(2, '0');
  const yyyy = date.getFullYear();
  const mm = pad(date.getMonth() + 1);
  const dd = pad(date.getDate());
  const HH = pad(date.getHours());
  const MM = pad(date.getMinutes());
  const SS = pad(date.getSeconds());
  const ms = String(date.getMilliseconds()).padStart(3, '0');
  const tz = date.getTimezoneOffset(); // minutes; positive if local is behind UTC
  const sign = tz > 0 ? '-' : '+';
  const oh = pad(Math.floor(Math.abs(tz) / 60));
  const om = pad(Math.abs(tz) % 60);
  return `${yyyy}-${mm}-${dd}T${HH}:${MM}:${SS}.${ms}${sign}${oh}:${om}`;
}

export function adaptEventToCreateDto(event: Event): CreateEventDto {
  const [startTime, endTime] = event.time.split(' - ');
  const startLocal = new Date(`${event.date}T${startTime}`);
  const endLocal = new Date(`${event.date}T${endTime}`);

  return {
    title: event.title,
    description: event.description,
    category: event.brand,
    status: 'active',
    start_date: toOffsetIso(startLocal),
    end_date: toOffsetIso(endLocal),
    location: event.eventType === 'presencial' ? event.location : undefined,
    address: event.address?.street,
    price: event.pointsCost > 0 ? event.pointsCost : undefined,
    currency: 'CLP',
    max_capacity: event.spots,
    organizer_name: 'ClubHx', // Valor por defecto
    organizer_email: 'info@clubhx.cl', // Valor por defecto
    image_url: event.image,
    is_featured: false,
    is_public: true,
    tags: [event.brand, event.eventType],
  };
}

// Convertir de Event (frontend) a UpdateEventDto (backend)
export function adaptEventToUpdateDto(event: Event): UpdateEventDto {
  const [startTime, endTime] = event.time.split(' - ');
  const startLocal = new Date(`${event.date}T${startTime}`);
  const endLocal = new Date(`${event.date}T${endTime}`);
  
  return {
    title: event.title,
    description: event.description,
    category: event.brand,
    start_date: toOffsetIso(startLocal),
    end_date: toOffsetIso(endLocal),
    location: event.eventType === 'presencial' ? event.location : undefined,
    address: event.address?.street,
    price: event.pointsCost > 0 ? event.pointsCost : undefined,
    max_capacity: event.spots,
    image_url: event.image,
    tags: [event.brand, event.eventType],
  };
}

// Convertir array de EventDto a array de Event
export function adaptEventsFromDto(dtos: EventDto[]): Event[] {
  return dtos.map(adaptEventFromDto);
}

// Función helper para crear un evento vacío
export function createEmptyEvent(): Event {
  return {
    id: '',
    title: '',
    brand: '',
    date: new Date().toISOString().split('T')[0],
    time: '10:00 - 11:00',
    location: '',
    description: '',
    image: '',
    spots: 10,
    spotsLeft: 10,
    pointsCost: 0,
    isRegistered: false,
    isPast: false,
    eventType: 'presencial',
    color: '#3b82f6',
    maxAttendeesPerCompany: 5,
  };
}
