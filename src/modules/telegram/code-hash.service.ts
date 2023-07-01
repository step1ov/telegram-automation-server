import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { ObjectId } from 'mongodb';
import { CodeHash, CodeHashDocument } from './schemas/code-hash.schema';

@Injectable()
export class CodeHashService {
  constructor(
    @InjectModel(CodeHash.name)
    protected readonly model: Model<CodeHashDocument>,
  ) {}

  async get(userId: ObjectId): Promise<CodeHashDocument> {
    return this.model.findOne({ userId });
  }

  async set(
    userId: ObjectId,
    hash: string,
    phone: string,
  ): Promise<CodeHashDocument> {
    await this.model.findOneAndUpdate(
      { userId },
      { hash, phone },
      { upsert: true },
    );
    return this.get(userId);
  }

  async remove(userId: ObjectId): Promise<any> {
    return this.model.deleteOne({ userId });
  }
}
