import {
  IsArray,
  IsDateString,
  IsEnum,
  IsOptional,
  IsString,
  IsUUID,
  MinLength,
} from 'class-validator';
import { TaskPriority, TaskStatus } from '../entity/tasks.entity';

export class CreateTaskDto {
  @IsString({ message: 'O título deve ser texto' })
  @MinLength(3, { message: 'O título deve ter no mínimo 3 caracteres' })
  title: string;

  @IsString({ message: 'A descrição deve ser texto' })
  @MinLength(3, { message: 'A descrição deve ter no mínimo 3 caracteres' })
  description: string;

  @IsDateString({}, { message: 'Data de prazo inválida' })
  @IsOptional()
  deadline?: string;

  @IsEnum(TaskPriority, { message: 'Prioridade inválida' })
  @IsOptional()
  priority?: TaskPriority;

  @IsEnum(TaskStatus, { message: 'Status inválido' })
  @IsOptional()
  status?: TaskStatus;

  @IsArray({ message: 'assignedTo deve ser um array' })
  @IsUUID('4', {
    each: true,
    message: 'Cada ID de usuário deve ser um UUID válido',
  })
  @IsOptional()
  assignedTo?: string[];
}
