import { ObjectId } from 'mongodb';
import { IsMongoId, IsNumber } from 'class-validator';

export class SignInDto {
  @IsMongoId()
  readonly id: ObjectId;

  @IsNumber()
  readonly code: number;
}
