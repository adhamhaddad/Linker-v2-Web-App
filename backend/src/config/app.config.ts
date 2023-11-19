import { registerAs } from '@nestjs/config';

import type { AppConfig } from './config.type';

export default registerAs<AppConfig>('app', () => ({
  nodeEnv: process.env.NODE_ENV || 'development',
  name: process.env.APP_NAME || 'app',
  backendDomain: process.env.BACKEND_DOMAIN ?? 'http://localhost',
  port: process.env.NODE_SERVICE_PORT
    ? parseInt(process.env.NODE_SERVICE_PORT, 10)
    : process.env.NODE_SERVICE_PORT
    ? parseInt(process.env.NODE_SERVICE_PORT, 10)
    : 3000,
  apiPrefix: process.env.API_PREFIX || 'api/v1',
  throttle: {
    ttl: process.env.THROTTLE_TTL,
    limit: process.env.THROTTLE_LIMIT,
  },
}));
