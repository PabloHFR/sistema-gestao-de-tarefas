/* eslint-disable prettier/prettier */
import { DataSource } from 'typeorm';
import { config } from 'dotenv';

config({ path: '.env.example' });

export default new DataSource({
  type: 'postgres',
  url: process.env.DATABASE_URL,
  entities: ['src/**/*.entity.ts'],
  migrations: ['src/migrations/*.ts'],
  synchronize: true,
  logging: true,
});
