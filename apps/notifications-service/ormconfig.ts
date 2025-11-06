import 'reflect-metadata';
import { DataSource } from 'typeorm';

export default new DataSource({
  type: 'postgres',
  host: 'localhost',
  port: 5432,
  username: 'postgres',
  password: 'pablo123',
  database: 'challenge_db',
  entities: [],
  migrations: ['./src/migrations/*.ts'],
  migrationsTableName: 'migrations',
  synchronize: true,
  logging: true,
});
