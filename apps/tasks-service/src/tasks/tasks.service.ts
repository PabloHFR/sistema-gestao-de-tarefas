import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { FindOptionsWhere, Like, Repository } from 'typeorm';

import { Task } from './entity/tasks.entity';
import { PaginationQueryDto } from './dto/pagination-query.dto';
import { FilterTasksDto } from './dto/filter-tasks.dto';

@Injectable()
export class TasksService {
  constructor(
    @InjectRepository(Task)
    private taskRepository: Repository<Task>,
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
}
