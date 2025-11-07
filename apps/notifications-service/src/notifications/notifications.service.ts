import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, MoreThan } from 'typeorm';
import { Notification, NotificationType } from './entities/notification.entity';

@Injectable()
export class NotificationsService {
  constructor(
    @InjectRepository(Notification)
    private notificationRepository: Repository<Notification>,
  ) {}

  // Cria notificações em lote (para múltiplos usuários)
  async createBulk(
    userIds: string[],
    data: {
      type: NotificationType;
      title: string;
      message: string;
      metadata?: Record<string, any>;
    },
  ) {
    const notifications = userIds.map((userId) =>
      this.notificationRepository.create({
        userId,
        ...data,
      }),
    );

    return await this.notificationRepository.save(notifications);
  }

  // Busca notificações recentes de um usuário ao se conectar ao WS (últimas 24h)
  async findRecent(userId: string, hoursAgo: number = 24) {
    const since = new Date();
    since.setHours(since.getHours() - hoursAgo);

    return await this.notificationRepository.find({
      where: {
        userId,
        createdAt: MoreThan(since),
      },
      order: { createdAt: 'DESC' },
      take: 20, // Últimas 20 notificações
    });
  }
}
