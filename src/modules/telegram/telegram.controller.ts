import {
  Body,
  Controller,
  Get,
  HttpException,
  HttpStatus,
  Param,
  Post,
  UseGuards,
} from '@nestjs/common';
import { MtprotoStoreService } from './mtproto-store.service';
import { ObjectId } from 'mongodb';
import { TelegramAPI } from './api/telegram-api';
import { SendCodeDto } from './dto/send-code-dto';
import { CodeHashService } from './code-hash.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { SignInDto } from './dto/sign-in-dto';
import * as process from 'process';
import CryptoJS from 'crypto-js';
import { SendMessageDto } from './dto/send-message-dto';
import { SendMessageChatDto } from './dto/send-message-chat-dto';
import { GetMessagesChatDto } from './dto/get-messages-chat-dto';

@Controller('telegram')
@UseGuards(JwtAuthGuard)
export class TelegramController {
  constructor(
    protected readonly mtprotoStoreService: MtprotoStoreService,
    protected readonly codeHashService: CodeHashService,
  ) {}

  @Get(':id')
  async findOne(@Param('id') id: ObjectId): Promise<Partial<TelegramUser>> {
    const userData: TelegramUserResponse = (await new TelegramAPI(
      this.mtprotoStoreService,
      new ObjectId(id),
    ).getUser()) as TelegramUserResponse;
    if (
      userData.users &&
      Array.isArray(userData.users) &&
      userData.users.length > 0
    ) {
      const user = userData.users[0];
      return {
        id: user.id,
        username: user.username,
        first_name: user.first_name,
        last_name: user.last_name,
        status: user.status,
      };
    } else {
      throw new HttpException('Bad API response', HttpStatus.BAD_REQUEST);
    }
  }

  @Get(':id/logout')
  async logout(@Param('id') id: ObjectId): Promise<any> {
    const userId = new ObjectId(id);
    const logoutResult = await new TelegramAPI(
      this.mtprotoStoreService,
      userId,
    ).loggedOut();
    await this.mtprotoStoreService.clear(userId);
    return { ok: true, data: logoutResult };
  }

  @Post('send-code')
  async sendCode(@Body() dto: SendCodeDto): Promise<any> {
    const { phone_code_hash } = await new TelegramAPI(
      this.mtprotoStoreService,
      new ObjectId(dto.id),
    ).sendCode(dto.phone.toString());
    if (phone_code_hash) {
      const phone = CryptoJS.AES.encrypt(
        dto.phone.toString(),
        process.env.PHONE_ENCRYPT_SECRET_KEY as string,
      ).toString();
      await this.codeHashService.set(
        new ObjectId(dto.id),
        phone_code_hash,
        phone,
      );
      return { ok: true };
    }
    throw new HttpException('Failed to send code', HttpStatus.BAD_REQUEST);
  }

  @Post('signin')
  async signIn(@Body() dto: SignInDto): Promise<any> {
    const codeData = await this.codeHashService.get(dto.id);
    if (codeData) {
      const code = dto.code.toString();
      const phone_code_hash = codeData.hash;
      const phone = CryptoJS.AES.decrypt(
        codeData.phone,
        process.env.PHONE_ENCRYPT_SECRET_KEY,
      ).toString(CryptoJS.enc.Utf8);
      const _phone = '+' + parseInt(phone);

      const api = new TelegramAPI(
        this.mtprotoStoreService,
        new ObjectId(dto.id),
      );

      try {
        const signInResult = await api.signIn({
          code,
          phone: _phone,
          phone_code_hash,
        });

        if (signInResult._ === 'auth.authorizationSignUpRequired') {
          const signUpResult = await api.signUp({
            phone,
            phone_code_hash,
          });
          return { user: signUpResult?.user, ok: true };
        } else {
          return { result: signInResult?.user, ok: true };
        }
      } catch (error: any) {
        console.error(`error:`, error);

        if (error.error_message !== 'SESSION_PASSWORD_NEEDED') {
          throw new HttpException(
            'TG error: ' + error.error_message,
            HttpStatus.BAD_REQUEST,
          );
        }

        // 2FA
        const checkPasswordResult = api.generatePassword();
        console.log(`2fa:`, checkPasswordResult);

        return { result: error, ok: true, data: checkPasswordResult };
      }
    } else {
      throw new HttpException('Code not found', HttpStatus.BAD_REQUEST);
    }
  }

  @Get(':id/contacts')
  async getContacts(
    @Param('id') id: ObjectId,
  ): Promise<TelegramContactsResponse> {
    const userId = new ObjectId(id);
    return new TelegramAPI(this.mtprotoStoreService, userId).getContacts();
  }

  @Post('send-message')
  async sendMessage(@Body() dto: SendMessageDto): Promise<any> {
    return new TelegramAPI(this.mtprotoStoreService, dto.id).sendMessage({
      user_id: dto.userId,
      access_hash: dto.userHash,
      message: dto.message,
    });
  }

  @Get(':id/channels')
  async getChannels(
    @Param('id') id: ObjectId,
  ): Promise<TelegramContactsResponse> {
    const userId = new ObjectId(id);
    return new TelegramAPI(this.mtprotoStoreService, userId).getChannels();
  }

  @Post('send-message-chat')
  async sendMessageChat(@Body() dto: SendMessageChatDto): Promise<any> {
    return new TelegramAPI(this.mtprotoStoreService, dto.id).sendMessageChat({
      chat_id: dto.chatId,
      message: dto.message,
    });
  }

  @Post('get-messages-chat')
  async getMessageChat(@Body() dto: GetMessagesChatDto): Promise<any> {
    return new TelegramAPI(this.mtprotoStoreService, dto.id).getMessageChat({
      chat_id: dto.chatId,
    });
  }

  @Get(':id/update2fa')
  async update2fa(@Param('id') id: ObjectId): Promise<any> {
    const userId = new ObjectId(id);
    const data = await new TelegramAPI(
      this.mtprotoStoreService,
      userId,
    ).generatePassword();
    return { ok: true, data };
  }
}
