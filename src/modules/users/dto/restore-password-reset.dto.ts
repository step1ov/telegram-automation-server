import { IsString } from 'class-validator';
import { RestorePasswordValidateDto } from './restore-password-validate.dto';

export class RestorePasswordResetDto extends RestorePasswordValidateDto {
  @IsString()
  readonly password: string;

  @IsString()
  readonly confirm: string;
}
