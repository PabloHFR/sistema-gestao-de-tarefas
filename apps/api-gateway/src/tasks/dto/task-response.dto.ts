import { ApiProperty } from '@nestjs/swagger';
import { TaskPriority, TaskStatus } from './create-task.dto';
import { CommentResponseDto } from './comment-response.dto';
import { TaskHistoryResponseDto } from './task-history-response.dto';

export class TaskResponseDto {
  @ApiProperty({ example: 'a6edc9e4-f4bc-4caa-9a8f-b21443a11547' })
  id: string;

  @ApiProperty({ example: 'Tarefa' })
  title: string;

  @ApiProperty({ example: 'Bug' })
  description: string;

  @ApiProperty({ example: null })
  deadline: string | null;

  @ApiProperty({ enum: TaskPriority, example: 'MEDIUM' })
  priority: TaskPriority;

  @ApiProperty({ enum: TaskStatus, example: 'TODO' })
  status: TaskStatus;

  @ApiProperty({
    example: '123e4567-e89b-12d3-a456-426614174000',
    description: 'Usuário criador da tarefa',
  })
  createdBy: string;

  @ApiProperty({
    example: ['123e4567-e89b-12d3-a456-426614174000'],
    description: 'Usuários atribuídos à tarefa',
    type: [String],
  })
  assignedTo: string[];

  @ApiProperty({
    type: [CommentResponseDto],
    description: 'Lista de comentários associados à tarefa',
  })
  comments: CommentResponseDto[];

  @ApiProperty({
    type: [TaskHistoryResponseDto],
    description: 'Histórico de alterações da tarefa',
  })
  history: TaskHistoryResponseDto[];

  @ApiProperty({ example: '2025-11-02T05:33:02.501Z' })
  createdAt: string;

  @ApiProperty({ example: '2025-11-02T05:33:02.501Z' })
  updatedAt: string;
}
