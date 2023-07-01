import { FilterQuery, Model } from 'mongoose';
import { DeleteResult, ObjectId } from 'mongodb';
import { PaginationService } from '../pagination/pagination.service';
import applyFilters from '../../utils/apply-filters';

export abstract class CrudService<DocumentType>
  implements PaginationService<DocumentType>
{
  protected abstract model: Model<DocumentType>;

  protected getSearchQuery(
    search: string,
    filters?: Record<string, (number | string)[]>,
  ): FilterQuery<any> {
    let query = {};
    if (search) {
      search = search.trim();
      const regex = new RegExp(search, 'i');
      query = { title: regex };
    }
    return applyFilters(query, filters);
  }

  async findAll(
    skip: number,
    limit: number,
    sortField: string,
    sortOrder: 'asc' | 'desc',
    search: string,
    filters?: Record<string, (number | string)[]>,
  ): Promise<DocumentType[]> {
    return this.model
      .find(this.getSearchQuery(search, filters))
      .sort({ [sortField]: sortOrder === 'asc' ? 1 : -1 })
      .skip(skip)
      .limit(limit);
  }

  async countAll(
    search?: string,
    filters?: Record<string, (number | string)[]>,
  ): Promise<number> {
    return this.model.count(this.getSearchQuery(search, filters));
  }

  async findById(id: ObjectId): Promise<DocumentType> {
    return this.model.findById(id);
  }

  abstract create(dto: any): Promise<DocumentType>;
  abstract update(id: ObjectId, dto: any): Promise<DocumentType>;

  async deleteOne(id: ObjectId): Promise<DocumentType> {
    return this.model.findByIdAndRemove(id);
  }

  async deleteMany(ids: ObjectId[]): Promise<DeleteResult> {
    return this.model.deleteMany({ _id: { $in: ids } });
  }
}
