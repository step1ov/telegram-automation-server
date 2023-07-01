import { Body, Controller, Post, UseGuards } from '@nestjs/common';
import { SettingDocument } from './schemas/setting.schema';
import { SettingsService } from './settings.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { CreateSettingDto } from './dto/create-setting.dto';
import { UpdateSettingDto } from './dto/update-setting.dto';
import { CrudController } from '../../common/crud/crud.controller';

@Controller('settings')
@UseGuards(JwtAuthGuard)
export class SettingsController extends CrudController<
  SettingDocument,
  SettingsService
> {
  constructor(protected readonly dataService: SettingsService) {
    super();
  }

  @Post('create')
  async create(@Body() dto: CreateSettingDto): Promise<SettingDocument> {
    return this.dataService.create(dto);
  }

  @Post('update')
  async update(@Body() dto: UpdateSettingDto): Promise<SettingDocument> {
    return this.dataService.update(dto.id, dto);
  }
}
