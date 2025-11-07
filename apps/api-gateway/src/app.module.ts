import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { ThrottlerGuard, ThrottlerModule } from '@nestjs/throttler';

import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './auth/auth.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '.env.example',
    }),

    // Rate limit: máximo de 10 requisições por segundo
    ThrottlerModule.forRoot([{ ttl: 1000, limit: 10 }]),

    AuthModule,
  ],
  controllers: [AppController],
  providers: [
    AppService,
    {
      provide: 'APP_GUARD',
      useClass: ThrottlerGuard,
    },
  ],
})
export class AppModule {}
