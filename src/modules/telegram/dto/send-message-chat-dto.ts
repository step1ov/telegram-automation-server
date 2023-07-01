import { ObjectId } from 'mongodb';
import { IsMongoId, IsString } from 'class-validator';

export class SendMessageChatDto {
  @IsMongoId()
  readonly id: ObjectId;

  @IsString()
  readonly chatId: string;

  @IsString()
  readonly message: string;
}
