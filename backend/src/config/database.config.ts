import { registerAs } from '@nestjs/config';

import type { DatabaseConfig } from './config.type';

export default registerAs<DatabaseConfig>('database', () => ({
  dialect: process.env.DATABASE_DIALECT,
  host: process.env.DATABASE_HOST,
  port: process.env.DATABASE_PORT
    ? Number.parseInt(process.env.DATABASE_PORT, 10)
    : 5432, //default port for postgres
  password: process.env.DATABASE_PASSWORD,
  name: process.env.DATABASE_NAME,
  username: process.env.DATABASE_USERNAME,
  synchronize: process.env.DATABASE_SYNCHRONIZE === 'true',
  logging: process.env.NODE_ENVIRONMENT === 'production' ? false : true,
}));
