import { Module } from '@nestjs/common';
import { SettingService } from './services/setting.service';
import { SettingController } from './controllers/setting.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Setting } from './entities/setting.entity';
import { User } from '../auth/entities/user.entity';
import { JwtService } from '@nestjs/jwt';
import { Utils } from 'src/utils/utils';
import { RedisService } from '../redis/redis.service';

@Module({
  imports: [TypeOrmModule.forFeature([Setting, User])],
  providers: [SettingService, JwtService, Utils, RedisService],
  controllers: [SettingController],
})
export class SettingModule {}
