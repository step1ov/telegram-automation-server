import { IsNumber, Min, IsOptional, IsString, IsJSON } from 'class-validator';
import { Type } from 'class-transformer';

export class PaginationParams {
  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  @Min(0)
  skip?: number = 0;

  @Type(() => Number)
  @IsNumber()
  @Min(0)
  limit = 30;

  @IsString()
  sortField = 'createdAt';

  @IsString()
  sortOrder: 'asc' | 'desc' = 'desc';

  @IsOptional()
  @IsString()
  search?: string;

  @IsOptional()
  @IsJSON()
  filters;
}
