import { Module } from '@nestjs/common';
import { PhoneService } from './services/phone.service';
import { PhoneController } from './controllers/phone.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { JwtStrategy } from '../auth/strategies/jwt.strategy';
import { Utils } from 'src/utils/utils';
import { RedisService } from '../redis/redis.service';
import { Phone } from './entities/phone.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Phone])],
  providers: [PhoneService, JwtStrategy, Utils, RedisService],
  controllers: [PhoneController],
})
export class PhoneModule {}
