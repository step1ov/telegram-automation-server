import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { HydratedDocument } from 'mongoose';
import { UserRole } from './user-role.schema';

export type UserDocument = HydratedDocument<User>;

@Schema({
  timestamps: true,
  toJSON: {
    transform: (doc: any, ret) => {
      delete ret.__v;
      ret.id = ret._id;
      delete ret._id;
      ret.fields = ret.fields
        ? ret.fields.reduce((a, v) => ({ ...a, [v._id]: v.value }), {})
        : {};
    },
    virtuals: true,
    getters: true,
  },
  toObject: { virtuals: true, getters: true },
})
export class User {
  @Prop({
    required: true,
    trim: true,
    index: true,
    unique: true,
    lowercase: true,
    minLength: 4,
    maxLength: 40,
  })
  email: string;

  @Prop({
    trim: true,
    index: true,
    unique: true,
    sparse: true,
    lowercase: true,
    minLength: 4,
    maxLength: 40,
  })
  username: string;

  @Prop({
    trim: true,
    minLength: 5,
    maxLength: 60,
    select: false,
  })
  password: string;

  @Prop({
    type: { code: String, expiration: Date },
    select: false,
  })
  otp: {
    code: string;
    expiration: Date;
  };

  @Prop()
  phone: string;

  @Prop()
  firstName: string;

  @Prop()
  lastName: string;

  @Prop()
  displayName: string;

  @Prop()
  avatar: string;

  @Prop()
  dob: number;

  @Prop({ enum: ['male', 'female', 'not_specified'], default: 'not_specified' })
  gender: string;

  @Prop()
  region: string;

  @Prop()
  about: string;

  @Prop({ enum: ['light', 'dark'], default: 'light' })
  theme: string;

  @Prop({ type: { email: String, phone: String } })
  verification: {
    email: string;
    phone: string;
  };

  @Prop({ default: -180 })
  timezone: number;

  @Prop({
    enum: ['draft', 'active', 'blocked', 'deleted'],
    default: 'active',
    required: true,
  })
  status: string;

  @Prop({ default: Date.now })
  passwordUpdatedAt: Date;

  @Prop({ type: mongoose.Schema.Types.String, ref: 'UserRole' })
  role: UserRole;
}

const UserSchema = SchemaFactory.createForClass(User);

export { UserSchema };
