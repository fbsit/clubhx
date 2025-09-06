import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { UserSettingsEntity } from './entity/user-settings';
import { createHash } from 'crypto';

function isPlainObject(value: unknown): value is Record<string, any> {
	return typeof value === 'object' && value !== null && !Array.isArray(value);
}

function deepMerge<T extends Record<string, any>>(base: T, override: Partial<T>): T {
	const output: any = Array.isArray(base) ? [...(base as any)] : { ...base };
	Object.keys(override || {}).forEach((key) => {
		const bVal = (base as any)[key];
		const oVal = (override as any)[key];
		if (isPlainObject(bVal) && isPlainObject(oVal)) {
			output[key] = deepMerge(bVal, oVal);
		} else if (oVal !== undefined) {
			output[key] = oVal;
		}
	});
	return output as T;
}

@Injectable()
export class UserService {
	constructor(
		@InjectRepository(UserSettingsEntity)
		private readonly settingsRepo: Repository<UserSettingsEntity>,
	) {}

	private hashAuthorization(authorization?: string): string {
		if (!authorization) throw new BadRequestException('Missing Authorization header');
		return createHash('sha256').update(authorization).digest('hex');
	}

	private defaultSettings() {
		return {
			notifications: {
				email: { orders: true, loyalty: true, events: true, newProducts: true },
				push: false,
				sms: false,
				system: { quotes: true, stock: true, account: true },
			},
			preferences: {
				language: { useSpanish: true, use24h: true, useMetric: true },
				printing: { printLogo: true, printColor: true, printHeader: true, printFooter: true },
				loyalty: { reminders: true, rewardSuggestions: true },
				catalog: { productRecommendations: true, priceAlerts: true, stockNotifications: true },
			},
		};
	}

	async getSettings(authorization?: string) {
		const authHash = this.hashAuthorization(authorization);
		const defaults = this.defaultSettings();
		let settings = await this.settingsRepo.findOne({ where: { auth_token_hash: authHash } });
		if (!settings) {
			settings = this.settingsRepo.create({ auth_token_hash: authHash, notifications: defaults.notifications, preferences: defaults.preferences });
			settings = await this.settingsRepo.save(settings);
		}
		const mergedNotifications = deepMerge(defaults.notifications, (settings.notifications || {}));
		const mergedPreferences = deepMerge(defaults.preferences, (settings.preferences || {}));
		return {
			id: settings.id,
			notifications: mergedNotifications,
			preferences: mergedPreferences,
			updatedAt: settings.updated_at,
		};
	}

	async updateSettings(body: any, authorization?: string) {
		const authHash = this.hashAuthorization(authorization);
		const defaults = this.defaultSettings();
		let settings = await this.settingsRepo.findOne({ where: { auth_token_hash: authHash } });
		if (!settings) {
			settings = this.settingsRepo.create({ auth_token_hash: authHash, notifications: defaults.notifications, preferences: defaults.preferences });
		}
		const nextNotifications = deepMerge(deepMerge(defaults.notifications, (settings.notifications ?? {})), (body?.notifications ?? {}));
		const nextPreferences = deepMerge(deepMerge(defaults.preferences, (settings.preferences ?? {})), (body?.preferences ?? {}));
		settings.notifications = nextNotifications;
		settings.preferences = nextPreferences;
		settings = await this.settingsRepo.save(settings);
		return {
			id: settings.id,
			notifications: settings.notifications ?? {},
			preferences: settings.preferences ?? {},
			updatedAt: settings.updated_at,
		};
	}
}


