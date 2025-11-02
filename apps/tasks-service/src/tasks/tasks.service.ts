import { Inject, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { FindOptionsWhere, Like, Repository } from 'typeorm';

import { Task } from './entity/tasks.entity';
import { PaginationQueryDto } from './dto/pagination-query.dto';
import { FilterTasksDto } from './dto/filter-tasks.dto';
import { CreateTaskDto } from './dto/create-task.dto';
import { HistoryAction, TaskHistory } from './entity/task-history.entity';
import { ClientProxy } from '@nestjs/microservices';

@Injectable()
export class TasksService {
  constructor(
    @InjectRepository(Task)
    private taskRepository: Repository<Task>,

    @InjectRepository(TaskHistory)
    private historyRepository: Repository<TaskHistory>,

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
