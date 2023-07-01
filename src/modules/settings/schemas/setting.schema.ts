import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';
import schemaOptionsDefault from '../../../common/schema-options-default';

export type SettingDocument = HydratedDocument<Setting>;

@Schema(schemaOptionsDefault)
export class Setting {
  @Prop({
    required: true,
    trim: true,
    index: true,
    unique: true,
    lowercase: true,
  })
  slug: string;

  @Prop({
    required: true,
    trim: true,
    index: true,
    unique: true,
  })
  title: string;

  @Prop()
  data: string;
}

export const SettingSchema = SchemaFactory.createForClass(Setting);
