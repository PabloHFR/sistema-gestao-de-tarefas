import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsEnum, IsOptional, IsString, IsUUID } from 'class-validator';
import { TaskPriority, TaskStatus } from './create-task.dto';

export class FilterTasksDto {
  @ApiPropertyOptional({
    example: 'TODO',
    enum: TaskStatus,
    description: 'Filtrar por status',
  })
  @IsOptional()
  @IsEnum(TaskStatus)
  status?: TaskStatus;

  @ApiPropertyOptional({
    example: 'HIGH',
    enum: TaskPriority,
    description: 'Filtrar por prioridade',
  })
  @IsOptional()
  @IsEnum(TaskPriority)
  priority?: TaskPriority;

  @ApiPropertyOptional({
    example: '123e4567-e89b-12d3-a456-426614174000',
    description: 'Filtrar por usuário atribuído (UUID)',
  })
  @IsOptional()
  @IsUUID('4')
  assignedTo?: string;

  @ApiPropertyOptional({
    example: 'bug',
    description: 'Buscar no título ou descrição',
  })
  @IsOptional()
  @IsString()
  search?: string;
}
