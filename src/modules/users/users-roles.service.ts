import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { UserRole, UserRoleDocument } from './schemas/user-role.schema';
import { CreateUserRoleDto } from './dto/create-user-role.dto';
import { default as data } from './data/user-roles-default.json';
import { InstallableService } from '../../common/installable/installable.service';

@Injectable()
export class UsersRolesService extends InstallableService<UserRoleDocument> {
  constructor(
    @InjectModel(UserRole.name)
    protected readonly model: Model<UserRoleDocument>,
  ) {
    super();
  }

  async findAll(): Promise<UserRoleDocument[]> {
    return this.model.find().populate('grants');
  }

  async findById(id: string): Promise<UserRoleDocument> {
    return this.model.findById(id);
  }

  async create(dto: CreateUserRoleDto): Promise<UserRoleDocument> {
    return this.model.create(dto);
  }

  async deleteOne(id: string) {
    return this.model.findByIdAndRemove({ _id: id });
  }

  getInitialData(): any[] {
    return data;
  }
}
