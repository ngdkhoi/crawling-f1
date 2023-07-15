import { Type } from "class-transformer";
import { IsNumber, IsOptional, IsString, Min, Max, IsDate } from "class-validator";

export class ScheduleDto{
  @IsOptional()
  @Type(() => Date)
  @IsDate()
  startAt?: Date

  @IsOptional()
  @Type(() => Date)
  @IsDate()
  endAt?: Date

  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  @Max(22)
  @Min(0)
  round?: number

  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  year?: number = new Date().getFullYear()

  @IsOptional()
  @Type(() => String)
  teamName?: string = null

  @IsOptional()
  @Type(() => String)
  @IsString()
  sortPts?: string = 'asc'
}