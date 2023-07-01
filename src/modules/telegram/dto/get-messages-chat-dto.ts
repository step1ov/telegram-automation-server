import { ObjectId } from 'mongodb';
import { IsMongoId, IsString } from 'class-validator';

export class GetMessagesChatDto {
  @IsMongoId()
  readonly id: ObjectId;

  @IsString()
  readonly chatId: string;
}
