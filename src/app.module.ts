import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { ConfigModule } from '@nestjs/config';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UsersModule } from './modules/users/users.module';
import { AuthModule } from './modules/auth/auth.module';
import { ScheduleModule } from '@nestjs/schedule';
import { InstallModule } from './modules/install/install.module';
import { SettingsModule } from './modules/settings/settings.module';
import { SysInfoModule } from './modules/sysinfo/sysinfo.module';
import { TelegramModule } from './modules/telegram/telegram.module';
import { AutomationModule } from './modules/automation/automation.module';

@Module({
  imports: [
    ConfigModule.forRoot(),
    MongooseModule.forRoot(process.env.MONGODB_CONNECTION_STRING),
    ScheduleModule.forRoot(),
    AuthModule,
    UsersModule,
    InstallModule,
    SettingsModule,
    SysInfoModule,
    TelegramModule,
    AutomationModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
