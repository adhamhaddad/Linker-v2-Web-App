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
@Controller('users')
export class CoverPictureController {
  constructor(private readonly coverPictureService: CoverPictureService) {}

  @Post('cover-pictures')
  @UseInterceptors(FileInterceptor('imageUrl'))
  async uploadPhoto(@UploadedFile() file, @User() user, @Lang() lang: string) {
    const { message, data } = await this.coverPictureService.uploadCoverPicture(
      file,
      user,
      lang,
    );
    return { message, data };
  }

  @Get(':id/cover-pictures')
  async getCoverPictureByUserId(
    @Param('id') uuid: string,
    @Lang() lang: string,
  ) {
    const { message, data } =
      await this.coverPictureService.getCoverPictureByUserId(uuid, lang);
    return { message, data };
  }

  @Get('cover-pictures/:id')
  async getCoverPictureById(@Param('id') uuid: string, @Lang() lang: string) {
    const { message, data } =
      await this.coverPictureService.getCoverPictureById(uuid, lang);
    return { message, data };
  }

  @Delete('cover-pictures/:id')
  async deletePhoto(
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
