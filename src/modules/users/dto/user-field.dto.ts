import { IsOptional, IsString } from 'class-validator';

export class UserFieldDto {
  @IsString()
  readonly _id: string;

  @IsString()
  readonly dataType: string;

  @IsString()
  @IsOptional()
  readonly enumValues?: string[];
}
