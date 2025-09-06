export class PaginationQueryDto {
  [key: string]: string | number | boolean | null | undefined;
  limit?: number;
  offset?: number;
}

export class UUIDParamDto {
  id!: string; // format: uuid
}


