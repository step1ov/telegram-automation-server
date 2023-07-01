import { ObjectId } from 'mongodb';
import { IsMongoId, IsString } from 'class-validator';

export class SendMessageDto {
  @IsMongoId()
  readonly id: ObjectId;

  @IsString()
  readonly userId: string;

  @IsString()
  readonly userHash: string;

  @IsString()
  readonly message: string;
}
