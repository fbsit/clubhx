import { useCallback, useEffect, useState } from "react";
import { getUserSettings, updateUserSettings, UserSettings } from "@/services/userSettingsApi";
import { toast } from "sonner";

const DEFAULTS: UserSettings = {
	notifications: { email: { orders: true, loyalty: true, events: true, newProducts: true }, push: false, sms: false, system: { quotes: true, stock: true, account: true } },
	preferences: {
		language: { useSpanish: true, use24h: true, useMetric: true },
		printing: { printLogo: true, printColor: true, printHeader: true, printFooter: true },
		loyalty: { reminders: true, rewardSuggestions: true },
		catalog: { productRecommendations: true, priceAlerts: true, stockNotifications: true },
	},
};

function setNestedImmutable<T extends Record<string, any>>(obj: T, path: string[], value: any): T {
	if (path.length === 0) return obj;
	const [key, ...rest] = path;
	return {
		...obj,
		[key]: rest.length === 0
			? value
			: setNestedImmutable(obj[key] ?? {}, rest, value),
	} as T;
}

function buildPartial(path: string[], value: any): any {
	if (path.length === 0) return {};
	const [key, ...rest] = path;
	return rest.length === 0 ? { [key]: value } : { [key]: buildPartial(rest, value) };
}

function isPlainObject(v: unknown): v is Record<string, any> {
	return typeof v === 'object' && v !== null && !Array.isArray(v);
}

function mergeDeep<T extends Record<string, any>>(base: T, partial: Partial<T>): T {
	const out: any = Array.isArray(base) ? [...(base as any)] : { ...base };
	Object.keys(partial || {}).forEach((k) => {
		const b = (base as any)[k];
		const p = (partial as any)[k];
		if (isPlainObject(b) && isPlainObject(p)) out[k] = mergeDeep(b, p);
		else if (p !== undefined) out[k] = p;
	});
	return out as T;
}

export function useUserSettings() {
	const [settings, setSettings] = useState<UserSettings>(DEFAULTS);
	const [loading, setLoading] = useState(false);
	const [error, setError] = useState<string | null>(null);

	const load = useCallback(async () => {
		try {
			setLoading(true);
			setError(null);
			const data = await getUserSettings();
			setSettings(prev => ({
				...prev,
				...data,
				notifications: { ...DEFAULTS.notifications, ...(data.notifications || {}) },
				preferences: { ...DEFAULTS.preferences, ...(data.preferences || {}) },
			}));
		} catch (e) {
			setError("No se pudieron cargar las configuraciones");
		} finally {
			setLoading(false);
		}
	}, []);

	const save = useCallback(async () => {
		try {
			setLoading(true);
			await updateUserSettings(settings);
			toast.success("Configuración actualizada correctamente");
		} catch (e) {
			toast.error("No se pudo guardar la configuración");
		} finally {
			setLoading(false);
		}
	}, [settings]);

	const setField = useCallback(async (path: string[], value: any) => {
		setSettings(prev => setNestedImmutable(prev, path, value));
		const payload = path[0] === 'notifications' || path[0] === 'preferences'
			? { [path[0]]: buildPartial(path.slice(1), value) }
			: { preferences: buildPartial(path, value) };
		try {
			await updateUserSettings(payload as Partial<UserSettings>);
			toast.success("Guardado");
		} catch (e) {
			toast.error("No se pudo guardar");
		}
	}, []);

	const setAll = useCallback(async (partial: Partial<UserSettings>) => {
		setSettings(prev => mergeDeep(prev, partial));
		const payload: Partial<UserSettings> = {};
		if ((partial as any).notifications) payload.notifications = (partial as any).notifications;
		if ((partial as any).preferences) payload.preferences = (partial as any).preferences;
		if (payload.notifications || payload.preferences) {
			try {
				await updateUserSettings(payload);
			} catch { /* ignore on init */ }
		}
	}, []);

	useEffect(() => {
		void load();
	}, [load]);

	return { settings, setSettings, setField, setAll, loading, error, reload: load, save };
}
