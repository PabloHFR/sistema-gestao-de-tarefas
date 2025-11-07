import { ApiProperty } from '@nestjs/swagger';
import { IsString, MinLength } from 'class-validator';

export class LoginDto {
  @ApiProperty({
    example: 'user@exemplo.com',
    description: 'Email ou Nome de Usuário do usuário',
  })
  @IsString()
  identifier: string;

  @ApiProperty({
    example: 'senha123',
    description: 'Senha do usuário',
  })
  @IsString()
  @MinLength(6)
  password: string;
}
