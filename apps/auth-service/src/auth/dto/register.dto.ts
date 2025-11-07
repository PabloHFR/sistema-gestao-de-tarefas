import { IsEmail, IsString, MinLength } from 'class-validator';

export class RegisterDto {
  @IsEmail(
    {},
    {
      message: 'Email inválido',
    },
  )
  email: string;

  @IsString({ message: 'O nome do usuário deve ser texto' })
  @MinLength(3, {
    message: 'O nome do usuário deve ter no mínimo 3 caracteres',
  })
  @MinLength(3) // Username precisa de no mínimo 3 caracteres
  username: string;

  @IsString({ message: 'Senha deve ser texto' })
  @MinLength(6, { message: 'Senha deve ter no mínimo 6 caracteres' }) // Senha precisa de no mínimo 6 caracteres
  password: string;
}
