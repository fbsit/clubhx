import { Body, Controller, Get, Headers, HttpCode, HttpStatus, Put, Query } from '@nestjs/common';
import { EventsService } from '../events/events.service';
import { UserService } from './user.service';

@Controller('api/v1/user')
export class UserController {
	constructor(private readonly eventsService: EventsService, private readonly userService: UserService) {}

	@Get('event-registrations')
	@HttpCode(HttpStatus.OK)
	async listMyEventRegistrations(
		@Query('limit') limit?: number,
		@Query('offset') offset?: number,
		@Headers('authorization') authorization?: string,
	) {
		return this.eventsService.listUserRegistrationsByAuthorization(authorization ?? '', limit, offset);
	}

	@Get('settings')
	@HttpCode(HttpStatus.OK)
	async getSettings(@Headers('authorization') authorization?: string) {
		return this.userService.getSettings(authorization);
	}

	@Put('settings')
	@HttpCode(HttpStatus.OK)
	async updateSettings(@Body() body: any, @Headers('authorization') authorization?: string) {
		return this.userService.updateSettings(body, authorization);
	}
}


