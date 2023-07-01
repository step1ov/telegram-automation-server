import { Body, Controller, Post, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { Automation, AutomationDocument } from './schemas/automation.schema';
import { AutomationService } from './automation.service';
import { CreateAutomationDto } from './dto/create-automation.dto';
import { UpdateAutomationDto } from './dto/update-automation.dto';
import { UsersService } from '../users/users.service';
import { CrudController } from '../../common/crud/crud.controller';
import checkUserExists from '../../utils/check-user-exists';

@Controller('automation')
@UseGuards(JwtAuthGuard)
export class AutomationController extends CrudController<
  Automation,
  AutomationService
> {
  constructor(
    protected readonly dataService: AutomationService,
    protected readonly usersService: UsersService,
  ) {
    super();
  }

  @Post('create')
  async create(@Body() dto: CreateAutomationDto): Promise<AutomationDocument> {
    await checkUserExists(this.usersService, dto.userId);
    return this.dataService.create(dto);
  }

  @Post('update')
  async update(@Body() dto: UpdateAutomationDto): Promise<AutomationDocument> {
    return this.dataService.update(dto.id, dto);
  }
}
