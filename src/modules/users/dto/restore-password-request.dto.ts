import { IsEmail } from 'class-validator';

export class RestorePasswordRequestDto {
  @IsEmail()
  readonly email: string;
}
