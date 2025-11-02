import { Controller } from '@nestjs/common';
import { TasksService } from './tasks.service';
import { MessagePattern, Payload } from '@nestjs/microservices';
import { PaginationQueryDto } from './dto/pagination-query.dto';
import { FilterTasksDto } from './dto/filter-tasks.dto';

@Controller('tasks')
export class TasksController {
  constructor(private readonly tasksService: TasksService) {}

  // Lista tarefas com filtros e paginação
  @MessagePattern('tasks.findAll')
  async findAll(
    @Payload()
    payload: {
      pagination: PaginationQueryDto;
      filters: FilterTasksDto;
    },
  ) {
    return await this.tasksService.findAll(payload.pagination, payload.filters);
  }
}
