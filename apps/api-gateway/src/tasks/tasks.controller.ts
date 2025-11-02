import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Inject,
  NotFoundException,
  Param,
  Post,
  Patch,
  Query,
  Req,
  UseGuards,
  ValidationPipe,
  Delete,
} from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import {
  ApiBearerAuth,
  ApiOperation,
  ApiParam,
  ApiQuery,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { firstValueFrom } from 'rxjs';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { ListTasksQueryDto } from './dto/lists-tasks-query.dto';
import { PaginatedTasksResponseDto } from './dto/paginated-tasks-response.dto';
import { TaskResponseDto } from './dto/task-response.dto';
import { CreateTaskDto } from './dto/create-task.dto';
import { CreateTaskResponseDto } from './dto/create-task-response.dto';
import { UpdateTaskDto } from './dto/update-task.dto';
import { CommentsQueryDto } from './dto/comments-query.dto';
import { CommentResponseDto } from './dto/comment-response.dto';
import { CreateCommentDto } from './dto/create-comment.dto';

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

  // GET /api/tasks/:id
  // Busca uma tarefa específica
  @Get(':id')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Busca uma tarefa por ID' })
  @ApiParam({ name: 'id', type: String, description: 'UUID da tarefa' })
  @ApiResponse({
    status: 200,
    description: 'Tarefa encontrada',
  })
  @ApiResponse({
    status: 404,
    description: 'Tarefa não encontrada',
  })
  async findOne(@Param('id') id: string) {
    const task = await firstValueFrom<TaskResponseDto>(
      this.tasksClient.send('tasks.findOne', { id }),
    );

    if (!task) throw new NotFoundException('Tarefa não encontrada');

    return task;
  }

  // POST /api/tasks
  // Cria uma nova tarefa
  @Post()
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({ summary: 'Cria uma nova tarefa' })
  @ApiResponse({
    status: 201,
    description: 'Tarefa criada com sucesso',
  })
  @ApiResponse({
    status: 400,
    description: 'Dados inválidos',
  })
  async create(
    @Body(ValidationPipe) createTaskDto: CreateTaskDto,
    @Req() req: { user: { userId: string; username: string } },
  ) {
    return await firstValueFrom(
      this.tasksClient.send<CreateTaskResponseDto>('tasks.create', {
        createTaskDto,
        user: req.user,
      }),
    );
  }

  // PATCH /api/tasks/:id
  // Atualiza uma tarefa
  @Patch(':id')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Atualiza uma tarefa' })
  @ApiParam({ name: 'id', type: String, description: 'UUID da tarefa' })
  @ApiResponse({
    status: 200,
    description: 'Tarefa atualizada com sucesso',
  })
  @ApiResponse({
    status: 403,
    description: 'Sem permissão para editar esta tarefa',
  })
  @ApiResponse({
    status: 404,
    description: 'Tarefa não encontrada',
  })
  async update(
    @Param('id') id: string,
    @Body(ValidationPipe) updateTaskDto: UpdateTaskDto,
    @Req() req: { user: { userId: string; username: string } },
  ) {
    return await firstValueFrom<TaskResponseDto>(
      this.tasksClient.send('tasks.update', {
        id,
        updateTaskDto,
        user: req.user,
      }),
    );
  }

  // DELETE /api/tasks/:id
  // Deleta uma tarefa
  @Delete(':id')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Deleta uma tarefa' })
  @ApiParam({ name: 'id', type: String, description: 'UUID da tarefa' })
  @ApiResponse({
    status: 200,
    description: 'Tarefa deletada com sucesso',
  })
  @ApiResponse({
    status: 403,
    description: 'Sem permissão para deletar esta tarefa',
  })
  @ApiResponse({
    status: 404,
    description: 'Tarefa não encontrada',
  })
  async delete(
    @Param('id') id: string,
    @Req() req: { user: { userId: string } },
  ) {
    return await firstValueFrom<{ message: string }>(
      this.tasksClient.send('tasks.delete', {
        id,
        userId: req.user.userId,
      }),
    );
  }

  // GET /api/tasks/:id/comments
  // Lista comentários de uma tarefa
  @Get(':id/comments')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Lista comentários de uma tarefa' })
  @ApiParam({ name: 'id', type: String, description: 'UUID da tarefa' })
  @ApiQuery({ name: 'page', required: false, type: Number, example: 1 })
  @ApiQuery({ name: 'size', required: false, type: Number, example: 10 })
  @ApiResponse({
    status: 200,
    description: 'Lista de comentários retornada com sucesso',
  })
  @ApiResponse({
    status: 404,
    description: 'Tarefa não encontrada',
  })
  async findComments(
    @Param('id') taskId: string,
    @Query(ValidationPipe) pagination: CommentsQueryDto,
  ) {
    return await firstValueFrom<CommentResponseDto>(
      this.tasksClient.send('tasks.comments.findAll', {
        taskId,
        pagination,
      }),
    );
  }

  @Post(':id/comments')
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({ summary: 'Cria um comentário em uma tarefa' })
  @ApiParam({ name: 'id', type: String, description: 'UUID da tarefa' })
  @ApiResponse({
    status: 201,
    description: 'Comentário criado com sucesso',
  })
  @ApiResponse({
    status: 404,
    description: 'Tarefa não encontrada',
  })
  async createComment(
    @Param('id') taskId: string,
    @Body(ValidationPipe) createCommentDto: CreateCommentDto,
    @Req() req: { user: { userId: string; username: string } },
  ) {
    return await firstValueFrom<CommentResponseDto>(
      this.tasksClient.send('tasks.comments.create', {
        taskId,
        createCommentDto,
        user: req.user,
      }),
    );
  }
}
