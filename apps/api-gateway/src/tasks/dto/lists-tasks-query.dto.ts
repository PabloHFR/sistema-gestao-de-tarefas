// api-gateway/src/tasks/dto/list-tasks-query.dto.ts
import { ApiPropertyOptional } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import {
  IsEnum,
  IsInt,
  IsOptional,
  IsString,
  IsUUID,
  Max,
  Min,
} from 'class-validator';
import { TaskPriority, TaskStatus } from './create-task.dto';

export class ListTasksQueryDto {
  @ApiPropertyOptional({
    example: 1,
    description: 'Número da página',
    minimum: 1,
  })
  @IsOptional()
  @Type(() => Number)
  @IsInt({ message: 'Página deve ser um número inteiro' })
  @Min(1, { message: 'Página deve ser no mínimo 1' })
  page?: number = 1;

  @ApiPropertyOptional({
    example: 10,
    description: 'Quantidade de itens por página',
    minimum: 1,
    maximum: 100,
  })
  @IsOptional()
  @Type(() => Number)
  @IsInt({ message: 'Tamanho deve ser um número inteiro' })
  @Min(1, { message: 'Tamanho deve ser no mínimo 1' })
  @Max(100, { message: 'Tamanho deve ser no máximo 100' })
  size?: number = 10;
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
  @IsUUID()
  assignedTo?: string;

  @ApiPropertyOptional({
    example: 'bug',
    description: 'Buscar no título ou descrição',
  })
  @IsOptional()
  @IsString()
  search?: string;
}
