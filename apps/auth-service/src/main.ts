import 'reflect-metadata';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { MicroserviceOptions, Transport } from '@nestjs/microservices';
import { ConfigService } from '@nestjs/config';

async function bootstrap() {
  const appContext = await NestFactory.createApplicationContext(AppModule);
  const configService = appContext.get(ConfigService);

  const rabbitUrl = configService.get<string>('RABBITMQ_URL');

  if (!rabbitUrl) {
    throw new Error('Missing env variable RABBITMQ_URL');
  }

  const app = await NestFactory.createMicroservice<MicroserviceOptions>(
    AppModule,
    {
      transport: Transport.RMQ,
      options: {
        urls: [rabbitUrl],
        queue: 'auth_queue',
        queueOptions: {
          durable: false,
        },
      },
    },
  );
  await app.listen();
  console.log('Debug - Auth microservice is listening - auth-service/main.ts');
}

bootstrap();
