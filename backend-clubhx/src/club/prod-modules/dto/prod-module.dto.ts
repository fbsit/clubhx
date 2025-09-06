export class ProdModuleDto {
  id!: string;
  name!: string;
  product_code!: string;
  quantity!: string;
  created!: string;
  modified!: string;
  latest_price!: string;
  discount_percentage!: string;
  is_active!: boolean;
}

export class PaginatedProdModuleListDto {
  count!: number;
  next?: string | null;
  previous?: string | null;
  results!: ProdModuleDto[];
}


