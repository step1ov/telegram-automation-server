import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { HydratedDocument } from 'mongoose';
import { UserGrant } from './user-grant.schema';
import schemaOptionsDefault from '../../../common/schema-options-default';

export type UserRoleDocument = HydratedDocument<UserRole>;

@Schema(schemaOptionsDefault)
export class UserRole {
  @Prop({ type: mongoose.Schema.Types.String })
  _id: string;

  @Prop()
  description: string;

  @Prop({ type: [{ type: mongoose.Schema.Types.String, ref: 'UserGrant' }] })
  grants: UserGrant[];

  @Prop({ default: false })
  isDeleted: boolean;
}

export const UserRoleSchema = SchemaFactory.createForClass(UserRole);
