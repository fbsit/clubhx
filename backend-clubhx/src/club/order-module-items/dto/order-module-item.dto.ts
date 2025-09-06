export class OrderModuleItemDto {
  id!: string;
  created!: string;
  modified!: string;
  is_active!: boolean;
  quantity!: string;
  order!: string;
  product!: string;
}

export class PaginatedOrderModuleItemListDto {
  count!: number;
  next?: string | null;
  previous?: string | null;
  results!: OrderModuleItemDto[];
}


