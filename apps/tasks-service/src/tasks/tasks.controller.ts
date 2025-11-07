import { Controller } from '@nestjs/common';
import { TasksService } from './tasks.service';
import { MessagePattern, Payload } from '@nestjs/microservices';
import { PaginationQueryDto } from './dto/pagination-query.dto';
import { FilterTasksDto } from './dto/filter-tasks.dto';
import { CreateTaskDto } from './dto/create-task.dto';
import { UpdateTaskDto } from './dto/update-task.dto';
import { CreateCommentDto } from './dto/create-comment.dto';

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

  // Lista uma tarefa específica
  @MessagePattern('tasks.findOne')
  async findOne(
    @Payload()
    payload: {
      id: string;
    },
  ) {
    return await this.tasksService.findOne(payload.id);
  }

  // Cria uma nova tarefa
  @MessagePattern('tasks.create')
  async create(
    @Payload()
    payload: {
      createTaskDto: CreateTaskDto;
      user: {
        userId: string;
        username: string;
      };
    },
  ) {
    return await this.tasksService.create(payload.createTaskDto, payload.user);
  }

  // Atualiza uma tarefa
  @MessagePattern('tasks.update')
  async update(
    @Payload()
    payload: {
      id: string;
      updateTaskDto: UpdateTaskDto;
      user: {
        userId: string;
        username: string;
      };
    },
  ) {
    return await this.tasksService.update(
      payload.id,
      payload.updateTaskDto,
      payload.user,
    );
  }

  // Deleta tarefa
  @MessagePattern('tasks.delete')
  async delete(
    @Payload()
    payload: {
      id: string;
      userId: string;
    },
  ) {
    return await this.tasksService.delete(payload.id, payload.userId);
  }

  // Lista comentários
  @MessagePattern('tasks.comments.findAll')
  async findComments(
    @Payload()
    payload: {
      taskId: string;
      pagination: PaginationQueryDto;
    },
  ) {
    return await this.tasksService.findComments(
      payload.taskId,
      payload.pagination,
    );
  }

  // Cria comentário
  @MessagePattern('tasks.comments.create')
  async createComment(
    @Payload()
    payload: {
      taskId: string;
      createCommentDto: CreateCommentDto;
      user: { userId: string; username: string };
    },
  ) {
    return await this.tasksService.createComment(
      payload.taskId,
      payload.createCommentDto,
      payload.user,
    );
  }
}
