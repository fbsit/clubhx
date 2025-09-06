import { fetchJson } from "@/lib/api";
import type { ProductType } from "@/types/product";
import { calculateLoyaltyPoints } from "@/types/product";

type Paginated<T> = {
	count: number;
	next: string | null;
	previous: string | null;
	results: T[];
};

export async function fetchProducts(limit: number = 200): Promise<ProductType[]> {
	const data = await fetchJson<Paginated<any>>(`/api/v1/product/?limit=${limit}`);
	return data.results.map(mapApiToProduct);
}

export async function fetchProductById(id: string): Promise<ProductType> {
	const data = await fetchJson<any>(`/api/v1/product/${id}/`);
	return mapApiToProduct(data);
}

export async function createProduct(payload: any) {
    return fetchJson(`/api/v1/product/`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
    });
}

export async function updateProduct(id: string, payload: any) {
    return fetchJson(`/api/v1/product/${id}/`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
    });
}

function toNumber(value: unknown, fallback: number = 0): number {
	const n = typeof value === "string" ? Number(value) : (typeof value === "number" ? value : NaN);
	return Number.isFinite(n) ? n : fallback;
}

// Deterministic pseudo-random generator from a string (stable across reloads)
function rngFromString(key: string) {
	let seed = 0;
	for (let i = 0; i < key.length; i++) {
		seed = (seed * 31 + key.charCodeAt(i)) >>> 0;
	}
	return () => {
		seed = (seed * 1664525 + 1013904223) >>> 0; // LCG
		return (seed & 0xffffffff) / 0x100000000; // [0,1)
	};
}

function mapApiToProduct(p: any): ProductType {
	const id: string = p.id ?? cryptoRandomId();
	const rand = rngFromString(String(id));

	const price = toNumber(p.price ?? p.latest_price, Math.round(rand() * 9000 + 1000));
	const discount = toNumber(p.discount_percentage, Math.random() < 0.15 ? Math.round(rand() * 30) : 0);
	const stock = toNumber(p.available_units, Math.round(rand() * 200));

	const brand = p.brand_name ?? randomPick(rand, ["BLONDME", "Schwarzkopf", "L'Oréal", "Generic"]);
	const family = p.family_name ?? randomPick(rand, ["Cuidado", "Color", "Peinado", "Técnico"]);
	const subfamily = p.subfamily_name ?? randomPick(rand, ["Shampoo", "Conditioner", "Mask", "Styling"]);
	const image = p.image ?? `https://via.placeholder.com/512x512.png?text=${encodeURIComponent(p.name ?? brand)}`;

	const rating = Math.round((rand() * 5) * 2) / 2; // 0..5 steps of 0.5
	const volume = Math.random() < 0.5 ? undefined : Math.round(rand() * 900 + 100);
	const volumeUnit = volume ? randomPick(rand, ["ml", "g"]) : undefined;
	const isNew = rand() < 0.2;
	const isPopular = rand() < 0.3;

	return {
		id,
		name: p.name ?? `${brand} ${subfamily}`,
		description: p.description ?? "",
		price,
		image,
		category: family,
		type: subfamily,
		brand,
		stock,
		isNew,
		isPopular,
		discount,
		rating,
		volume,
		volumeUnit,
		options: [],
		variants: [],
		attributes: [],
		sku: p.code ?? `${brand}-${Math.floor(rand()*100000).toString().padStart(5, "0")}`,
		loyaltyPoints: calculateLoyaltyPoints(price),
		loyaltyPromotion: undefined,
		loyaltyBonus: undefined,
		loyaltyPointsMode: "automatic",
		loyaltyPointsRate: undefined,
	};
}

function cryptoRandomId(): string {
	// Fallback random id if API doesn't provide one (not ideal, but keeps UI stable)
	const a = Math.random().toString(36).slice(2);
	const b = Math.random().toString(36).slice(2);
	return `${a}${b}`.slice(0, 24);
}

function randomPick<T>(rnd: () => number, items: T[]): T {
	return items[Math.floor(rnd() * items.length)];
}


