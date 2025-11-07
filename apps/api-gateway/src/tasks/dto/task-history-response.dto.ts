import { HistoryAction } from '@monorepo/types';
import { ApiProperty } from '@nestjs/swagger';

export class TaskHistoryResponseDto {
  @ApiProperty({
    example: '4ef27aea-43b0-49ee-8c3c-4758b7c5d4d6',
    description: 'Identificador único do histórico',
  })
  id: string;

  @ApiProperty({
    enum: HistoryAction,
    example: HistoryAction.UPDATED,
    description: 'Ação registrada no histórico da tarefa',
  })
  action: HistoryAction;

  @ApiProperty({
    example: 'c697ed6b-8753-4461-bea1-71527c6b10ee',
    description: 'ID do usuário que realizou a ação',
  })
  userId: string;

  @ApiProperty({
    example: 'João',
    description: 'Nome do usuário que realizou a ação (desnormalizado)',
  })
  username: string;

  @ApiProperty({
    example: 'title',
    description: 'Campo que foi alterado (quando aplicável)',
    nullable: true,
  })
  field: string | null;

  @ApiProperty({
    example: '"Implementar autenticação JWT"',
    description: 'Valor antigo (quando aplicável)',
    nullable: true,
  })
  oldValue: string | null;

  @ApiProperty({
    example: '"Implementar"',
    description: 'Novo valor (quando aplicável)',
    nullable: true,
  })
  newValue: string | null;

  @ApiProperty({
    example: '4867607e-2cd9-416e-8c2d-4a139d55e89c',
    description: 'ID da tarefa associada a este histórico',
  })
  taskId: string;

  @ApiProperty({
    example: '2025-11-02T07:25:01.423Z',
    description: 'Data e hora em que o histórico foi criado',
  })
  createdAt: string;
}
