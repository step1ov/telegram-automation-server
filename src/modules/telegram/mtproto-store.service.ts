import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { ObjectId } from 'mongodb';
import {
  MtprotoStore,
  MtprotoStoreDocument,
} from './schemas/mtproto-store.schema';

@Injectable()
export class MtprotoStoreService {
  constructor(
    @InjectModel(MtprotoStore.name)
    protected readonly model: Model<MtprotoStoreDocument>,
  ) {}

  async get(userId: ObjectId, slug: string): Promise<MtprotoStoreDocument> {
    return this.model.findOne({ userId, slug });
  }

  async set(
    userId: ObjectId,
    slug: string,
    data: string,
  ): Promise<MtprotoStoreDocument> {
    await this.model.findOneAndUpdate(
      { userId, slug },
      { data },
      { upsert: true },
    );
    return this.get(userId, slug);
  }

  async clear(userId: ObjectId): Promise<any> {
    return this.model.deleteMany({ userId });
  }
}
