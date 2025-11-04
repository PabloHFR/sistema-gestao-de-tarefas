import { NestFactory } from '@nestjs/core';
import { MicroserviceOptions, Transport } from '@nestjs/microservices';
import { ConfigService } from '@nestjs/config';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  const configService = app.get(ConfigService);
  const rabbitUrl = configService.get<string>('RABBITMQ_URL');

  if (!rabbitUrl) {
    throw new Error('Missing env variable RABBITMQ_URL');
  }

  // Conecta como microserviço RabbitMQ (para consumir eventos)
  app.connectMicroservice<MicroserviceOptions>({
    transport: Transport.RMQ,
    options: {
      urls: [rabbitUrl],
      queue: 'events_queue', // Fila onde Tasks Service publica eventos
      queueOptions: {
        durable: false,
      },
      // Configuração para controle manual de ack
      noAck: false,
      // Prefetch: processa 1 mensagem por vez (evita sobrecarga)
      prefetchCount: 1,
    },
  });

  // Inicia todos os serviços
  await app.startAllMicroservices();

  const port = configService.get<number>('PORT', 3004);
  await app.listen(port);

  console.log(
    'Notifications microservice is listening on events_queue at port: ' + port,
  );
}

bootstrap();
