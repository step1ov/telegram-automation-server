import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';
import schemaOptionsDefault from '../../../common/schema-options-default';

export type UserGrantDocument = HydratedDocument<UserGrant>;

@Schema(schemaOptionsDefault)
export class UserGrant {
  @Prop()
  _id: string;

  @Prop()
  description: string;
}

export const UserGrantSchema = SchemaFactory.createForClass(UserGrant);
