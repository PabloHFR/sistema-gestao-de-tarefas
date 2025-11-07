import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsString, MinLength } from 'class-validator';

export class RegisterDto {
  @ApiProperty({
    example: 'user@exemplo.com',
    description: 'Email do usuário',
  })
  @IsEmail({}, { message: 'Email inválido' })
  email: string;

  @ApiProperty({
    example: 'João',
    description: 'Nome de usuário único',
    minLength: 3,
  })
  @IsString({ message: 'Nome do usuário deve ser texto' })
  @MinLength(3, { message: 'Nome do usuário deve ter no mínimo 3 caracteres' })
  username: string;

  @ApiProperty({
    example: 'senha123',
    description: 'Senha do usuário',
    minLength: 6,
  })
  @IsString({ message: 'A senha deve ser texto' })
  @MinLength(6, { message: 'A senha deve ter no mínimo 6 caracteres' })
  password: string;
}
