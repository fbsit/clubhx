export class ProductDto {
  id!: string;
  name!: string;
  code!: string;
  latest_price!: string;
  discount_percentage!: string;
  available_units!: string;
  created!: string;
  modified!: string;
  sale_currency!: string;
}

export class PaginatedProductListDto {
  count!: number;
  next?: string | null;
  previous?: string | null;
  results!: ProductDto[];
}


