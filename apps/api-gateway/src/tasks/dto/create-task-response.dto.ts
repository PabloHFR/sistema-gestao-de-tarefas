import { ApiProperty } from '@nestjs/swagger';

export class CreateTaskResponseDto {
  @ApiProperty({
    example: 'Implementar autenticação JWT',
    description: 'Título da tarefa',
  })
  title: string;

  @ApiProperty({
    example: 'Criar sistema de autenticação com JWT, refresh tokens e guards',
    description: 'Descrição detalhada da tarefa',
  })
  description: string;

  @ApiProperty({
    example: '2025-12-31T23:59:59.000Z',
    description: 'Data limite para a conclusão da tarefa',
  })
  deadline: string;

  @ApiProperty({
    example: 'HIGH',
    enum: ['LOW', 'MEDIUM', 'HIGH'],
    description: 'Prioridade da tarefa',
  })
  priority: 'LOW' | 'MEDIUM' | 'HIGH';

  @ApiProperty({
    example: 'TODO',
    enum: ['TODO', 'IN_PROGRESS', 'DONE'],
    description: 'Status atual da tarefa',
  })
  status: 'TODO' | 'IN_PROGRESS' | 'DONE';

  @ApiProperty({
    example: 'c697ed6b-8753-4461-bea1-71527c6b10ee',
    description: 'UUID do usuário que criou a tarefa',
  })
  createdBy: string;

  @ApiProperty({
    type: [String],
    example: ['123e4567-e89b-12d3-a456-426614174000'],
    description: 'Lista de IDs dos usuários atribuídos à tarefa',
  })
  assignedTo: string[];

  @ApiProperty({
    example: '1d6e4793-3460-4026-8fb4-f0b5e01592d9',
    description: 'Identificador único da tarefa',
  })
  id: string;

  @ApiProperty({
    example: '2025-11-02T06:40:43.814Z',
    description: 'Data de criação da tarefa',
  })
  createdAt: string;

  @ApiProperty({
    example: '2025-11-02T06:40:43.814Z',
    description: 'Data da última atualização da tarefa',
  })
  updatedAt: string;
}
