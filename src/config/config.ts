export default () => ({
  encryptionKey: process.env.NODE_SERVICE_ENCRYPTION_KEY,
  encryptionSalt: process.env.NODE_SERVICE_ENCRYPTION_SALT,
  database: {
    dialect: process.env.DATABASE_DIALECT,
    host: process.env.DATABASE_HOST,
    port: process.env.DATABASE_PORT,
    username: process.env.DATABASE_USERNAME,
    password: process.env.DATABASE_PASSWORD,
    name: process.env.DATABASE_NAME,
    logging: process.env.MYSQL_DB_LOGGING === 'true',
    max: process.env.DATABASE_POOL_MAX,
    min: process.env.DATABASE_POOL_MIN,
    synchronize: process.env.DATABASE_SYNCHRONIZE,
  },
  mongo: {
    uri: process.env.MONGO_URI,
  },
  redis: {
    host: process.env.REDIS_HOST,
    port: process.env.REDIS_PORT,
  },
  JWT: {
    auth_token: process.env.JWT_AUTH,
    timeout: process.env.JWT_TIMEOUT,
  },
  EMAIL: {
    smtp_host: process.env.EMAIL_SMTP_HOST,
    senderEmail: process.env.EMAIL_SENDER_ADDRESS,
  },
  SEND_GRID_KEY: process.env.SEND_GRID_KEY,
  ENCRYPTION: {
    encryption_iv: process.env.ENCRYPTION_SECRET_KEY,
    encryption_key: process.env.ENCRYPTION_SECRET_IV_KEY,
    encryption_method: process.env.ENCRYPTION_SECRET_METHOD,
  },
});
