import {
  Body,
  Controller,
  Get,
  Post,
  Query,
  UseGuards,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { UserDocument } from './schemas/user.schema';
import { UsersGrantsService } from './users-grants.service';
import { UsersRolesService } from './users-roles.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { CrudController } from '../../common/crud/crud.controller';
import { CreateUserDto } from './dto/create-user.dto';
import * as bcrypt from 'bcrypt';
import { UpdateUserDto } from './dto/update-user.dto';
import { PaginationParams } from '../../common/pagination/pagination-params';
import { PaginationResult } from '../../common/pagination/pagination-result';

@Controller('users')
@UseGuards(JwtAuthGuard)
export class UsersController extends CrudController<
  UserDocument,
  UsersService
> {
  constructor(
    protected readonly dataService: UsersService,
    private readonly usersGrantsService: UsersGrantsService,
    private readonly usersRolesService: UsersRolesService,
  ) {
    super();
  }

  @Get()
  @UsePipes(new ValidationPipe({ transform: true }))
  async findAll(
    @Query()
    { skip, limit, sortField, sortOrder, search, filters }: PaginationParams,
  ): Promise<PaginationResult<UserDocument>> {
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

  @Post('create')
  async create(@Body() dto: CreateUserDto): Promise<UserDocument> {
    if (dto.password) {
      const salt = await bcrypt.genSalt();
      dto.password = await bcrypt.hash(dto.password, salt);
    }
    return this.dataService.create(dto);
  }

  @Post('update')
  update(@Body() dto: UpdateUserDto): Promise<UserDocument> {
    return this.dataService.update(dto.id, dto);
  }
}
