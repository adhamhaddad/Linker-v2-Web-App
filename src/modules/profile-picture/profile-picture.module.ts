import { Module } from '@nestjs/common';
import { ProfilePictureService } from './services/profile-picture.service';
import { ProfilePictureController } from './controllers/profile-picture.controller';
import { MulterModule } from '@nestjs/platform-express';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ProfilePicture } from './entities/profile-picture.entity';
import { Profile } from '../profile/entities/profile.entity';

@Module({
  imports: [
    MulterModule.register({ dest: './uploads/pending-pictures' }),
    TypeOrmModule.forFeature([ProfilePicture, Profile]),
  ],
  providers: [ProfilePictureService],
  controllers: [ProfilePictureController],
})
export class ProfilePictureModule {}
