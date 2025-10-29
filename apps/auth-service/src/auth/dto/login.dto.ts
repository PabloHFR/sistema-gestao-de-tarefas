import { IsString, MinLength } from 'class-validator';

export class LoginDto {
  @IsString()
  identifier: string; // Pode ser email ou username

  @IsString()
  @MinLength(6)
  password: string;
}
