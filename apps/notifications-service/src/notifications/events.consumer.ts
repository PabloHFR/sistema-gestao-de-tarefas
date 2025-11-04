import { Controller } from '@nestjs/common';
import { EventPattern, Payload, Ctx, RmqContext } from '@nestjs/microservices';
import { NotificationsService } from './notifications.service';
import { NotificationType } from './entities/notification.entity';
import { NotificationsGateway } from './notifications.gateway';

@Controller()
export class EventsConsumer {
  constructor(
    private notificationsService: NotificationsService,
    private notificationsGateway: NotificationsGateway,
  ) {}

  // Evento: task.created
  // Notifica usuários atribuídos que uma nova tarefa foi criada
  @EventPattern('task.created')
  async handleTaskCreated(
    @Payload()
    data: {
      taskId: string;
      title: string;
      createdBy: string;
      assignedTo: string[];
      timestamp: string;
    },
    @Ctx() context: RmqContext,
  ) {
    console.log('Evento recebido: task.created', data);

    const { taskId, title, createdBy, assignedTo } = data;

    // Se tem usuários atribuídos, notifica eles
    if (assignedTo && assignedTo.length > 0) {
      const notifications = await this.notificationsService.createBulk(
        assignedTo,
        {
          type: NotificationType.TASK_ASSIGNED,
          title: 'Nova tarefa atribuída',
          message: `Você foi atribuído à tarefa "${title}"`,
          metadata: {
            taskId,
            taskTitle: title,
            createdBy,
          },
        },
      );

      // Envia via WebSocket para cada usuário conectado
      for (const notification of notifications) {
        this.notificationsGateway.sendToUser(
          notification.userId,
          'task:created',
          notification,
        );
      }
    }

    // Acknowledges a mensagem (remove da fila)
    const channel = context.getChannelRef();
    const originalMsg = context.getMessage();
    channel.ack(originalMsg);
  }

  // Evento: task.updated
  // Notifica usuários atribuídos que a tarefa foi atualizada
  @EventPattern('task.updated')
  async handleTaskUpdated(
    @Payload()
    data: {
      taskId: string;
      title: string;
      updatedBy: string;
      changes: Record<string, any>;
      assignedTo: string[];
      timestamp: string;
    },
    @Ctx() context: RmqContext,
  ) {
    console.log('Evento recebido: task.updated', data);

    const { taskId, title, updatedBy, changes, assignedTo } = data;

    // Notifica usuários atribuídos (exceto quem fez a mudança)
    const usersToNotify = assignedTo.filter((id) => id !== updatedBy);

    if (usersToNotify.length > 0) {
      // Monta mensagem baseada nas mudanças
      let message = `A tarefa "${title}" foi atualizada`;
      if (changes.status) {
        message = `Status da tarefa "${title}" mudou para ${changes.status}`;
      }

      const notifications = await this.notificationsService.createBulk(
        usersToNotify,
        {
          type: changes.status
            ? NotificationType.TASK_STATUS_CHANGED
            : NotificationType.TASK_UPDATED,
          title: 'Tarefa atualizada',
          message,
          metadata: {
            taskId,
            taskTitle: title,
            updatedBy,
            changes,
          },
        },
      );

      // Envia via WebSocket
      for (const notification of notifications) {
        this.notificationsGateway.sendToUser(
          notification.userId,
          'task:updated',
          notification,
        );
      }
    }

    const channel = context.getChannelRef();
    const originalMsg = context.getMessage();
    channel.ack(originalMsg);
  }

  // Evento: task.comment.created
  // Notifica usuários atribuídos que há um novo comentário
  @EventPattern('task.comment.created')
  async handleCommentCreated(
    @Payload()
    data: {
      taskId: string;
      commentId: string;
      authorId: string;
      authorName: string;
      content: string;
      assignedTo: string[];
      timestamp: string;
    },
    @Ctx() context: RmqContext,
  ) {
    console.log('Evento recebido: task.comment.created', data);

    const { taskId, authorId, authorName, content, assignedTo } = data;

    // Notifica usuários atribuídos (exceto o autor do comentário)
    const usersToNotify = assignedTo.filter((id) => id !== authorId);

    if (usersToNotify.length > 0) {
      const notifications = await this.notificationsService.createBulk(
        usersToNotify,
        {
          type: NotificationType.COMMENT_CREATED,
          title: 'Novo comentário',
          message: `${authorName} comentou: "${content.substring(0, 100)}${content.length > 100 ? '...' : ''}"`,
          metadata: {
            taskId,
            authorId,
            authorName,
          },
        },
      );

      // Envia via WebSocket
      for (const notification of notifications) {
        this.notificationsGateway.sendToUser(
          notification.userId,
          'comment:new',
          notification,
        );
      }
    }

    const channel = context.getChannelRef();
    const originalMsg = context.getMessage();
    channel.ack(originalMsg);
  }
}
