import MTProto from '@mtproto/core';
import { sleep } from '@mtproto/core/src/utils/common';
import { MtprotoStoreService } from '../mtproto-store.service';
import { ObjectId } from 'mongodb';
import { MtprotoStore } from './mtproto-store';
import { HttpException } from '@nestjs/common';
import generatePassword from 'password-generator';
import { getRandomArbitrary } from '../../../utils/random';

export class TelegramAPI {
  mtproto: any;
  constructor(
    protected readonly dataService: MtprotoStoreService,
    protected readonly userId: ObjectId,
  ) {
    const instance = new MtprotoStore(dataService, userId);
    this.mtproto = new MTProto({
      api_id: parseInt(process.env.TG_API_ID),
      api_hash: process.env.TG_API_HASH,

      storageOptions: {
        instance,
      },
    });
  }

  async call(method: any, params?: any, options: any = {}): Promise<any> {
    try {
      return await this.mtproto.call(method, params, options);
    } catch (error: any) {
      console.log(`${method} error:`, error);

      const { error_code, error_message } = error;

      if (error_code === 420) {
        console.log('error_code 420', error_code);
        const seconds = Number(error_message.split('FLOOD_WAIT_')[1]);
        const ms = seconds * 1000;

        await sleep(ms);

        return this.call(method, params, options);
      }

      if (error_code === 303) {
        console.log('error_code 303', error_code);
        const [type, dcIdAsString] = error_message.split('_MIGRATE_');

        const dcId = Number(dcIdAsString);

        // If auth.sendCode call on incorrect DC need change default DC, because
        // call auth.signIn on incorrect DC return PHONE_CODE_EXPIRED error
        if (type === 'PHONE') {
          await this.mtproto.setDefaultDc(dcId);
        } else {
          Object.assign(options, { dcId });
        }

        return this.call(method, params, options);
      }

      throw new HttpException(error_message, error_code);
    }
  }

  async sendCode(phone: string): Promise<any> {
    return this.call('auth.sendCode', {
      phone_number: phone,
      settings: {
        _: 'codeSettings',
      },
    });
  }

  async getUser(): Promise<any> {
    return this.call('users.getFullUser', {
      id: {
        _: 'inputUserSelf',
      },
    });
  }

  async signIn({
    code,
    phone,
    phone_code_hash,
  }: {
    code: string;
    phone: string;
    phone_code_hash: string;
  }): Promise<any> {
    return this.call(
      'auth.signIn',
      {
        phone_code: code,
        phone_number: phone,
        phone_code_hash: phone_code_hash,
      },
      { syncAuth: false },
    );
  }

  async signUp({
    phone,
    phone_code_hash,
  }: {
    phone: string;
    phone_code_hash: string;
  }): Promise<any> {
    return this.call('auth.signUp', {
      phone_number: phone,
      phone_code_hash: phone_code_hash,
      first_name: 'MTProto',
      last_name: 'Core',
    });
  }

  async getPassword(): Promise<any> {
    return this.call('account.getPassword');
  }

  async checkPassword({
    srp_id,
    A,
    M1,
  }: {
    srp_id: any;
    A: any;
    M1: any;
  }): Promise<any> {
    return this.call('auth.checkPassword', {
      password: {
        _: 'inputCheckPasswordSRP',
        srp_id,
        A,
        M1,
      },
    });
  }

  async loggedOut(): Promise<any> {
    return this.call('auth.logOut');
  }

  async getContacts(): Promise<TelegramContactsResponse> {
    return this.call('contacts.getContacts');
  }

  async sendMessage({
    message,
    user_id,
    access_hash,
  }: {
    message: string;
    user_id: string;
    access_hash: string;
  }): Promise<any> {
    return this.call('messages.sendMessage', {
      clear_draft: true,
      peer: {
        _: 'inputPeerUser',
        user_id,
        access_hash,
      },
      message,
      random_id:
        Math.ceil(Math.random() * 0xffffff) +
        Math.ceil(Math.random() * 0xffffff),
    });
  }

  async getChannels(): Promise<any> {
    const LIMIT = 100;
    const offsetId = 0;
    const offsetDate = 0;
    const offsetPeer = {
      _: 'inputPeerEmpty',
    };
    return this.call('messages.getDialogs', {
      offset_id: offsetId,
      offset_peer: offsetPeer,
      offset_date: offsetDate,
      limit: LIMIT,
    });
  }

  async sendMessageChat({
    message,
    chat_id,
  }: {
    message: string;
    chat_id: string;
  }): Promise<any> {
    return this.call('messages.sendMessage', {
      clear_draft: true,
      peer: {
        _: 'inputPeerChat',
        chat_id,
      },
      message,
      random_id:
        Math.ceil(Math.random() * 0xffffff) +
        Math.ceil(Math.random() * 0xffffff),
    });
  }

  async getMessageChat({ chat_id }: { chat_id: string }): Promise<any> {
    return this.call('messages.getHistory', {
      peer: {
        _: 'inputPeerChat',
        chat_id,
      },
      offset_id: 0,
      offset_date: 0,
      add_offset: 0,
      limit: 10,
      max_id: 0,
      min_id: 0,
      hash: 0,
    });
  }

  async setPassword(password: string): Promise<any> {
    const getPasswordResult = await this.getPassword();
    const { srp_id, current_algo, srp_B } = getPasswordResult;
    const { g, p, salt1, salt2 } = current_algo;

    const { A, M1 } = await this.mtproto.crypto.getSRPParams({
      g,
      p,
      salt1,
      salt2,
      gB: srp_B,
      password,
    });

    return this.checkPassword({ srp_id, A, M1 });
  }

  async generatePassword(): Promise<any> {
    return this.setPassword(
      generatePassword(getRandomArbitrary(10, 15), false),
    );
  }
}
