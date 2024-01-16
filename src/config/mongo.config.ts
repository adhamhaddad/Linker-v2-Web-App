import { registerAs } from '@nestjs/config';
import type { MongoConfig } from './config.type';

export default registerAs<MongoConfig>('mongo', () => ({
  uri: process.env.MONGO_URI,
}));
