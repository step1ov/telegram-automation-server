import { IsEmail, IsOptional, IsString } from 'class-validator';
import { UserDto } from './user.dto';

export class CreateUserDto extends UserDto {
  @IsEmail()
  readonly email: string;

  @IsOptional()
  @IsString()
  password?: string;
}
