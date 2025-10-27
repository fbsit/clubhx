import { Body, Controller, Post, Res, Headers, BadRequestException } from '@nestjs/common';
import { Response } from 'express';
import { ClubApiService } from '../shared/club-api.service';

type UnknownRecord = Record<string, unknown>;

function normalizeNumberLike(value: unknown): number | null {
  if (value == null) return null;
  if (typeof value === 'number' && !Number.isNaN(value)) return value;
  if (typeof value === 'boolean') return value ? 1 : 0;
  const str = String(value).trim().replace(/\s+/g, '');
  // Remove thousand separators and normalize commas to dots
  const normalized = str.replace(/,/g, '.').replace(/[^0-9.-]/g, '');
  const num = parseFloat(normalized);
  return Number.isFinite(num) ? num : null;
}

@Controller()
export class OrdersSubmitController {
  constructor(private readonly api: ClubApiService) {}

  @Post('/api/v1/order/submit')
  async submit(
    @Body() body: UnknownRecord,
    @Res() res: Response,
    @Headers('authorization') authorization?: string,
  ) {
    const client = body?.client as string | undefined;
    const seller = body?.seller as string | undefined;
    const store = body?.store as string | undefined;
    if (!client || !seller || !store) {
      throw new BadRequestException('Missing required fields: client, seller and store are required');
    }

    const itemsInput = Array.isArray(body?.items) ? (body.items as UnknownRecord[]) : [];
    const moduleItemsInput = Array.isArray(body?.module_items) ? (body.module_items as UnknownRecord[]) : [];

    const items = itemsInput.map((it) => {
      const quantity = normalizeNumberLike(it.quantity);
      const price = normalizeNumberLike(it.price);
      const discount_percentage = normalizeNumberLike(it.discount_percentage);
      const productId = (it.product as UnknownRecord | undefined)?.id ?? it.product;
      return {
        product: String(productId ?? it.id ?? ''),
        quantity: quantity ?? 0,
        ...(price != null ? { price } : {}),
        ...(discount_percentage != null ? { discount_percentage } : {}),
      };
    });

    const module_items = moduleItemsInput.map((it) => {
      const quantity = normalizeNumberLike(it.quantity);
      const price = normalizeNumberLike(it.price);
      const discount_percentage = normalizeNumberLike(it.discount_percentage);
      return {
        id: String(it.id ?? ''),
        module_name: String(it.module_name ?? ''),
        quantity: quantity ?? 0,
        ...(price != null ? { price } : {}),
        ...(discount_percentage != null ? { discount_percentage } : {}),
      };
    });

    const payloadForUpstream: UnknownRecord = {
      client,
      seller,
      store,
      discount_requested: Boolean(body?.discount_requested ?? false),
      defontana_client_id: body?.defontana_client_id ?? null,
      items,
      module_items,
      type: body?.type ?? 'order',
      name: body?.name,
      tin: body?.tin,
      address: body?.address,
      municipality: body?.municipality,
      city: body?.city,
      phone: body?.phone,
      email: body?.email,
      payment_method: body?.payment_method,
      payment_on_time: body?.payment_on_time,
      payment_amount: normalizeNumberLike(body?.payment_amount),
      payment_date: body?.payment_date,
      shipping_type: body?.shipping_type,
      shipping_date: body?.shipping_date,
      shipping_cost: normalizeNumberLike(body?.shipping_cost),
      comments: body?.comments,
      extra_info: body?.extra_info,
      global_discount: normalizeNumberLike(body?.global_discount),
      global_discount_percentage: normalizeNumberLike(body?.global_discount_percentage),
      client_purchase_order_number: body?.client_purchase_order_number,
    };

    const authHeader = authorization
      ? authorization.startsWith('Bearer ')
        ? `Token ${authorization.slice(7)}`
        : authorization
      : undefined;

    // Create order upstream using no-store path
    const upstream = await this.api.request<any>('post', '/api/v1/order-create-no-store/', {
      body: payloadForUpstream,
      headers: authHeader ? { Authorization: authHeader } : undefined,
      useAuthHeader: authHeader ? false : undefined,
    });

    console.log(upstream);

    if (upstream.status >= 400) {
      return res.status(upstream.status).send(upstream.data);
    }

    const created = upstream.data as UnknownRecord;
    const idValue = (created?.id as string | number | undefined) ?? (created?.pk as string | number | undefined);
    const id = idValue != null ? String(idValue) : '';
    const frontendBase = process.env.FRONTEND_BASE_URL ?? 'http://localhost:8080';
    const success_url = `${frontendBase}/main/orders/${encodeURIComponent(id)}`;

    return res.status(200).send({ id, success_url, ok: true });
  }
}


