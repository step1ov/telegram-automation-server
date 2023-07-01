import { Get, Query, UsePipes, ValidationPipe } from '@nestjs/common';
import { PaginationParams } from './pagination-params';
import { PaginationResult } from './pagination-result';
import { PaginationService } from './pagination.service';

export abstract class PaginationController<
  DataType,
  ServiceType extends PaginationService<DataType>,
> {
  protected abstract readonly dataService: ServiceType;
  @Get()
  @UsePipes(new ValidationPipe({ transform: true }))
  async findAll(
    @Query()
    { skip, limit, sortField, sortOrder, search, filters }: PaginationParams,
  ): Promise<PaginationResult<DataType>> {
    const filters_ = filters ? JSON.parse(filters) : undefined;
    const records = await this.dataService.findAll(
      skip,
      limit,
      sortField,
      sortOrder,
      search,
      filters_,
    );
    return {
      records,
      pagination: {
        limit,
        skip: skip || 0,
        total: await this.dataService.countAll(search, filters_),
        size: records.length,
      },
    };
  }
}
