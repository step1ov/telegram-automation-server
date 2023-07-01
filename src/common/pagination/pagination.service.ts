export interface PaginationService<Type> {
  findAll(
    skip: number,
    limit: number,
    sortField: string,
    sortOrder: 'asc' | 'desc',
    search?: string,
    filters?: Record<string, (number | string)[]>,
  ): Promise<Type[]>;
  countAll(
    search?: string,
    filters?: Record<string, (number | string)[]>,
  ): Promise<number>;
}
