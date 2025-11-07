import {
  ForbiddenException,
  Inject,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { FindOptionsWhere, Like, Repository } from 'typeorm';
import { HistoryAction } from '@monorepo/types';

import { Task } from './entity/tasks.entity';
import { PaginationQueryDto } from './dto/pagination-query.dto';
import { FilterTasksDto } from './dto/filter-tasks.dto';
import { CreateTaskDto } from './dto/create-task.dto';
import { TaskHistory } from './entity/task-history.entity';
import { ClientProxy } from '@nestjs/microservices';
import { UpdateTaskDto } from './dto/update-task.dto';
import { Comment } from './entity/comment.entity';
import { CreateCommentDto } from './dto/create-comment.dto';

@Injectable()
export class TasksService {
  constructor(
    @InjectRepository(Task)
    private taskRepository: Repository<Task>,

    @InjectRepository(TaskHistory)
    private historyRepository: Repository<TaskHistory>,

    @InjectRepository(Comment)
    private commentRepository: Repository<Comment>,

    // Cliente RabbitMQ para publicar eventos
    @Inject('EVENTS_SERVICE')
    private eventsClient: ClientProxy,
  ) {}

  // Lista todas as tarefas com paginação e filtros
  async findAll(pagination: PaginationQueryDto, filters: FilterTasksDto) {
    const { page = 1, size = 10 } = pagination;
    const { status, priority, assignedTo, search } = filters;

    // Constrói filtros dinâmicos
    const where: FindOptionsWhere<Task> = {};

    if (status) where.status = status;
    if (priority) where.priority = priority;

    // Busca por título ou descrição
    if (search) {
      const queryBuilder = this.taskRepository
        .createQueryBuilder('task')
        .where('task.title ILIKE :search OR task.description ILIKE :search', {
          search: `%${search}`,
        });

      if (status) queryBuilder.andWhere('task.status = :status', { status });
      if (priority)
        queryBuilder.andWhere('task.priority = :priority', { priority });
      if (assignedTo) {
        queryBuilder.andWhere('task.assignedTo LIKE :assignedTo', {
          assignedTo: `%${assignedTo}`,
        });
      }

      const [items, total] = await queryBuilder
        .skip((page - 1) * size)
        .take(size)
        .orderBy('task.createdAt', 'DESC')
        .getManyAndCount();

      return { items, total, page, size, totalPages: Math.ceil(total / size) };
    }

    // Filtro por usuário atribuído (busca no array)
    if (assignedTo) {
      where.assignedTo = Like(`%${assignedTo}`);
    }

    // Query com paginação
    const [items, total] = await this.taskRepository.findAndCount({
      where,
      skip: (page - 1) * size,
      take: size,
      order: { createdAt: 'DESC' },
    });

    return {
      items,
      total,
      page,
      size,
      totalPages: Math.ceil(total / size),
    };
  }

  // Lista uma tarefa específica
  async findOne(id: string) {
    const task = await this.taskRepository.findOne({
      where: {
        id,
      },
      relations: ['comments', 'history'], // Carrega relacionamentos
    });

    if (!task) {
      return null;
    }

    return task;
  }

  // Cria uma nova tarefa
  async create(
    createTaskDto: CreateTaskDto,
    user: { userId: string; username: string },
  ) {
    // Cria a entidade
    const task = this.taskRepository.create({
      ...createTaskDto,
      createdBy: user.userId,
      assignedTo: createTaskDto.assignedTo || [],
    });

    // Salva no banco
    await this.taskRepository.save(task);

    // Registra no histórico
    await this.createHistory({
      taskId: task.id,
      action: HistoryAction.CREATED,
      userId: user.userId,
      username: user.username,
      newValue: JSON.stringify(task),
    });

    // Publica evento para o broker (notification-service vai consumir)
    this.eventsClient.emit('task.created', {
      taskId: task.id,
      title: task.title,
      createdBy: user.userId,
      assignedTo: task.assignedTo,
      timestamp: new Date().toISOString(),
    });

    return task;
  }

  // Atualiza uma tarefa existente
  async update(
    id: string,
    updateTaskDto: UpdateTaskDto,
    user: {
      userId: string;
      username: string;
    },
  ) {
    const task = await this.findOne(id);

    if (!task) {
      throw new NotFoundException('Tarefa não encontrada');
    }

    // Verifica permissão (apenas criador pode editar)
    if (task.createdBy !== user.userId) {
      throw new ForbiddenException(
        'Você não tem permissão para editar esta tarefa',
      );
    }

    // Captura valores antigos apra histórico
    const oldValues: Record<string, any> = {};
    Object.keys(updateTaskDto).forEach((key) => {
      oldValues[key] = task[key as keyof Task];
    });

    // Atualiza campos
    Object.assign(task, updateTaskDto);
    await this.taskRepository.save(task);

    // Registro de alterações no histórico
    for (const [field, newValue] of Object.entries(updateTaskDto)) {
      if (oldValues[field] !== newValue) {
        await this.createHistory({
          taskId: task.id,
          action:
            field === 'status'
              ? HistoryAction.STATUS_CHANGED
              : HistoryAction.UPDATED,
          userId: user.userId,
          username: user.username,
          field,
          oldValue: JSON.stringify(oldValues[field]),
          newValue: JSON.stringify(newValue),
        });
      }
    }

    // Publica evento
    this.eventsClient.emit('task.updated', {
      taskId: task.id,
      title: task.title,
      updatedBy: user.userId,
      changes: updateTaskDto,
      assignedTo: task.assignedTo,
      timestamp: new Date().toISOString(),
    });

    return task;
  }

  // Deleta uma tarefa
  async delete(id: string, userId: string) {
    const task = await this.findOne(id);

    if (!task) {
      throw new NotFoundException('Tarefa não encontrada');
    }

    // Apenas criador pode deletar
    if (task.createdBy !== userId) {
      throw new ForbiddenException(
        'Você não tem permissão para deletar esta tarefa',
      );
    }

    await this.taskRepository.remove(task);

    return { message: 'Tarefa deletada com sucesso' };
  }

  // Lista comentários de uma tarefa (com paginação)
  async findComments(taskId: string, pagination: PaginationQueryDto) {
    const { page = 1, size = 10 } = pagination;

    // Verifica se task existe
    await this.findOne(taskId);

    const [items, total] = await this.commentRepository.findAndCount({
      where: { taskId },
      skip: (page - 1) * size,
      take: size,
      order: { createdAt: 'DESC' },
    });

    return {
      items,
      total,
      page,
      size,
      totalPages: Math.ceil(total / size),
    };
  }

  // Cria comentário
  async createComment(
    taskId: string,
    createCommentDto: CreateCommentDto,
    user: { userId: string; username: string },
  ) {
    // Verifica se task existe
    const task = await this.findOne(taskId);

    if (!task) {
      throw new NotFoundException('Tarefa não encontrada');
    }

    // Cria comentário
    const comment = this.commentRepository.create({
      ...createCommentDto,
      taskId,
      authorId: user.userId,
      authorName: user.username,
    });

    await this.commentRepository.save(comment);

    // Registra no histórico
    await this.createHistory({
      taskId,
      action: HistoryAction.COMMENTED,
      userId: user.userId,
      username: user.username,
      newValue: createCommentDto.content,
    });

    // Publica evento
    this.eventsClient.emit('task.comment.created', {
      taskId,
      commentId: comment.id,
      authorId: user.userId,
      authorName: user.username,
      content: comment.content,
      assignedTo: task.assignedTo,
      timestamp: new Date().toISOString(),
    });

    return comment;
  }

  // Cria registro de histórico
  private async createHistory(data: {
    taskId: string;
    action: HistoryAction;
    userId: string;
    username: string;
    field?: string;
    oldValue?: string;
    newValue: string;
  }) {
    const history = this.historyRepository.create(data);
    await this.historyRepository.save(history);
  }
}
