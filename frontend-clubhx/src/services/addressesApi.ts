import { fetchJson } from '@/lib/api';

export interface AddressPayload {
  id?: string;
  customerId: string;
  name: string;
  phone?: string;
  street: string;
  number?: string;
  apartment?: string;
  city: string;
  commune: string;
  region: string;
  country?: string;
  zip?: string;
  isDefault?: boolean;
}

export async function listAddresses(customerId: string) {
  return fetchJson(`/api/v1/addresses?customerId=${encodeURIComponent(customerId)}`);
}

export async function createAddress(payload: AddressPayload) {
  return fetchJson(`/api/v1/addresses`, {
    method: 'POST',
    body: JSON.stringify(payload),
  });
}

export async function updateAddress(id: string, payload: Partial<AddressPayload>) {
  return fetchJson(`/api/v1/addresses/${id}`, {
    method: 'PATCH',
    body: JSON.stringify(payload),
  });
}

export async function deleteAddress(id: string) {
  return fetchJson(`/api/v1/addresses/${id}`, { method: 'DELETE' });
}

export async function setDefaultAddress(id: string) {
  return fetchJson(`/api/v1/addresses/${id}/set-default`, { method: 'POST' });
}


