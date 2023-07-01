import { Module } from '@nestjs/common';
import { UsersService } from '../users/users.service';
import { UsersGrantsService } from '../users/users-grants.service';
import { UsersRolesService } from '../users/users-roles.service';
import { MongooseModule } from '@nestjs/mongoose';
import { UserGrant, UserGrantSchema } from '../users/schemas/user-grant.schema';
import { UserRole, UserRoleSchema } from '../users/schemas/user-role.schema';
import { User, UserSchema } from '../users/schemas/user.schema';
import { InstallController } from './install.controller';
import { SettingsService } from '../settings/settings.service';
import { Setting, SettingSchema } from '../settings/schemas/setting.schema';

@Module({
  providers: [
    UsersService,
    UsersGrantsService,
    UsersRolesService,
    SettingsService,
  ],
  imports: [
    MongooseModule.forFeature([
      { name: UserGrant.name, schema: UserGrantSchema },
    ]),
    MongooseModule.forFeature([
      { name: UserRole.name, schema: UserRoleSchema },
    ]),
    MongooseModule.forFeature([{ name: User.name, schema: UserSchema }]),
    MongooseModule.forFeature([{ name: Setting.name, schema: SettingSchema }]),
  ],
  controllers: [InstallController],
})
export class InstallModule {}
