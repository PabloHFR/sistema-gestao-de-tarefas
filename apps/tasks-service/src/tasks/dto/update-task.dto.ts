import { PartialType } from '@nestjs/mapped-types';
import { CreateTaskDto } from './create-task.dto';

// PartialType torna todos os campos opcionais e evita repetição de código (DRY)
export class UpdateTaskDto extends PartialType(CreateTaskDto) {}
