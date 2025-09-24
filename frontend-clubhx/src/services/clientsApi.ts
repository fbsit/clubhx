import { fetchJson } from "@/lib/api";

export interface ClientDto {
  id: string;
  created?: string;
  modified?: string;
  is_active?: boolean;
  synced?: string;
  nfk?: number;
  name?: string;
  rut?: string;
  business_activity?: string;
  fantasy_name?: string;
  address?: string;
  municipality?: string;
  region?: string;
  city?: string;
  is_banned?: boolean;
  credit_line?: number;
  deadlines?: number;
  dicom?: string;
  payment_phone?: string;
  payment_on_time?: boolean;
  payment_contact?: string;
  type?: string;
  phone?: string;
  email?: string;
  client_type?: string;
  birthday?: string;
  gender?: string;
  contact?: string;
  charge?: string;
  latitude?: string;
  longitude?: string;
  geopos_calculated?: string;
  calc_potential?: number;
  calc_total_sales_avg?: number;
  calc_total_sales?: number;
  external_client_id?: number;
  comments?: string;
  requires_purchase_order?: boolean;
  shipping_type?: string;
  payment_method?: string;
  category?: string;
  seller?: string;
  real_client?: string;
}

export interface PaginatedClientsResponse {
  count: number;
  next?: string | null;
  previous?: string | null;
  results: ClientDto[];
}

export class ClientsApiService {
  private baseUrl = "/api/v1/clients";

  async getClients(params: { limit?: number; offset?: number } = {}): Promise<PaginatedClientsResponse> {
    const search = new URLSearchParams();
    if (params.limit != null) search.append("limit", String(params.limit));
    if (params.offset != null) search.append("offset", String(params.offset));
    const url = search.toString() ? `${this.baseUrl}?${search.toString()}` : this.baseUrl;
    return fetchJson<PaginatedClientsResponse>(url);
  }

  async getCurrentClient(): Promise<ClientDto> {
    return fetchJson<ClientDto>(`/api/v1/client/me`);
  }
}

export const clientsApi = new ClientsApiService();


