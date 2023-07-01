import { ArrayMinSize, IsMongoId } from 'class-validator';
import { ObjectId } from 'mongodb';

export class RemoveManyDto {
  @IsMongoId({ each: true })
  @ArrayMinSize(1)
  readonly ids: ObjectId[];
}
