import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
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
}
