import { IsMongoId } from 'class-validator';
import { ObjectId } from 'mongodb';
import { UserDto } from './user.dto';

export class UpdateUserDto extends UserDto {
  @IsMongoId()
  readonly id: ObjectId;
}
