import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // Habilita CORS
  app.enableCors();

  // Define o prefixo global
  app.setGlobalPrefix('api');

  // Habilita validação global com class-validator
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true, // Remove propriedades não definidas no DTO
      forbidNonWhitelisted: true, // Retorna erro se enviar propriedades extras
      transform: true, // Transforma payloads em instâncias do DTO
    }),
  );

  // Configuração do Swagger
  const config = new DocumentBuilder()
    .setTitle('Sistema de Gerenciamento de Tarefas')
    .setDescription('API para o Sistema de Gerenciamento de Tarefas')
    .setVersion('1.0')
    .addBearerAuth()
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api/docs', app, document);

  const port = process.env.PORT || 3001;

  await app.listen(port);

  console.log(`API Gateway rodando na porta ${port}`);
  console.log(`Swagger disponível em http://localhost:${port}/api/docs`);
}
bootstrap();
