import { Type } from "class-transformer";
import { IsNumber, IsOptional, IsString, Min, Max } from "class-validator";

export class RacerScheduleDto{
  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  maxPts: number = Number.MAX_SAFE_INTEGER

  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  @Min(0)
  minPts?: number = 0

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
  @IsString()
  teamName: string

  @IsOptional()
  @Type(() => String)
  @IsString()
  racerName: string

  @IsOptional()
  @Type(() => String)
  @IsString()
  sortPts?: string = 'asc'
}