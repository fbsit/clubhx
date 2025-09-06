import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, FindOptionsWhere, Like, Between, IsNull } from 'typeorm';
import { EventEntity } from './entity/event';
import { EventRegistrationEntity } from './entity/event-registration';
import { CreateEventDto, EventStatus } from './dto/create-event.dto';
import { UpdateEventDto } from './dto/update-event.dto';
import { EventDto, PaginatedEventListDto } from './dto/event.dto';
import { createHash } from 'crypto';

@Injectable()
export class EventsService {
  constructor(
    @InjectRepository(EventEntity)
    private readonly eventRepository: Repository<EventEntity>,
    @InjectRepository(EventRegistrationEntity)
    private readonly registrationRepository: Repository<EventRegistrationEntity>,
  ) {}

  // === CRUD Operations ===

  async create(createEventDto: CreateEventDto, userId?: string): Promise<EventDto> {
    const event = this.eventRepository.create({
      ...createEventDto,
      start_date: new Date(createEventDto.start_date),
      end_date: new Date(createEventDto.end_date),
      created_by: userId,
      updated_by: userId,
    });

    const savedEvent = await this.eventRepository.save(event);
    return this.mapToDto(savedEvent);
  }

  async findAll(query: {
    page?: number;
    limit?: number;
    search?: string;
    category?: string;
    status?: EventStatus;
    startDate?: string;
    endDate?: string;
    isFeatured?: boolean;
    isPublic?: boolean;
  }): Promise<PaginatedEventListDto> {
    const {
      page = 1,
      limit = 10,
      search,
      category,
      status,
      startDate,
      endDate,
      isFeatured,
      isPublic,
    } = query;

    const skip = (page - 1) * limit;
    const whereConditions: FindOptionsWhere<EventEntity> = {
      deleted_at: IsNull(),
    };

    // Search by title or description
    if (search) {
      whereConditions.title = Like(`%${search}%`);
    }

    // Filter by category
    if (category) {
      whereConditions.category = category;
    }

    // Filter by status
    if (status) {
      whereConditions.status = status;
    }

    // Filter by date range
    if (startDate && endDate) {
      whereConditions.start_date = Between(new Date(startDate), new Date(endDate));
    }

    // Filter by featured
    if (isFeatured !== undefined) {
      whereConditions.is_featured = isFeatured;
    }

    // Filter by public
    if (isPublic !== undefined) {
      whereConditions.is_public = isPublic;
    }

    const [events, total] = await this.eventRepository.findAndCount({
      where: whereConditions,
      order: { created_at: 'DESC' },
      skip,
      take: limit,
    });

    const results = events.map(event => this.mapToDto(event));
    const totalPages = Math.ceil(total / limit);

    return {
      count: total,
      next: page < totalPages ? `?page=${page + 1}&limit=${limit}` : null,
      previous: page > 1 ? `?page=${page - 1}&limit=${limit}` : null,
      results,
    };
  }

  async findOne(id: string): Promise<EventDto> {
    const event = await this.eventRepository.findOne({
      where: { id, deleted_at: IsNull() },
    });

    if (!event) {
      throw new NotFoundException(`Event with ID ${id} not found`);
    }

    return this.mapToDto(event);
  }

  async update(id: string, updateEventDto: UpdateEventDto, userId?: string): Promise<EventDto> {
    const event = await this.eventRepository.findOne({
      where: { id, deleted_at: IsNull() },
    });

    if (!event) {
      throw new NotFoundException(`Event with ID ${id} not found`);
    }

    // Convert date strings to Date objects if provided
    const updateData: any = { ...updateEventDto };
    if (updateEventDto.start_date) {
      updateData.start_date = new Date(updateEventDto.start_date);
    }
    if (updateEventDto.end_date) {
      updateData.end_date = new Date(updateEventDto.end_date);
    }
    updateData.updated_by = userId;

    await this.eventRepository.update(id, updateData);
    const updatedEvent = await this.eventRepository.findOne({ where: { id } });
    if (!updatedEvent) {
      throw new NotFoundException(`Event with ID ${id} not found`);
    }
    return this.mapToDto(updatedEvent);
  }

  async remove(id: string, userId?: string): Promise<void> {
    const event = await this.eventRepository.findOne({
      where: { id, deleted_at: IsNull() },
    });

    if (!event) {
      throw new NotFoundException(`Event with ID ${id} not found`);
    }

    // Soft delete
    await this.eventRepository.update(id, {
      deleted_at: new Date(),
      updated_by: userId,
    });
  }

