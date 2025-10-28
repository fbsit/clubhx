import { fetchJson } from "@/lib/api";

export interface CreateOrderItemDto {
  id?: string;
  product?: string; // product UUID/ID
  quantity: number | string;
  price?: number | string;
  discount_percentage?: number | string;
}

export interface CreateOrderModuleItemDto {
  id?: string;
  module_name?: string;
  quantity: number | string;
  price?: number | string;
  discount_percentage?: number | string;
}

export interface SubmitOrderDto {
  client: string;
  seller: string;
  store: string;
  discount_requested?: boolean;
  defontana_client_id?: string;
  items?: CreateOrderItemDto[];
  module_items?: CreateOrderModuleItemDto[];
  type?: string;
  name?: string;
  tin?: string;
  address?: string;
  municipality?: string;
  city?: string;
  phone?: string;
  email?: string;
  payment_method?: string;
  payment_on_time?: boolean;
  payment_amount?: number | string;
  payment_date?: string; // yyyy-mm-dd
  shipping_type?: string;
  shipping_date?: string; // ISO
  shipping_cost?: number | string;
  comments?: string;
  extra_info?: string;
  global_discount?: number | string;
  global_discount_percentage?: number | string;
  client_purchase_order_number?: string | boolean;
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

export type SubmitOrderResponse = { ok?: boolean; success_url?: string; id?: string };

export async function submitOrder(payload: SubmitOrderDto): Promise<SubmitOrderResponse> {
  return fetchJson<SubmitOrderResponse>(`/api/v1/order/submit`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });
}

export interface ShippingTypeDto {
  id: string;
  name: string;
  description?: string;
}

export async function listShippingTypes(): Promise<ShippingTypeDto[]> {
  const resp = await fetchJson<any>(`/api/v1/shippingtype/`);
  const list: any[] = Array.isArray(resp)
    ? resp
    : Array.isArray(resp?.results)
      ? resp.results
      : Array.isArray(resp?.data)
        ? resp.data
        : [];
  return list
    .map((it) => ({
      id: String(it?.id ?? it?.pk ?? ''),
      name: String(it?.name ?? it?.title ?? it?.module_name ?? 'Shipping'),
      description: it?.description ?? undefined,
    }))
    .filter((it) => !!it.id);
}

export interface PaymentMethodDto {
  id: string;
  name: string;
  description?: string;
}

export async function listPaymentMethods(): Promise<PaymentMethodDto[]> {
  const resp = await fetchJson<any>(`/api/v1/paymentmethod/`);
  const list: any[] = Array.isArray(resp)
    ? resp
    : Array.isArray(resp?.results)
      ? resp.results
      : Array.isArray(resp?.data)
        ? resp.data
        : [];
  return list
    .map((it) => ({
      id: String(it?.id ?? it?.pk ?? ''),
      name: String(it?.name ?? it?.title ?? 'Payment method'),
      description: it?.description ?? undefined,
    }))
    .filter((it) => !!it.id);
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

// Removed listMyOrders: use listOrdersByClient for client flows

export async function listOrdersByClient(clientId: string, page?: number) {
  const qs = new URLSearchParams();
  qs.set('client', clientId);
  if (page != null) qs.set('page', String(page));
  const url = `/api/v1/order/by-client?${qs.toString()}`;
  return fetchJson(url);
}

export async function listOrdersBySeller(sellerId: string, page?: number) {
  const qs = new URLSearchParams();
  qs.set('seller', sellerId);
  if (page != null) qs.set('page', String(page));
  const url = `/api/v1/order/by-seller?${qs.toString()}`;
  return fetchJson(url);
}


