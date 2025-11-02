import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { TasksController } from './tasks.controller';

@Module({
  imports: [
    // Conecta com o microserviço de Tasks via RabbitMQ
    ClientsModule.registerAsync([
      {
        name: 'TASKS_SERVICE',
        imports: [ConfigModule],
        inject: [ConfigService],
        useFactory: (config: ConfigService) => ({
          transport: Transport.RMQ,
          options: {
            urls: [config.get<string>('RABBITMQ_URL')!],
            queue: 'tasks_queue',
            queueOptions: {
              durable: false,
            },
          },
        }),
      },
    ]),
  ],
  controllers: [TasksController],
})
export class TasksModule {}
