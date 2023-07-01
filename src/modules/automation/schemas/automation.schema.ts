import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { HydratedDocument } from 'mongoose';
import schemaOptionsDefault from '../../../common/schema-options-default';
import { User } from '../../users/schemas/user.schema';
import { ObjectId } from 'mongodb';

export type AutomationDocument = HydratedDocument<Automation>;

@Schema(schemaOptionsDefault)
export class Automation {
  @Prop({
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  })
  userId: User | ObjectId;

  @Prop({
    required: true,
    trim: true,
  })
  title: string;

  @Prop()
  chatId: string;

  @Prop()
  chatName: string;

  @Prop()
  isEnabled: boolean;
}

export const AutomationSchema = SchemaFactory.createForClass(Automation);
