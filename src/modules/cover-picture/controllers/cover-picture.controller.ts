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
import { CoverPictureService } from '../services/cover-picture.service';
import { JwtAuthGuard } from 'src/modules/auth/guards/auth.guard';

@UseGuards(JwtAuthGuard)
@Controller('users/profiles')
export class CoverPictureController {
  constructor(private readonly coverPictureService: CoverPictureService) {}

  @Post(':id/cover-pictures')
  @UseInterceptors(FileInterceptor('imageUrl'))
  async uploadPhoto(
    @Param('id') uuid: string,
    @UploadedFile() file,
    @User() user,
    @Lang() lang: string,
  ) {
    const { message, data } = await this.coverPictureService.uploadCoverPicture(
      uuid,
      file,
      user,
      lang,
    );
    return { message, data };
  }

  @Get(':id/cover-pictures')
  async getProfileCovers(@Param('id') uuid: string, @Lang() lang: string) {
    const { data, total } = await this.coverPictureService.getProfileCovers(
      uuid,
      lang,
    );
    return { data, total };
  }

  @Get('cover-pictures/:id')
  async getCoverPictureById(@Param('id') uuid: string, @Lang() lang: string) {
    const { message, data } =
      await this.coverPictureService.getCoverPictureById(uuid, lang);
    return { message, data };
  }

  @Delete('cover-pictures/:id')
  async deleteCoverPicture(
    @Param('id') uuid: string,
    @User() user,
    @Lang() lang: string,
  ) {
    const { message, data } = await this.coverPictureService.deleteCoverPicture(
      uuid,
      user,
      lang,
    );
    return { message, data };
  }
}
