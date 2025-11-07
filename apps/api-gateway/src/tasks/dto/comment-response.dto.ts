import { ApiProperty } from '@nestjs/swagger';

export class CommentResponseDto {
  @ApiProperty({
    example: 'a23d1b6f-78b2-4b27-84df-94f26cc9d12c',
    description: 'ID UUID do comentário',
  })
  id: string;

  @ApiProperty({
    example: 'Esse recurso precisa de testes automatizados.',
    description: 'Conteúdo do comentário',
  })
  content: string;

  @ApiProperty({
    example: 'c697ed6b-8753-4461-bea1-71527c6b10ee',
    description: 'ID do autor do comentário',
  })
  authorId: string;

  @ApiProperty({
    example: 'João',
    description: 'Username do autor',
  })
  authorName: string;

  @ApiProperty({
    example: '4867607e-2cd9-416e-8c2d-4a139d55e89c',
    description: 'ID da tarefa à qual o comentário pertence',
  })
  taskId: string;

  @ApiProperty({
    example: '2025-11-02T07:40:00.000Z',
    description: 'Data de criação do comentário',
  })
  createdAt: string;
}
