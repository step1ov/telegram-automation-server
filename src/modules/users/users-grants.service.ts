import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { UserGrant, UserGrantDocument } from './schemas/user-grant.schema';
import { UserGrantDto } from './dto/user-grant.dto';
import { default as data } from './data/user-grants-default.json';
import { InstallableService } from '../../common/installable/installable.service';

@Injectable()
export class UsersGrantsService extends InstallableService<UserGrantDocument> {
  constructor(
    @InjectModel(UserGrant.name)
    protected readonly model: Model<UserGrantDocument>,
  ) {
    super();
  }

  async findAll(): Promise<UserGrantDocument[]> {
    return this.model.find().exec();
  }

  async findById(id: string): Promise<UserGrantDocument> {
    return this.model.findById(id).exec();
  }

  async create(userGrantDto: UserGrantDto): Promise<UserGrantDocument> {
    return this.model.create(userGrantDto);
  }

  async delete(id: string) {
    return this.model.findByIdAndRemove(id).exec();
  }

  getInitialData(): any[] {
    return data;
  }
}
