import {
  Controller,
  Get,
  Post,
  Put,
  Patch,
  Delete,
  Body,
  Param,
  Query,
  UseGuards,
  Request,
  Headers,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import { EventsService } from './events.service';
import { CreateEventDto, EventStatus } from './dto/create-event.dto';
import { UpdateEventDto } from './dto/update-event.dto';
import { EventDto, PaginatedEventListDto } from './dto/event.dto';

@Controller('api/v1/events')
export class EventsController {
  constructor(private readonly eventsService: EventsService) {}

  // === CRUD Endpoints ===

  @Post()
  async create(@Body() createEventDto: CreateEventDto, @Request() req: any): Promise<EventDto> {
    const userId = req.user?.id;
    return this.eventsService.create(createEventDto, userId);
  }

  @Get()
  async findAll(@Query() query: {
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
    return this.eventsService.findAll(query);
  }

  @Get(':id')
  async findOne(@Param('id') id: string): Promise<EventDto> {
    return this.eventsService.findOne(id);
  }

  @Put(':id')
  async update(
    @Param('id') id: string,
    @Body() updateEventDto: UpdateEventDto,
    @Request() req: any,
  ): Promise<EventDto> {
    const userId = req.user?.id;
    return this.eventsService.update(id, updateEventDto, userId);
  }

  @Patch(':id')
  async partialUpdate(
    @Param('id') id: string,
    @Body() updateEventDto: UpdateEventDto,
    @Request() req: any,
  ): Promise<EventDto> {
    const userId = req.user?.id;
    return this.eventsService.update(id, updateEventDto, userId);
  }

  @Delete(':id')
  async remove(@Param('id') id: string, @Request() req: any): Promise<void> {
    const userId = req.user?.id;
    return this.eventsService.remove(id, userId);
  }

  // === Business Logic Endpoints ===

  @Get('upcoming/events')
  async findUpcomingEvents(@Query('limit') limit?: number): Promise<EventDto[]> {
    return this.eventsService.findUpcomingEvents(limit);
  }

  @Get('featured/events')
  async findFeaturedEvents(): Promise<EventDto[]> {
    return this.eventsService.findFeaturedEvents();
  }

  @Get('category/:category')
  async findEventsByCategory(
    @Param('category') category: string,
    @Query('limit') limit?: number,
  ): Promise<EventDto[]> {
    return this.eventsService.findEventsByCategory(category, limit);
  }

  @Post(':id/register')
  @HttpCode(HttpStatus.OK)
  async registerForEvent(
    @Param('id') id: string,
    @Headers('authorization') authorization?: string,
    @Body() body?: { attendeesCount?: number; notes?: string; userId?: string; userEmail?: string },
  ): Promise<any> {
    const registration = await this.eventsService.createRegistration(id, authorization ?? '', {
      attendeesCount: body?.attendeesCount,
      notes: body?.notes,
      userId: body?.userId,
      userEmail: body?.userEmail,
    });
    return registration;
  }

  @Post(':id/unregister')
  @HttpCode(HttpStatus.OK)
  async unregisterFromEvent(
    @Param('id') id: string,
    @Headers('authorization') authorization?: string,
  ): Promise<{ success: boolean }> {
    await this.eventsService.cancelRegistrationByAuthorization(id, authorization ?? '');
    return { success: true };
  }

  @Patch(':id/toggle-featured')
  async toggleFeatured(@Param('id') id: string, @Request() req: any): Promise<EventDto> {
    const userId = req.user?.id;
    return this.eventsService.toggleFeatured(id, userId);
  }

  @Patch(':id/status')
  async changeStatus(
    @Param('id') id: string,
    @Body('status') status: EventStatus,
    @Request() req: any,
  ): Promise<EventDto> {
    const userId = req.user?.id;
    return this.eventsService.changeStatus(id, status, userId);
  }

  @Get('stats/overview')
  async getEventStats(): Promise<{
    total: number;
    active: number;
    upcoming: number;
    completed: number;
    cancelled: number;
  }> {
    return this.eventsService.getEventStats();
  }

  // === Public Endpoints (for client-side) ===

  @Get('public/upcoming')
  async getPublicUpcomingEvents(@Query('limit') limit?: number): Promise<EventDto[]> {
    return this.eventsService.findUpcomingEvents(limit);
  }

  @Get('public/featured')
  async getPublicFeaturedEvents(): Promise<EventDto[]> {
    return this.eventsService.findFeaturedEvents();
  }

  @Get('public/category/:category')
  async getPublicEventsByCategory(
    @Param('category') category: string,
    @Query('limit') limit?: number,
  ): Promise<EventDto[]> {
    return this.eventsService.findEventsByCategory(category, limit);
  }

  @Get('public/:id')
  async getPublicEvent(@Param('id') id: string): Promise<EventDto> {
    return this.eventsService.findOne(id);
  }
}
