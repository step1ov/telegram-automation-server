import { ObjectId } from 'mongodb';
import { IsMongoId, IsString } from 'class-validator';

export class UpdateSettingDto {
  @IsMongoId()
  readonly id: ObjectId;

  @IsString()
  readonly slug: string;

  @IsString()
  readonly title: string;

  @IsString()
  readonly data: string;
}
