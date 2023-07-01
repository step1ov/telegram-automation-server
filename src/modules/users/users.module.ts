import { Module } from '@nestjs/common';
import { UsersService } from './users.service';
import { UsersController } from './users.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { User, UserSchema } from './schemas/user.schema';
import { UsersGrantsService } from './users-grants.service';
import { UserGrant, UserGrantSchema } from './schemas/user-grant.schema';
import { UserRole, UserRoleSchema } from './schemas/user-role.schema';
import { UsersRolesService } from './users-roles.service';
import { ProfileController } from './profile.controller';
import { PasswordRestoreController } from './password-restore.controller';
import { UsersRolesController } from './users-roles.controller';

@Module({
  providers: [UsersService, UsersGrantsService, UsersRolesService],
  imports: [
    MongooseModule.forFeature([{ name: User.name, schema: UserSchema }]),
    MongooseModule.forFeature([
      { name: UserGrant.name, schema: UserGrantSchema },
    ]),
    MongooseModule.forFeature([
      { name: UserRole.name, schema: UserRoleSchema },
    ]),
  ],
  controllers: [
    UsersController,
    ProfileController,
    PasswordRestoreController,
    UsersRolesController,
  ],
  exports: [UsersService, UsersGrantsService, UsersRolesService],
})
export class UsersModule {}
