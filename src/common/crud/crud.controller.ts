import { Body, Get, Param, Post } from '@nestjs/common';
import { RemoveManyDto } from './dto/remove-many.dto';
import { DeleteResult, ObjectId } from 'mongodb';
import { CrudService } from './crud.service';
import { PaginationController } from '../pagination/pagination.controller';

export abstract class CrudController<
  DocumentType,
  ServiceType extends CrudService<DocumentType>,
> extends PaginationController<DocumentType, ServiceType> {
  protected abstract readonly dataService: ServiceType;

  @Get(':id')
  async findOne(@Param('id') id: ObjectId): Promise<DocumentType> {
    return this.dataService.findById(id);
  }

  abstract create(dto: any): Promise<DocumentType>;
  abstract update(dto: any): Promise<DocumentType>;

  @Get('remove/:id')
  async removeOne(@Param('id') id: ObjectId): Promise<DocumentType> {
    return this.dataService.deleteOne(id);
  }

  @Post('remove')
  async removeMany(
    @Body() removeManyDto: RemoveManyDto,
  ): Promise<DeleteResult> {
    return this.dataService.deleteMany(removeManyDto.ids);
  }
}
