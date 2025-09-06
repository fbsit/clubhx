import { fetchJson } from "@/lib/api";

export interface UserSettings {
	notifications: {
		email?: { orders?: boolean; loyalty?: boolean; events?: boolean; newProducts?: boolean };
		push?: boolean;
		sms?: boolean;
		system?: { quotes?: boolean; stock?: boolean; account?: boolean };
	};
	preferences: Record<string, any>;
	updatedAt?: string;
}

export const getUserSettings = () => fetchJson<UserSettings>("/api/v1/user/settings");

export const updateUserSettings = (payload: Partial<UserSettings>) =>
	fetchJson<UserSettings>("/api/v1/user/settings", {
		method: "PUT",
		headers: { "Content-Type": "application/json" },
		body: JSON.stringify(payload),
	});
