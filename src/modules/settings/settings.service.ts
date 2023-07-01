import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { CreateSettingDto } from './dto/create-setting.dto';
import { Setting, SettingDocument } from './schemas/setting.schema';
import { UpdateSettingDto } from './dto/update-setting.dto';
import { CrudService } from '../../common/crud/crud.service';
import { ObjectId } from 'mongodb';
import { default as data } from './data/settings.json';

@Injectable()
export class SettingsService extends CrudService<SettingDocument> {
  constructor(
    @InjectModel(Setting.name)
    protected readonly model: Model<SettingDocument>,
  ) {
    super();
  }

  async findById(id: ObjectId): Promise<SettingDocument> {
    return this.model.findById(id);
  }

  async findBySlug(slug: string): Promise<SettingDocument> {
    return this.model.findOne({ slug });
  }

  async create(dto: CreateSettingDto): Promise<SettingDocument> {
    return this.model.create(dto);
  }

  async update(id: ObjectId, dto: UpdateSettingDto): Promise<SettingDocument> {
    return this.model.findByIdAndUpdate(id, dto);
  }

  async install(): Promise<number> {
    const n = data.length;
    let counter = 0;
    for (let i = 0; i < n; i++) {
      const elem = data[i];
      const existingItem = await this.findBySlug(elem.slug);
      if (!existingItem) {
        await this.create(elem);
        counter++;
      }
    }
    return counter;
  }
}
