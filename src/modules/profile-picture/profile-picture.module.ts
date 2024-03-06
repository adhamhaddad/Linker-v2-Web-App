import { Module } from '@nestjs/common';
import { ProfilePictureService } from './services/profile-picture.service';
import { ProfilePictureController } from './controllers/profile-picture.controller';
import { MulterModule } from '@nestjs/platform-express';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ProfilePicture } from './entities/profile-picture.entity';
import { User } from '../user/entities/user.entity';
import { JwtStrategy } from '../auth/strategies/jwt.strategy';
import { Utils } from 'src/utils/utils';
import { RedisService } from '../redis/redis.service';
import { Profile } from '../profile/entities/profile.entity';

@Module({
  imports: [
    MulterModule.register({
      dest: './uploads/pending-pictures',
    }),
    TypeOrmModule.forFeature([ProfilePicture, User, Profile]),
  ],
  providers: [ProfilePictureService, JwtStrategy, Utils, RedisService],
  controllers: [ProfilePictureController],
})
export class ProfilePictureModule {}
