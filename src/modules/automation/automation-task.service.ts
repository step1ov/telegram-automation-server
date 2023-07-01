import { Injectable } from '@nestjs/common';
import { Cron, CronExpression } from '@nestjs/schedule';
import { AutomationService } from './automation.service';
import { MtprotoStoreService } from '../telegram/mtproto-store.service';
import { TelegramAPI } from '../telegram/api/telegram-api';
import { ObjectId } from 'mongodb';
@Injectable()
export class AutomationTaskService {
  constructor(
    protected readonly automationService: AutomationService,
    protected readonly mtprotoStoreService: MtprotoStoreService,
  ) {}

  @Cron(CronExpression.EVERY_MINUTE)
  async handleAutomation() {
    const scenarios = await this.automationService.findAllEnabled();
    const n = scenarios.length;
    for (let i = 0; i < n; i++) {
      const scenario = scenarios[i];
      if (scenario.chatId && scenario.isEnabled) {
        const api = new TelegramAPI(
          this.mtprotoStoreService,
          scenario.userId as ObjectId,
        );
        // const res = await api.sendMessageChat({
        //   chat_id: scenario.chatId,
        //   message: 'test msg',
        // });
        // console.log('res', res);

        const messagesData: any = await api.getMessageChat({
          chat_id: scenario.chatId,
        });

        if (messagesData) {
          if (
            messagesData.messages &&
            Array.isArray(messagesData.messages) &&
            messagesData.messages.length > 0
          ) {
            const messageData = messagesData.messages[0];
            if (messageData && messageData.message) {
              const message = messageData.message.toLowerCase();
              if (message.includes('доброе утро')) {
                const res = await api.sendMessageChat({
                  chat_id: scenario.chatId,
                  message: 'Доброе утро',
                });
              }
            }
          }
        }
      }
    }
  }
}
