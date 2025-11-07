import {
  WebSocketGateway,
  WebSocketServer,
  OnGatewayConnection,
  OnGatewayDisconnect,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { Logger } from '@nestjs/common';
import { NotificationsService } from './notifications.service';

@WebSocketGateway(3005, {
  cors: {
    origin: 'http://localhost:3000',
    credentials: true,
  },
})
export class NotificationsGateway
  implements OnGatewayConnection, OnGatewayDisconnect
{
  @WebSocketServer()
  server: Server;

  private logger = new Logger('NotificationsGateway');
  private userSockets = new Map<string, string>();

  constructor(private notificationsService: NotificationsService) {}

  // Quando cliente conecta, envia notificações recentes
  async handleConnection(client: Socket) {
    this.logger.log(`Cliente conectado: ${client.id}`);

    const userId = client.handshake.query.userId as string;

    if (userId) {
      this.userSockets.set(userId, client.id);
      this.logger.log(`Usuário ${userId} mapeado para socket ${client.id}`);

      // Envia as notificações das últimas 24h ao conectar
      const recentNotifications =
        await this.notificationsService.findRecent(userId);

      if (recentNotifications.length > 0) {
        client.emit('notifications:history', {
          notifications: recentNotifications,
          count: recentNotifications.length,
        });
        this.logger.log(
          `Enviadas ${recentNotifications.length} notificações recentes para ${userId}`,
        );
      }
    } else {
      this.logger.warn(`Cliente ${client.id} conectou sem userId`);
    }
  }

  handleDisconnect(client: Socket) {
    this.logger.log(`Cliente desconectado: ${client.id}`);

    for (const [userId, socketId] of this.userSockets.entries()) {
      if (socketId === client.id) {
        this.userSockets.delete(userId);
        this.logger.log(`Usuário ${userId} removido do mapa`);
        break;
      }
    }
  }

  // Envia notificação real-time para usuário específico
  sendToUser(userId: string, event: string, data: any) {
    const socketId = this.userSockets.get(userId);

    if (socketId) {
      this.server.to(socketId).emit(event, data);
      this.logger.log(`Notificação enviada para ${userId} (evento: ${event})`);
    } else {
      this.logger.warn(
        `Usuário ${userId} offline. Notificação salva no banco.`,
      );
    }
  }
}
