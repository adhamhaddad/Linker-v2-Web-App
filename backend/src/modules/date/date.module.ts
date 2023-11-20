import { Module } from '@nestjs/common';
import { DateService } from './services/date.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CustomDate } from './entities/date.entity';
import { JwtStrategy } from '../auth/strategies/jwt.strategy';
import { Utils } from 'src/utils/utils';
import { RedisService } from '../redis/redis.service';

@Module({
  imports: [TypeOrmModule.forFeature([CustomDate])],
  providers: [DateService, JwtStrategy, Utils, RedisService],
})
export class DateModule {}
