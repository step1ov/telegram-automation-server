import { IsString } from 'class-validator';

export class ChangePasswordDto {
  @IsString()
  readonly old: string;

  @IsString()
  readonly password: string;

  @IsString()
  readonly confirm: string;
}
