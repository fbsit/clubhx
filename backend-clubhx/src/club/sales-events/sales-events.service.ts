import { Injectable } from '@nestjs/common';

@Injectable()
export class SalesEventsService {
  
  // Mock data for events where sales rep's customers are registered
  private mockEvents = [
    {
      id: '1',
      title: 'Workshop de Técnicas Avanzadas de Coloración',
      description: 'Aprende las últimas técnicas de coloración profesional con expertos internacionales',
      category: 'Capacitación',
      status: 'active',
      start_date: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(), // 7 days from now
      end_date: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000 + 8 * 60 * 60 * 1000).toISOString(), // 8 hours later
      location: 'Centro de Convenciones Santiago',
      address: 'Av. Providencia 1234, Santiago',
      price: 150000,
      currency: 'CLP',
      max_capacity: 50,
      current_registrations: 35,
      organizer_name: 'ClubHx Academy',
      organizer_email: 'academy@clubhx.com',
      image_url: '/placeholder.svg',
      is_featured: true,
      is_public: true,
      tags: ['coloración', 'técnicas', 'profesional'],
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
      // Customer registrations for this sales rep
      customer_registrations: [
        {
          id: 'reg1',
          customer_id: '1',
          customer_name: 'Salon Belleza Profesional',
          customer_contact: 'María González',
          customer_email: 'maria@salonbelleza.cl',
          registration_date: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
          attendees_count: 2,
          attendance_status: 'registered',
          payment_status: 'paid',
          amount_paid: 300000
        },
        {
          id: 'reg2',
          customer_id: '2',
          customer_name: 'Hair Style Studio',
          customer_contact: 'Carlos Rodríguez',
          customer_email: 'carlos@hairstyle.cl',
          registration_date: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(),
          attendees_count: 1,
          attendance_status: 'registered',
          payment_status: 'paid',
          amount_paid: 150000
        }
      ]
    },
    {
      id: '2',
      title: 'Expo Belleza 2024',
      description: 'La feria más importante de productos y servicios de belleza en Chile',
      category: 'Feria',
      status: 'active',
      start_date: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000).toISOString(), // 14 days from now
      end_date: new Date(Date.now() + 16 * 24 * 60 * 60 * 1000).toISOString(), // 3 days later
      location: 'Espacio Riesco',
      address: 'Av. El Bosque Norte 0440, Las Condes',
      price: 25000,
      currency: 'CLP',
      max_capacity: 200,
      current_registrations: 180,
      organizer_name: 'Feria Internacional',
      organizer_email: 'info@expo-belleza.cl',
      image_url: '/placeholder.svg',
      is_featured: true,
      is_public: true,
      tags: ['feria', 'productos', 'networking'],
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
      customer_registrations: [
        {
          id: 'reg3',
          customer_id: '3',
          customer_name: 'Beauty Center',
          customer_contact: 'Ana Silva',
          customer_email: 'ana@beautycenter.cl',
          registration_date: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(),
          attendees_count: 3,
          attendance_status: 'registered',
          payment_status: 'paid',
          amount_paid: 75000
        },
        {
          id: 'reg4',
          customer_id: '4',
          customer_name: 'Estética Moderna',
          customer_contact: 'Roberto Pérez',
          customer_email: 'roberto@esteticamoderna.cl',
          registration_date: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(),
          attendees_count: 2,
          attendance_status: 'registered',
          payment_status: 'pending',
          amount_paid: 0
        }
      ]
    },
    {
      id: '3',
      title: 'Seminario de Gestión de Salones',
      description: 'Aprende estrategias efectivas para administrar tu negocio de belleza',
      category: 'Gestión',
      status: 'active',
      start_date: new Date(Date.now() + 21 * 24 * 60 * 60 * 1000).toISOString(), // 21 days from now
      end_date: new Date(Date.now() + 21 * 24 * 60 * 60 * 1000 + 6 * 60 * 60 * 1000).toISOString(), // 6 hours later
      location: 'Hotel Sheraton',
      address: 'Av. Santa María 1742, Providencia',
      price: 80000,
      currency: 'CLP',
      max_capacity: 30,
      current_registrations: 25,
      organizer_name: 'Consultora Empresarial',
      organizer_email: 'contacto@consultora.cl',
      image_url: '/placeholder.svg',
      is_featured: false,
      is_public: true,
      tags: ['gestión', 'negocios', 'administración'],
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
      customer_registrations: [
        {
          id: 'reg5',
          customer_id: '5',
          customer_name: 'Arte y Belleza Spa',
          customer_contact: 'Patricia López',
          customer_email: 'patricia@arteybelleza.cl',
          registration_date: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(),
          attendees_count: 1,
          attendance_status: 'registered',
          payment_status: 'paid',
          amount_paid: 80000
        }
      ]
    }
  ];

  async getSalesEvents(userId: string) {
    // Filter events where the sales rep's customers are registered
    const eventsWithCustomerRegistrations = this.mockEvents.map(event => ({
      ...event,
      total_customers_registered: event.customer_registrations.length,
      total_attendees: event.customer_registrations.reduce((sum, reg) => sum + reg.attendees_count, 0),
      total_revenue: event.customer_registrations.reduce((sum, reg) => sum + reg.amount_paid, 0),
      pending_payments: event.customer_registrations.filter(reg => reg.payment_status === 'pending').length
    }));

    return {
      events: eventsWithCustomerRegistrations,
      total: eventsWithCustomerRegistrations.length,
      upcoming: eventsWithCustomerRegistrations.filter(e => new Date(e.start_date) > new Date()).length,
      total_revenue: eventsWithCustomerRegistrations.reduce((sum, event) => sum + event.total_revenue, 0),
      total_attendees: eventsWithCustomerRegistrations.reduce((sum, event) => sum + event.total_attendees, 0)
    };
  }

  async getEventDetails(userId: string, eventId: string) {
    const event = this.mockEvents.find(e => e.id === eventId);
    
    if (!event) {
      throw new Error('Evento no encontrado');
    }

    return {
      ...event,
      total_customers_registered: event.customer_registrations.length,
      total_attendees: event.customer_registrations.reduce((sum, reg) => sum + reg.attendees_count, 0),
      total_revenue: event.customer_registrations.reduce((sum, reg) => sum + reg.amount_paid, 0),
      pending_payments: event.customer_registrations.filter(reg => reg.payment_status === 'pending').length,
      paid_registrations: event.customer_registrations.filter(reg => reg.payment_status === 'paid').length
    };
  }

  async getEventRegistrations(userId: string, eventId: string) {
    const event = this.mockEvents.find(e => e.id === eventId);
    
    if (!event) {
      throw new Error('Evento no encontrado');
    }

    return {
      event: {
        id: event.id,
        title: event.title,
        start_date: event.start_date,
        end_date: event.end_date,
        location: event.location
      },
      registrations: event.customer_registrations,
      summary: {
        total_registrations: event.customer_registrations.length,
        total_attendees: event.customer_registrations.reduce((sum, reg) => sum + reg.attendees_count, 0),
        total_revenue: event.customer_registrations.reduce((sum, reg) => sum + reg.amount_paid, 0),
        pending_payments: event.customer_registrations.filter(reg => reg.payment_status === 'pending').length,
        paid_registrations: event.customer_registrations.filter(reg => reg.payment_status === 'paid').length
      }
    };
  }

  async getUpcomingEvents(userId: string) {
    const now = new Date();
    const upcomingEvents = this.mockEvents
      .filter(event => new Date(event.start_date) > now)
      .map(event => ({
        ...event,
        total_customers_registered: event.customer_registrations.length,
        total_attendees: event.customer_registrations.reduce((sum, reg) => sum + reg.attendees_count, 0),
        total_revenue: event.customer_registrations.reduce((sum, reg) => sum + reg.amount_paid, 0)
      }));

    return {
      events: upcomingEvents,
      total: upcomingEvents.length,
      total_revenue: upcomingEvents.reduce((sum, event) => sum + event.total_revenue, 0),
      total_attendees: upcomingEvents.reduce((sum, event) => sum + event.total_attendees, 0)
    };
  }
}
