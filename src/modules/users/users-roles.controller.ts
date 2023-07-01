import { Body, Controller, Get, Param, Post, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { UserRoleDocument } from './schemas/user-role.schema';
import { UsersRolesService } from './users-roles.service';
import { CreateUserRoleDto } from './dto/create-user-role.dto';

@Controller('users-roles')
@UseGuards(JwtAuthGuard)
export class UsersRolesController {
  constructor(protected readonly dataService: UsersRolesService) {}

  @Get()
  async findAll() {
    return {
      records: await this.dataService.findAll(),
    };
  }

  @Post('create')
  async create(@Body() dto: CreateUserRoleDto): Promise<UserRoleDocument> {
    return this.dataService.create(dto);
  }

  @Get(':id')
  async findOne(@Param('id') id: string): Promise<UserRoleDocument> {
    return this.dataService.findById(id);
  }

  @Get('remove/:id')
  async removeOne(@Param('id') id: string): Promise<UserRoleDocument> {
    return this.dataService.deleteOne(id);
  }
}
