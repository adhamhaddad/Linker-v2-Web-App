import { Module } from '@nestjs/common';
import { AboutService } from './services/about.service';
import { AboutController } from './controllers/about.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { About } from './entities/about.entity';
import { Utils } from 'src/utils/utils';
import { JwtStrategy } from '../auth/strategies/jwt.strategy';
import { RedisService } from '../redis/redis.service';

@Module({
  imports: [TypeOrmModule.forFeature([About])],
  providers: [AboutService, JwtStrategy, Utils, RedisService],
  controllers: [AboutController],
})
export class AboutModule {}