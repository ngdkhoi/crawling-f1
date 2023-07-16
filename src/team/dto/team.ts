import { IsNotEmpty, IsNumber, IsOptional, IsString } from "class-validator";
import { Type } from "class-transformer";
export class TeamDto {
  @IsOptional()
  @Type(() => String)
  @IsString()
  name?: string = null
}