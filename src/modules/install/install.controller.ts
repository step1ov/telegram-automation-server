import { Controller, Get } from '@nestjs/common';
import { UsersService } from '../users/users.service';
import { UsersGrantsService } from '../users/users-grants.service';
import { UsersRolesService } from '../users/users-roles.service';
import { InstallResultDto } from './dto/install-result.dto';
import { SettingsService } from '../settings/settings.service';

@Controller('install')
export class InstallController {
  constructor(
    protected readonly usersService: UsersService,
    private readonly usersGrantsService: UsersGrantsService,
    private readonly usersRolesService: UsersRolesService,
    private readonly settingsService: SettingsService,
  ) {}

  @Get()
  async install(): Promise<InstallResultDto> {
    const result: InstallResultDto = {
      grantsAdded: 0,
      rolesAdded: 0,
      userAdded: null,
      settingsAdded: 0,
    };
    result.grantsAdded = await this.usersGrantsService.install();
    result.rolesAdded = await this.usersRolesService.install();
    result.userAdded = await this.usersService.install();
    result.settingsAdded = await this.settingsService.install();
    return result;
  }
}
