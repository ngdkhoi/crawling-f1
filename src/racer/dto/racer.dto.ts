import { IsNotEmpty, IsNumber, IsOptional, IsString } from "class-validator";

export class RacerDto {
  @IsString()
  name: string

  @IsString()
  href?: string

  @IsString()
  avatarUrl?: string

  @IsNumber()
  teanId: number

  @IsString()
  team: string
}