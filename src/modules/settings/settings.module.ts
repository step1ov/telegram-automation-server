import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { SettingsService } from './settings.service';
import { SettingsController } from './settings.controller';
import { Setting, SettingSchema } from './schemas/setting.schema';
import { UsersService } from '../users/users.service';
import { User, UserSchema } from '../users/schemas/user.schema';

@Module({
  providers: [UsersService, SettingsService],
  imports: [
    MongooseModule.forFeature([{ name: Setting.name, schema: SettingSchema }]),
    MongooseModule.forFeature([{ name: User.name, schema: UserSchema }]),
  ],
  controllers: [SettingsController],
  exports: [SettingsService],
})
export class SettingsModule {}
