import {
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Inject,
  Query,
  UseGuards,
  ValidationPipe,
} from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import {
  ApiBearerAuth,
  ApiOperation,
  ApiQuery,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { firstValueFrom } from 'rxjs';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { ListTasksQueryDto } from './dto/lists-tasks-query.dto';
import { PaginatedTasksResponseDto } from './dto/paginated-tasks-response.dto';

@ApiTags('Tasks')
@Controller('tasks')
@UseGuards(JwtAuthGuard)
@ApiBearerAuth()
@Controller('tasks')
export class TasksController {
  constructor(@Inject('TASKS_SERVICE') private tasksClient: ClientProxy) {}

  // GET /api/tasks
  // Busca todas as tarefas com filtros e paginação
  @Get()
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Lista todas as tarefas' })
  @ApiQuery({
    name: 'page',
    required: false,
    type: Number,
    example: 1,
  })
  @ApiQuery({
    name: 'size',
    required: false,
    type: Number,
    example: 10,
  })
  @ApiQuery({
    name: 'status',
    required: false,
    enum: ['TODO', 'IN_PROGRESS', 'REVIEW', 'DONE'],
  })
  @ApiQuery({
    name: 'priority',
    required: false,
    enum: ['LOW', 'MEDIUM', 'HIGH', 'URGENT'],
  })
  @ApiQuery({
    name: 'assignedTo',
    required: false,
    type: String,
  })
  @ApiQuery({
    name: 'search',
    required: false,
    type: String,
  })
  @ApiResponse({
    status: 200,
    description: 'Lista de tarefas retornada com sucesso',
  })
  async findAll(
    @Query(ValidationPipe) query: ListTasksQueryDto,
  ): Promise<PaginatedTasksResponseDto> {
    const { page, size, ...filters } = query;

    return await firstValueFrom(
      this.tasksClient.send('tasks.findAll', {
        pagination: { page, size },
        filters,
      }),
    );
  }
}
