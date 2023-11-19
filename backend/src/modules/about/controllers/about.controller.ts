import {
  Controller,
  Post,
  Body,
  Patch,
  UseGuards,
  Param,
} from '@nestjs/common';
import { Lang } from 'src/decorators/lang.decorator';
import { AboutService } from '../services/about.service';
import { User } from 'src/decorators/user.decorator';
import { CreateAboutDto } from '../dto/create-about.dto';
import { UpdateAboutDto } from '../dto/update-about.dto';
import { JwtAuthGuard } from 'src/modules/auth/guards/auth.guard';

@UseGuards(JwtAuthGuard)
@Controller('user/about')
export class AboutController {
  constructor(private readonly aboutService: AboutService) {}

  @Post()
  async createAbout(
    @Body() body: CreateAboutDto,
    @User() user,
    @Lang() lang: string,
  ) {
    const { message, data } = await this.aboutService.createAbout(
      body,
      user,
      lang,
    );
    return { message, data };
  }

  @Patch(':id')
  async updateAbout(
    @Param('id') id: string,
    @Body() body: UpdateAboutDto,
    @User() user,
    @Lang() lang: string,
  ) {
    const { message, data } = await this.aboutService.updateAbout(
      id,
      body,
      user,
      lang,
    );
    return { message, data };
  }
}
