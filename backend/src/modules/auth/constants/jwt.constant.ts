import { config } from 'dotenv';

config();

export const jwtConstants = {
  secret: process.env.JWT_AUTH,
  expires: process.env.JWT_TIMEOUT,
};
