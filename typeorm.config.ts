import { DataSource } from 'typeorm';
import { typeOrmConfig } from './src/config/typeorm.config';
import * as dotenv from 'dotenv';
import * as path from 'path';

const env = process.env.NODE_ENV || 'development';
dotenv.config({ path: path.join(process.cwd(), 'env', `.env.${env}`) });

export default new DataSource({
  ...typeOrmConfig,
  entities: ['src/**/*.entity.ts'],
  migrations: ['src/database/migrations/*.ts'],
} as any);
