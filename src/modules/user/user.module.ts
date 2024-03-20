import { Module } from '@nestjs/common';
import { UserController } from './controllers/user.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { UserService } from './services/user.service';
import { Utils } from 'src/utils/utils';
import { RedisService } from '../redis/redis.service';
import { JwtStrategy } from '../auth/strategies/jwt.strategy';

@Module({
  imports: [TypeOrmModule.forFeature([User])],
  providers: [UserService, JwtStrategy, Utils, RedisService],
  controllers: [UserController],
  exports: [UserService],
})
export class UserModule {}
