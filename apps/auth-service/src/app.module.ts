import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthModule } from './auth/auth.module';
import { DataSource } from 'typeorm';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '.env.example',
    }),
    TypeOrmModule.forRootAsync({
      useFactory: (config: ConfigService) => {
        return {
          type: 'postgres',
          url: config.get<string>('DATABASE_URL'),
          autoLoadEntities: true,
          entities: [],
          migrations: ['dist/migrations/*.js'],
          synchronize: false,
        };
      },
      inject: [ConfigService],
    }),
    AuthModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {
  constructor(private dataSource: DataSource) {}
}
