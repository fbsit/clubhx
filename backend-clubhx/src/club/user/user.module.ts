import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserController } from './user.controller';
import { EventsModule } from '../events/events.module';
import { UserSettingsEntity } from './entity/user-settings';
import { UserService } from './user.service';

@Module({
	imports: [EventsModule, TypeOrmModule.forFeature([UserSettingsEntity])],
	controllers: [UserController],
	providers: [UserService],
})
export class UserModule {}


