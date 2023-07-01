import { IsArray, IsOptional, IsString } from 'class-validator';

export class CreateUserRoleDto {
  @IsString()
  readonly _id: string;

  @IsString()
  @IsOptional()
  readonly description?: string;

  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  readonly grants?: string[];
}
