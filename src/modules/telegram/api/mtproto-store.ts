import { MtprotoStoreService } from '../mtproto-store.service';
import { ObjectId } from 'mongodb';

export class MtprotoStore {
  constructor(
    protected readonly dataService: MtprotoStoreService,
    protected readonly userId: ObjectId,
  ) {}

  async set(key: string, value: string): Promise<void> {
    await this.dataService.set(this.userId, key, value);
  }
  async get(key: string): Promise<string | null> {
    return (await this.dataService.get(this.userId, key))?.data || null;
  }
}
