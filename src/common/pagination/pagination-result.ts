import { PaginationDto } from './pagination.dto';

export class PaginationResult<Type> {
  readonly records: Type[];
  readonly pagination: PaginationDto;
}
