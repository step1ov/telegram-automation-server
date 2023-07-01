import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Automation, AutomationDocument } from './schemas/automation.schema';
import { UpdateAutomationDto } from './dto/update-automation.dto';
import { CreateAutomationDto } from './dto/create-automation.dto';
import { CrudService } from '../../common/crud/crud.service';
import { ObjectId } from 'mongodb';
import usersPopulateFields from '../../common/users-populate-fields';

@Injectable()
export class AutomationService extends CrudService<AutomationDocument> {
  constructor(
    @InjectModel(Automation.name)
    protected readonly model: Model<AutomationDocument>,
  ) {
    super();
  }

  async findAll(
    skip: number,
    limit: number,
    sortField: string,
    sortOrder: 'asc' | 'desc',
    search: string,
    filters?: Record<string, (number | string)[]>,
  ): Promise<AutomationDocument[]> {
    return this.model
      .find(this.getSearchQuery(search, filters))
      .sort({ [sortField]: sortOrder === 'asc' ? 1 : -1 })
      .skip(skip)
      .limit(limit)
      .populate('userId', usersPopulateFields);
  }

  async findAllEnabled(): Promise<AutomationDocument[]> {
    return this.model.find({ isEnabled: true });
  }

  async findById(id: ObjectId): Promise<AutomationDocument> {
    return this.model.findById(id).populate('userId', usersPopulateFields);
  }

  async create(dto: CreateAutomationDto): Promise<AutomationDocument> {
    const doc = await this.model.create(dto);
    return doc.populate('userId', usersPopulateFields);
  }

  async update(
    id: ObjectId,
    dto: UpdateAutomationDto,
  ): Promise<AutomationDocument> {
    return this.model
      .findByIdAndUpdate(id, dto, { new: true })
      .populate('userId', usersPopulateFields);
  }
}