  // === Additional Business Logic Methods ===

  async findUpcomingEvents(limit: number = 5): Promise<EventDto[]> {
    const events = await this.eventRepository.find({
      where: {
        start_date: Between(new Date(), new Date(Date.now() + 30 * 24 * 60 * 60 * 1000)), // Next 30 days
        status: EventStatus.ACTIVE,
        is_public: true,
        deleted_at: IsNull(),
      },
      order: { start_date: 'ASC' },
      take: limit,
    });

    return events.map(event => this.mapToDto(event));
  }

  async findFeaturedEvents(): Promise<EventDto[]> {
    const events = await this.eventRepository.find({
      where: {
        is_featured: true,
        status: EventStatus.ACTIVE,
        is_public: true,
        deleted_at: IsNull(),
      },
      order: { created_at: 'DESC' },
    });

    return events.map(event => this.mapToDto(event));
  }

  async findEventsByCategory(category: string, limit: number = 10): Promise<EventDto[]> {
    const events = await this.eventRepository.find({
      where: {
        category,
        status: EventStatus.ACTIVE,
        is_public: true,
        deleted_at: IsNull(),
      },
      order: { start_date: 'ASC' },
      take: limit,
    });

    return events.map(event => this.mapToDto(event));
  }

  async incrementRegistrations(id: string): Promise<void> {
    const event = await this.eventRepository.findOne({
      where: { id, deleted_at: IsNull() },
    });

    if (!event) {
      throw new NotFoundException(`Event with ID ${id} not found`);
    }

    if (event.max_capacity > 0 && event.current_registrations >= event.max_capacity) {
      throw new BadRequestException('Event is at maximum capacity');
    }

    await this.eventRepository.increment({ id }, 'current_registrations', 1);
  }

  async decrementRegistrations(id: string): Promise<void> {
    const event = await this.eventRepository.findOne({
      where: { id, deleted_at: IsNull() },
    });

    if (!event) {
      throw new NotFoundException(`Event with ID ${id} not found`);
    }

    if (event.current_registrations > 0) {
      await this.eventRepository.decrement({ id }, 'current_registrations', 1);
    }
  }

  private hashAuthorization(authorization?: string): string {
    if (!authorization) {
      throw new BadRequestException('Missing Authorization header');
    }
    return createHash('sha256').update(authorization).digest('hex');
  }

  async createRegistration(
    eventId: string,
    authorization: string,
    options: { attendeesCount?: number; notes?: string; userId?: string; userEmail?: string } = {},
  ) {
    const authHash = this.hashAuthorization(authorization);
    const existing = await this.registrationRepository.findOne({
      where: { event_id: eventId, auth_token_hash: authHash },
    });

    if (existing) {
      existing.attendees_count = options.attendeesCount ?? existing.attendees_count;
      existing.notes = options.notes ?? existing.notes;
      await this.registrationRepository.save(existing);
      return {
        id: existing.id,
        eventId: existing.event_id,
        userId: existing.user_id,
        userName: existing.user_email ?? null,
        userEmail: existing.user_email ?? null,
        registrationDate: existing.created_at,
        attendanceStatus: existing.attendance_status,
        attendeesCount: existing.attendees_count,
        notes: existing.notes,
      };
    }

    const created = await this.registrationRepository.save({
      event_id: eventId,
      user_id: options.userId ?? null,
      user_email: options.userEmail ?? null,
      auth_token_hash: authHash,
      attendees_count: options.attendeesCount ?? 1,
      attendance_status: 'registered',
      notes: options.notes ?? null,
    });
    await this.incrementRegistrations(eventId);
    return {
      id: created.id,
      eventId: created.event_id,
      userId: created.user_id,
      userName: created.user_email ?? null,
      userEmail: created.user_email ?? null,
      registrationDate: created.created_at,
      attendanceStatus: created.attendance_status,
      attendeesCount: created.attendees_count,
      notes: created.notes,
    };
  }

  async cancelRegistrationByAuthorization(eventId: string, authorization: string) {
    const authHash = this.hashAuthorization(authorization);
    const existing = await this.registrationRepository.findOne({
      where: { event_id: eventId, auth_token_hash: authHash },
    });
    if (!existing) {
      return;
    }
    await this.registrationRepository.delete(existing.id);
    await this.decrementRegistrations(eventId);
  }

