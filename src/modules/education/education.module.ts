import { Module } from '@nestjs/common';
import { EducationService } from './services/education.service';
import { EducationController } from './controllers/education.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Education } from './entities/education.entity';
import { JwtService } from '@nestjs/jwt';
import { Utils } from 'src/utils/utils';
import { RedisService } from '../redis/redis.service';
import { User } from '../auth/entities/user.entity';
import { Profile } from '../profile/entities/profile.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Education, User, Profile])],
  providers: [EducationService, JwtService, Utils, RedisService],
  controllers: [EducationController],
})
export class EducationModule {}
