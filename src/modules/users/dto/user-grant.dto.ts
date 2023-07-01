import { IsOptional, IsString } from 'class-validator';

export class UserGrantDto {
  @IsString()
  readonly _id: string;

  @IsString()
  @IsOptional()
  readonly description?: string;
}
