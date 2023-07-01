import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { AutomationService } from './automation.service';
import { UsersService } from '../users/users.service';
import { Automation, AutomationSchema } from './schemas/automation.schema';
import { AutomationController } from './automation.controller';
import { User, UserSchema } from '../users/schemas/user.schema';
import { MtprotoStoreService } from '../telegram/mtproto-store.service';
import { AutomationTaskService } from './automation-task.service';
import {
  MtprotoStore,
  MtprotoStoreSchema,
} from '../telegram/schemas/mtproto-store.schema';

@Module({
  providers: [
    UsersService,
    MtprotoStoreService,
    AutomationService,
    AutomationTaskService,
  ],
  imports: [
    MongooseModule.forFeature([
      { name: Automation.name, schema: AutomationSchema },
    ]),
    MongooseModule.forFeature([
      { name: MtprotoStore.name, schema: MtprotoStoreSchema },
    ]),
    MongooseModule.forFeature([{ name: User.name, schema: UserSchema }]),
  ],
  controllers: [AutomationController],
  exports: [AutomationService, AutomationTaskService],
})
export class AutomationModule {}
