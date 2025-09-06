import { fetchJson } from "@/lib/api";

export interface CreateOrderItemDto {
  product: string; // product UUID/ID
  quantity: number;
}

export interface CreateOrderNoStoreDto {
  client?: string; // optional for client-self flow
  items: CreateOrderItemDto[];
  notes?: string;
  shipping_type?: string;
  payment_method?: string;
}

export async function createOrderNoStore(payload: CreateOrderNoStoreDto) {
  return fetchJson(`/api/v1/order-create-no-store/`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });
}

export async function updateOrderNoStore(payload: CreateOrderNoStoreDto) {
  return fetchJson(`/api/v1/order-create-no-store/`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });
}

export async function createOrder(payload: CreateOrderNoStoreDto) {
  return fetchJson(`/api/v1/order-create/`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });
}

export interface OrdersListParams {
  limit?: number;
  offset?: number;
}

export async function listOrders(params: OrdersListParams = {}) {
  const qs = new URLSearchParams();
  if (params.limit != null) qs.set("limit", String(params.limit));
  if (params.offset != null) qs.set("offset", String(params.offset));
  const url = qs.toString() ? `/api/v1/order/?${qs.toString()}` : `/api/v1/order/`;
  return fetchJson(url);
}

export async function listMyOrders(params: OrdersListParams = {}) {
  const qs = new URLSearchParams();
  if (params.limit != null) qs.set("limit", String(params.limit));
  if (params.offset != null) qs.set("offset", String(params.offset));
  const url = qs.toString() ? `/api/v1/order/my?${qs.toString()}` : `/api/v1/order/my`;
  return fetchJson(url);
}


