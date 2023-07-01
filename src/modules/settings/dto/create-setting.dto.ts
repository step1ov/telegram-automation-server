import { IsString } from 'class-validator';

export class CreateSettingDto {
  @IsString()
  readonly slug: string;

  @IsString()
  readonly title: string;

  @IsString()
  readonly data: string;
}
