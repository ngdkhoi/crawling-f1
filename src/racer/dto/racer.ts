import { IsNotEmpty, IsNumber, IsOptional, IsString } from "class-validator";

export class RacerDto {
  @IsString()
  name: String

  @IsString()
  href?: String

  @IsString()
  avatarUrl?: String

  @IsNumber()
  teanId: Number
}