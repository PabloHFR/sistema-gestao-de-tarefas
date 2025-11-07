import { ApiProperty } from '@nestjs/swagger';
import { IsString, MinLength } from 'class-validator';

export class CreateCommentDto {
  @ApiProperty({
    example: 'Acho que devemos fazer X',
    description: 'Conteúdo do comentário',
    minLength: 1,
  })
  @IsString({ message: 'O conteúdo deve ser texto' })
  @MinLength(1, { message: 'O comentário não pode estar vazio' })
  content: string;
}
