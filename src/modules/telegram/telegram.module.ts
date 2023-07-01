import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { MtprotoStoreService } from './mtproto-store.service';
import { TelegramController } from './telegram.controller';
import {
  MtprotoStore,
  MtprotoStoreSchema,
} from './schemas/mtproto-store.schema';
import { UsersService } from '../users/users.service';
import { User, UserSchema } from '../users/schemas/user.schema';
import { CodeHash, CodeHashSchema } from './schemas/code-hash.schema';
import { CodeHashService } from './code-hash.service';

@Module({
  providers: [UsersService, MtprotoStoreService, CodeHashService],
  imports: [
    MongooseModule.forFeature([
      { name: MtprotoStore.name, schema: MtprotoStoreSchema },
    ]),
    MongooseModule.forFeature([
      { name: CodeHash.name, schema: CodeHashSchema },
    ]),
    MongooseModule.forFeature([{ name: User.name, schema: UserSchema }]),
  ],
  controllers: [TelegramController],
  exports: [MtprotoStoreService, CodeHashService],
})
export class TelegramModule {}
