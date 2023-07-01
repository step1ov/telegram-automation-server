import { IsBoolean, IsMongoId, IsOptional, IsString } from 'class-validator';
import { ObjectId } from 'mongodb';

export class UpdateAutomationDto {
  @IsMongoId()
  id: ObjectId;

  @IsMongoId()
  userId: ObjectId;

  @IsString()
  title: string;

  @IsOptional()
  @IsString()
  readonly chatName?: string;

  @IsOptional()
  @IsString()
  readonly chatId?: string;

  @IsOptional()
  @IsBoolean()
  readonly isEnabled?: boolean;
}
