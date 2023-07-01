import { IsEnum, IsNumber, IsOptional, IsString } from 'class-validator';
import { UserGendersType } from '../constants/user-genders-type';

export class UserDto {
  @IsOptional()
  @IsString()
  readonly username?: string;

  @IsString()
  @IsOptional()
  readonly firstName?: string;

  @IsString()
  @IsOptional()
  readonly lastName?: string;

  @IsNumber()
  @IsOptional()
  readonly dob?: number;

  @IsEnum(UserGendersType)
  @IsOptional()
  readonly gender?: UserGendersType;

  @IsString()
  @IsOptional()
  readonly about?: string;

  @IsOptional()
  @IsString()
  readonly role?: string;

  @IsOptional()
  @IsString()
  readonly status?: string;

  @IsOptional()
  @IsString()
  readonly region?: string;
}
