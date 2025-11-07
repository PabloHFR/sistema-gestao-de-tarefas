import { IsString, MinLength } from 'class-validator';

export class CreateCommentDto {
  @IsString({ message: 'O comentário deve ser texto' })
  @MinLength(1, { message: 'O comentário não pode estar vazio' })
  content: string;
}
