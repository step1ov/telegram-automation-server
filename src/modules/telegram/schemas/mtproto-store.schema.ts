import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { HydratedDocument } from 'mongoose';
import { User } from '../../users/schemas/user.schema';
import schemaOptionsDefault from '../../../common/schema-options-default';

export type MtprotoStoreDocument = HydratedDocument<MtprotoStore>;

@Schema(schemaOptionsDefault)
export class MtprotoStore {
  @Prop({
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  })
  userId: User;

  @Prop({
    required: true,
    trim: true,
    index: true,
  })
  slug: string;

  @Prop()
  data: string;
}

export const MtprotoStoreSchema = SchemaFactory.createForClass(MtprotoStore);
