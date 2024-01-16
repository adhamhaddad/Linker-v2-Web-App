import { Module } from '@nestjs/common';
import { JobService } from './services/job.service';
import { JobController } from './controllers/job.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Job } from './entities/job.entity';
import { JwtService } from '@nestjs/jwt';
import { Utils } from 'src/utils/utils';
import { RedisService } from '../redis/redis.service';
import { User } from '../auth/entities/user.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Job, User])],
  providers: [JobService, JwtService, Utils, RedisService],
  controllers: [JobController],
})
export class JobModule {}