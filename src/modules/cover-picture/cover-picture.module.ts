import { Module } from '@nestjs/common';
import { CoverPictureService } from './services/cover-picture.service';
import { CoverPictureController } from './controllers/cover-picture.controller';
import { MulterModule } from '@nestjs/platform-express';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CoverPicture } from './entities/cover-picture.entity';
import { Profile } from '../profile/entities/profile.entity';

@Module({
  imports: [
    MulterModule.register({ dest: './uploads/pending-pictures' }),
    TypeOrmModule.forFeature([CoverPicture, Profile]),
  ],
  providers: [CoverPictureService],
  controllers: [CoverPictureController],
})
export class CoverPictureModule {}
