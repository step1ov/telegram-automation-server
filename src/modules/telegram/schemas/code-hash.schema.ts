import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { HydratedDocument } from 'mongoose';
import { User } from '../../users/schemas/user.schema';
import schemaOptionsDefault from '../../../common/schema-options-default';

export type CodeHashDocument = HydratedDocument<CodeHash>;

@Schema(schemaOptionsDefault)
export class CodeHash {
  @Prop({
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
    unique: true,
  })
  userId: User;

  @Prop({
    required: true,
  })
  hash: string;

  @Prop({
    required: true,
  })
  phone: string;
}

export const CodeHashSchema = SchemaFactory.createForClass(CodeHash);