  async getMyRegistration(eventId: string, authorization: string) {
    const authHash = this.hashAuthorization(authorization);
    const existing = await this.registrationRepository.findOne({
      where: { event_id: eventId, auth_token_hash: authHash },
    });
    if (!existing) {
      throw new NotFoundException('Registration not found');
    }
    return {
      id: existing.id,
      eventId: existing.event_id,
      userId: existing.user_id,
      userName: existing.user_email ?? null,
      userEmail: existing.user_email ?? null,
      registrationDate: existing.created_at,
      attendanceStatus: existing.attendance_status,
      attendeesCount: existing.attendees_count,
      notes: existing.notes,
    };
  }

  async listUserRegistrationsByAuthorization(authorization: string, limit = 10, offset = 0) {
    const authHash = this.hashAuthorization(authorization);
    const [rows, count] = await this.registrationRepository.findAndCount({
      where: { auth_token_hash: authHash },
      order: { created_at: 'DESC' },
      take: limit,
      skip: offset,
    });

    return {
      count,
      next: null,
      previous: null,
      results: rows.map(r => ({
        id: r.id,
        eventId: r.event_id,
        userId: r.user_id,
        userName: r.user_email ?? null,
        userEmail: r.user_email ?? null,
        registrationDate: r.created_at,
        attendanceStatus: r.attendance_status,
        attendeesCount: r.attendees_count,
        notes: r.notes,
      })),
    };
  }

  async toggleFeatured(id: string, userId?: string): Promise<EventDto> {
    const event = await this.eventRepository.findOne({
      where: { id, deleted_at: IsNull() },
    });

    if (!event) {
      throw new NotFoundException(`Event with ID ${id} not found`);
    }

    await this.eventRepository.update(id, {
      is_featured: !event.is_featured,
      updated_by: userId,
    });

    const updatedEvent = await this.eventRepository.findOne({ where: { id } });
    if (!updatedEvent) {
      throw new NotFoundException(`Event with ID ${id} not found`);
    }
    return this.mapToDto(updatedEvent);
  }

  async changeStatus(id: string, status: EventStatus, userId?: string): Promise<EventDto> {
    const event = await this.eventRepository.findOne({
      where: { id, deleted_at: IsNull() },
    });

    if (!event) {
      throw new NotFoundException(`Event with ID ${id} not found`);
    }

    await this.eventRepository.update(id, {
      status,
      updated_by: userId,
    });

    const updatedEvent = await this.eventRepository.findOne({ where: { id } });
    if (!updatedEvent) {
      throw new NotFoundException(`Event with ID ${id} not found`);
    }
    return this.mapToDto(updatedEvent);
  }

  async getEventStats(): Promise<{
    total: number;
    active: number;
    upcoming: number;
    completed: number;
    cancelled: number;
  }> {
    const [total, active, upcoming, completed, cancelled] = await Promise.all([
      this.eventRepository.count({ where: { deleted_at: IsNull() } }),
      this.eventRepository.count({ where: { status: EventStatus.ACTIVE, deleted_at: IsNull() } }),
      this.eventRepository.count({
        where: {
          start_date: Between(new Date(), new Date(Date.now() + 30 * 24 * 60 * 60 * 1000)),
          status: EventStatus.ACTIVE,
          deleted_at: IsNull(),
        },
      }),
      this.eventRepository.count({ where: { status: EventStatus.COMPLETED, deleted_at: IsNull() } }),
      this.eventRepository.count({ where: { status: EventStatus.CANCELLED, deleted_at: IsNull() } }),
    ]);

    return { total, active, upcoming, completed, cancelled };
  }

  // === Helper Methods ===

  private mapToDto(event: EventEntity): EventDto {
    return {
      id: event.id,
      title: event.title,
      description: event.description,
      category: event.category,
      status: event.status as EventStatus,
      start_date: event.start_date,
      end_date: event.end_date,
      location: event.location,
      address: event.address,
      price: event.price,
      currency: event.currency,
      max_capacity: event.max_capacity,
      current_registrations: event.current_registrations,
      organizer_name: event.organizer_name,
      organizer_email: event.organizer_email,
      organizer_phone: event.organizer_phone,
      image_url: event.image_url,
      banner_url: event.banner_url,
      tags: event.tags,
      is_featured: event.is_featured,
      is_public: event.is_public,
      registration_notes: event.registration_notes,
      created_by: event.created_by,
      updated_by: event.updated_by,
      created_at: event.created_at,
      updated_at: event.updated_at,
      deleted_at: event.deleted_at,
    };
  }
}
