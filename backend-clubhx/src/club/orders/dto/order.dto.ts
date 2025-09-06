import { OrderItemDto } from '../../order-items/dto/order-item.dto';
import { OrderModuleItemDto } from '../../order-module-items/dto/order-module-item.dto';

export class OrderDto {
  id!: string;
  created!: string;
  modified!: string;
  date!: string;
  seller!: string;
  items!: OrderItemDto[];
  module_items!: OrderModuleItemDto[];
}

export class PaginatedOrderListDto {
  count!: number;
  next?: string | null;
  previous?: string | null;
  results!: OrderDto[];
}


