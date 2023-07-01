import { IsString } from 'class-validator';

export class RestorePasswordValidateDto {
  @IsString()
  readonly otp: string;

  @IsString()
  readonly emailEncrypted: string;
}
