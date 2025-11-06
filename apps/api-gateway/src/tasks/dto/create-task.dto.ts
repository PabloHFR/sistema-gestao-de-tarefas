import { ApiProperty } from '@nestjs/swagger';
import {
  IsArray,
  IsDateString,
  IsEnum,
  IsOptional,
  IsString,
  IsUUID,
  MinLength,
} from 'class-validator';

export enum TaskPriority {
  LOW = 'LOW',
  MEDIUM = 'MEDIUM',
  HIGH = 'HIGH',
  URGENT = 'URGENT',
}

export enum TaskStatus {
  TODO = 'TODO',
  IN_PROGRESS = 'IN_PROGRESS',
  REVIEW = 'REVIEW',
  DONE = 'DONE',
}

export class CreateTaskDto {
  @ApiProperty({
    example: 'Implementar autenticação JWT',
    description: 'Título da tarefa',
    minLength: 3,
  })
  @IsString({ message: 'O título deve ser texto' })
  @MinLength(3, { message: 'O título deve ter no mínimo 3 caracteres' })
  title: string;

  @ApiProperty({
    example: 'Criar sistema de autenticação com JWT, refresh tokens e guards',
    description: 'Descrição detalhada da tarefa',
    minLength: 10,
  })
  @IsString({ message: 'A descrição deve ser texto' })
  @MinLength(10, { message: 'A descrição deve ter no mínimo 10 caracteres' })
  description: string;

  @ApiProperty({
    example: '2025-12-31T23:59:59.000Z',
    description: 'Data limite para conclusão (ISO 8601)',
    required: false,
  })
  @IsDateString({}, { message: 'Data de prazo inválida' })
  @IsOptional()
  deadline?: string;

  @ApiProperty({
    example: 'HIGH',
    enum: TaskPriority,
    description: 'Prioridade da tarefa',
    required: false,
  })
  @IsEnum(TaskPriority, { message: 'Prioridade inválida' })
  @IsOptional()
  priority?: TaskPriority;

  @ApiProperty({
    example: 'TODO',
    enum: TaskStatus,
    description: 'Status atual da tarefa',
    required: false,
  })
  @IsEnum(TaskStatus, { message: 'Status inválido' })
  @IsOptional()
  status?: TaskStatus;

  @ApiProperty({
    example: [''],
    description: 'IDs dos usuários atribuídos à tarefa',
    type: [String],
    required: false,
  })
  @IsArray({ message: 'assignedTo deve ser um array' })
  @IsUUID('all', {
    each: true,
    message: 'Cada ID de usuário deve ser UUID válido',
  })
  @IsOptional()
  assignedTo?: string[];
}
