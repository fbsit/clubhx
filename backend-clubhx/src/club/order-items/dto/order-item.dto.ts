export class OrderItemDto {
  id!: string;
  created!: string;
  modified!: string;
  is_active!: boolean;
  quantity!: string;
  order!: string;
}

export class PaginatedOrderItemListDto {
  count!: number;
  next?: string | null;
  previous?: string | null;
  results!: OrderItemDto[];
}


