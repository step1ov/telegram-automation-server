import { IsDate, IsEnum, IsOptional } from 'class-validator';
import { PeriodSelectorType } from '../constants/period-selector-type';

export class PeriodSelectorDto {
  @IsEnum(PeriodSelectorType)
  readonly periodType: PeriodSelectorType;

  @IsOptional()
  @IsDate()
  start?: Date | null;

  @IsOptional()
  @IsDate()
  finish?: Date | null;
}
