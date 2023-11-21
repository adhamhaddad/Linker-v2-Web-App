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
@Controller('user')
export class ProfilePictureController {
  constructor(private readonly profilePictureService: ProfilePictureService) {}

  @Post('profile-picture/upload')
  @UseInterceptors(FileInterceptor('file'))
  async uploadPhoto(@UploadedFile() file, @User() user, @Lang() lang: string) {
    const { message, data } =
      await this.profilePictureService.uploadProfilePicture(file, user, lang);
    return { message, data };
  }

  @Get('profile-picture/:id')
  async getProfilePictureById(@Param('id') uuid: string, @Lang() lang: string) {
    const { message, data } =
      await this.profilePictureService.getProfilePictureById(uuid, lang);
    return { message, data };
  }

  @Get(':id/profile-picture')
  async getProfilePictureByUserId(
    @Param('id') uuid: string,
    @Lang() lang: string,
  ) {
    const { message, data } =
      await this.profilePictureService.getProfilePictureByUserId(uuid, lang);
    return { message, data };
  }

  @Delete('profile-picture/delete/:id')
  async deletePhoto(
    @Param('id') uuid: string,
    @User() user,
    @Lang() lang: string,
  ) {
    const { message, data } =
      await this.profilePictureService.deleteProfilePicture(uuid, user, lang);
    return { message, data };
  }
}
