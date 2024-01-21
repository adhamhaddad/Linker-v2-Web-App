import { Module } from '@nestjs/common';
import { AddressService } from './services/address.service';
import { AddressController } from './controllers/address.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Address } from './entities/address.entity';
import { JwtStrategy } from '../auth/strategies/jwt.strategy';
import { Utils } from 'src/utils/utils';
import { RedisService } from '../redis/redis.service';
import { User } from '../auth/entities/user.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Address, User])],
  providers: [AddressService, JwtStrategy, Utils, RedisService],
  controllers: [AddressController],
})
export class AddressModule {}
