import { ObjectId } from 'mongodb';
import { IsMongoId, IsNumber } from 'class-validator';

export class SendCodeDto {
  @IsMongoId()
  readonly id: ObjectId;

  @IsNumber()
  readonly phone: number;
}
