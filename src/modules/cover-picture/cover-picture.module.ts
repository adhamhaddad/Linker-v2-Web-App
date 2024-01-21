import { Module } from '@nestjs/common';
import { CoverPictureService } from './services/cover-picture.service';
import { CoverPictureController } from './controllers/cover-picture.controller';
import { MulterModule } from '@nestjs/platform-express';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CoverPicture } from './entities/cover-picture.entity';
import { User } from '../auth/entities/user.entity';
import { JwtStrategy } from '../auth/strategies/jwt.strategy';
import { Utils } from 'src/utils/utils';
import { RedisService } from '../redis/redis.service';

@Module({
  imports: [
    MulterModule.register({
      dest: './uploads/pending-pictures',
    }),
    TypeOrmModule.forFeature([CoverPicture, User]),
  ],
  providers: [CoverPictureService, JwtStrategy, Utils, RedisService],
  controllers: [CoverPictureController],
})
export class CoverPictureModule {}