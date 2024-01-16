import { Module } from '@nestjs/common';
import { UserController } from './controllers/user.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from '../auth/entities/user.entity';
import { UserService } from './services/user.service';
import { Utils } from 'src/utils/utils';
import { RedisService } from '../redis/redis.service';
import { PasswordHash } from 'src/utils/password-hash';
import { JwtStrategy } from '../auth/strategies/jwt.strategy';

@Module({
  imports: [TypeOrmModule.forFeature([User])],
  providers: [UserService, JwtStrategy, Utils, RedisService, PasswordHash],
  controllers: [UserController],
})
export class UserModule {}
