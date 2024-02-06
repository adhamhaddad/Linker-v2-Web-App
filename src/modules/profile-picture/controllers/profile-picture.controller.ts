import {
  Controller,
  Delete,
  Get,
  Param,
  Post,
  UploadedFile,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { Lang } from 'src/decorators/lang.decorator';
import { User } from 'src/decorators/user.decorator';
import { ProfilePictureService } from '../services/profile-picture.service';
import { JwtAuthGuard } from 'src/modules/auth/guards/auth.guard';

@UseGuards(JwtAuthGuard)
@Controller('users/profiles')
export class ProfilePictureController {
  constructor(private readonly profilePictureService: ProfilePictureService) {}

  @Post(':id/profile-pictures')
  @UseInterceptors(FileInterceptor('imageUrl'))
  async uploadPhoto(
    @Param('id') uuid: string,
    @UploadedFile() file,
    @User() user,
    @Lang() lang: string,
  ) {
    const { message, data } =
      await this.profilePictureService.uploadProfilePicture(
        uuid,
        file,
        user,
        lang,
      );
    return { message, data };
  }

  @Get(':id/profile-pictures')
  async getProfilePictures(@Param('id') uuid: string, @Lang() lang: string) {
    const { data, total } = await this.profilePictureService.getProfilePictures(
      uuid,
      lang,
    );
    return { data, total };
  }

  @Get('profile-pictures/:id')
  async getProfilePictureById(@Param('id') uuid: string, @Lang() lang: string) {
    const { message, data } =
      await this.profilePictureService.getProfilePictureById(uuid, lang);
    return { message, data };
  }

  @Delete('profile-pictures/:id')
  async deleteProfilePicture(
    @Param('id') uuid: string,
    @User() user,
    @Lang() lang: string,
  ) {
    const { message, data } =
      await this.profilePictureService.deleteProfilePicture(uuid, user, lang);
    return { message, data };
  }
}
