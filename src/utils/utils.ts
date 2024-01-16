import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { RedisService } from 'src/modules/redis/redis.service';

@Injectable()
export class Utils {
  constructor(
    private readonly configService: ConfigService,
    private readonly redisService: RedisService,
  ) {}

  async redisSetValue(key: string, value: string): Promise<void> {
    const redisClient = this.redisService.getRedisClient();
    await redisClient.set(key, value);
  }

  async redisSetValueDuration(
    key: string,
    value: string,
    duration: number,
  ): Promise<void> {
    const redisClient = this.redisService.getRedisClient();
    const exists = await redisClient.exists(key);
    if (!exists) {
      await redisClient.setex(key, duration, value);
    }
  }

  async redisGetValue(key: string): Promise<string | null> {
    const redisClient = this.redisService.getRedisClient();
    return await redisClient.get(key);
  }

  redisRemoveValue(key: string) {
    const redisClient = this.redisService.getRedisClient();
    redisClient.del(key);
  }

  redisCloseConnection() {
    this.redisService.closeRedisClient();
  }

  async sendOtpMessage(email: string, source: string): Promise<any> {
    try {
      const otp = this.generateOTP();
      const key = `${email}-${source}`;
      const otpRedisValue = await this.redisGetValue(key);

      if (otpRedisValue) {
        this.redisRemoveValue(key);
      }

      await this.redisSetValueDuration(
        key,
        JSON.stringify({ otp }),
        this.configService.get('nodeEnv') === 'development'
          ? // dev env
            source === 'reset-password'
            ? 240 // 4 minutes for reset password
            : 120 // 2 minutes for other sources
          : // prod env
          source === 'reset-password'
          ? 120 // 2 minutes for reset password
          : 60, // 1 minute for other sources
      );
      return otp;
    } catch (error) {
      console.error(error);
      throw error;
    }
  }

  async verifyOTP(key: string, otp: string, remove = true): Promise<any> {
    const otpRedisValue = await this.redisGetValue(key);

    if (otpRedisValue && otp === JSON.parse(otpRedisValue).otp) {
      remove && this.redisRemoveValue(key);
      return JSON.parse(otpRedisValue);
    }
    return null;
  }

  async checkPasswordVerificationStatus(phone: string): Promise<any> {
    const key = `${phone}-loginOtpPasswordVerified`;
    const otpRedisValue = await this.redisGetValue(key);
    if (otpRedisValue) {
      this.redisRemoveValue(key);
      return otpRedisValue === '1';
    }
    return false;
  }

  generateOTP(): string {
    return Math.floor(1000 + Math.random() * 9000).toString();
  }

  async saveUserDetailsRedis(user: any, userId: number) {
    const key = `user_${userId}`;
    const userData = await this.redisSetValue(key, JSON.stringify(user));
    return userData;
  }

  async getUserDetailsRedis(userId: number) {
    const key = `user_${userId}`;
    const user = await this.redisGetValue(key);
    return JSON.parse(user);
  }

  async removeUserDetailsRedis(userId: number) {
    const key = `user_${userId}`;
    const user = await this.redisRemoveValue(key);
    return user;
  }

  formatPhoneNumber(phone: string): string {
    if (!phone.startsWith('+20') && !phone.startsWith('20')) {
      phone = '+20' + phone;
    } else if (phone.startsWith('20')) {
      phone = '+' + phone;
    }
    return phone;
  }
}
