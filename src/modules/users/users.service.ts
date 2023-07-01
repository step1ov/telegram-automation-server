import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { FilterQuery, Model } from 'mongoose';
import { User, UserDocument } from './schemas/user.schema';
import { CreateUserDto } from './dto/create-user.dto';
import { default as data } from './data/user-default.json';
import * as bcrypt from 'bcrypt';
import { UpdateUserDto } from './dto/update-user.dto';
import { CrudService } from '../../common/crud/crud.service';
import { ObjectId } from 'mongodb';
import applyFilters from '../../utils/apply-filters';
import { UserDto } from './dto/user.dto';

const getDisplayName = (dto: UserDto): string | undefined => {
  if (dto.firstName) {
    return dto.lastName ? dto.firstName + ' ' + dto.lastName : dto.firstName;
  }
  return dto.username;
};

@Injectable()
export class UsersService extends CrudService<UserDocument> {
  constructor(
    @InjectModel(User.name) protected readonly model: Model<UserDocument>,
  ) {
    super();
  }

  getSearchQuery(
    search: string,
    filters?: Record<string, (number | string)[]>,
  ): FilterQuery<any> {
    let query = {};
    if (search) {
      search = search.trim();
      const regex = new RegExp(search, 'i');
      query = {
        $or: [
          { email: regex },
          { username: regex },
          { firstName: regex },
          { lastName: regex },
        ],
      };
    }
    return applyFilters(query, filters);
  }

  async findAll(
    skip = 0,
    limit = 0,
    sortField = 'createdAt',
    sortOrder: 'asc' | 'desc' = 'desc',
    search = '',
    filters?: Record<string, (number | string)[]>,
  ): Promise<UserDocument[]> {
    return this.model
      .find(this.getSearchQuery(search, filters))
      .sort({ [sortField]: sortOrder === 'asc' ? 1 : -1 })
      .skip(skip)
      .limit(limit)
      .populate('role');
  }

  async findById(id: ObjectId): Promise<UserDocument> {
    return this.model.findOne({ _id: id }).populate('role');
  }

  async findByUserName(username: string): Promise<UserDocument> {
    return this.model.findOne({ username }).populate('role');
  }

  async findByEmail(email: string): Promise<UserDocument> {
    return this.model.findOne({ email }).populate('role');
  }

  async findByEmailOTP(email: string): Promise<UserDocument> {
    return this.model.findOne({ email }).select('otp').populate('role');
  }

  async findByEmailOrUsername(emailOrUsername: string): Promise<UserDocument> {
    return this.model
      .findOne({
        $or: [{ email: emailOrUsername }, { username: emailOrUsername }],
      })
      .populate('role');
  }

  async create(dto: CreateUserDto): Promise<UserDocument> {
    const user = await this.model.create({
      ...dto,
      displayName: getDisplayName(dto),
    });
    return user.populate('role');
  }

  async update(id: ObjectId, dto: UpdateUserDto): Promise<UserDocument> {
    return this.model
      .findByIdAndUpdate(
        id,
        {
          ...dto,
          displayName: getDisplayName(dto),
        },
        { new: true },
      )
      .populate('role');
  }

  async validatePassword(id: string, password: string): Promise<boolean> {
    const user = await this.model.findById(id).select('+password');
    return !!user && (await bcrypt.compare(password, user.password));
  }

  async changePassword(id: ObjectId, password: string): Promise<UserDocument> {
    const salt = await bcrypt.genSalt();
    const passwordHash = await bcrypt.hash(password, salt);
    return this.model
      .findByIdAndUpdate(
        id,
        { password: passwordHash, passwordUpdatedAt: new Date() },
        { new: true },
      )
      .populate('role');
  }

  async install(): Promise<User> {
    if ((await this.countAll()) === 0) {
      const salt = await bcrypt.genSalt();
      const passwordHash = await bcrypt.hash(data.password, salt);
      return this.model.create({
        ...data,
        displayName: getDisplayName(data),
        password: passwordHash,
      });
    }
    return null;
  }

  async validateUser(
    emailOrUsername: string,
    password: string,
  ): Promise<UserDocument | null> {
    const user = await this.model
      .findOne({
        $or: [{ email: emailOrUsername }, { username: emailOrUsername }],
      })
      .select('+password')
      .populate('role');
    if (
      user &&
      (await bcrypt.compare(password, user.password)) &&
      user?.role?._id === 'admin'
    ) {
      delete user.password;
      return user;
    }
    return null;
  }
}
