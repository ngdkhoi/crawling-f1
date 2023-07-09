import { IsNotEmpty, IsNumber, IsOptional, IsString } from "class-validator";

export class TeamDto {
  @IsString()
  @IsNotEmpty()
  name: String

  @IsString()
  logoImageUrl: String
}