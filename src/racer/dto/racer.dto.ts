import { IsNotEmpty, IsNumber, IsOptional, IsString } from "class-validator";
import { Type } from "class-transformer";

export class RacerDto {
  @IsOptional()
  @Type(() => String)
  @IsString()
  name?: string = null

  @IsOptional()
  @IsString()
  href?: string

  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  teamId?: number

  @IsOptional()
  @Type(() => String)
  @IsString()
  teamName?: string = null
}