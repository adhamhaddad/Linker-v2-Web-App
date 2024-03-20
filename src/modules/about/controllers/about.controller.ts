import { Controller, Body, Patch, UseGuards, Param } from '@nestjs/common';
import { Lang } from 'src/decorators/lang.decorator';
import { AboutService } from '../services/about.service';
import { User } from 'src/decorators/user.decorator';
import { UpdateAboutDto } from '../dto/update-about.dto';
import { JwtAuthGuard } from '@modules/auth/guards/auth.guard';

@UseGuards(JwtAuthGuard)
@Controller('users/profiles')
export class AboutController {
  constructor(private readonly aboutService: AboutService) {}

  @Patch(':id/about')
  async updateAbout(
    @Param('id') uuid: string,
    @Body() body: UpdateAboutDto,
    @User() user,
    @Lang() lang: string,
  ) {
    const { message, data } = await this.aboutService.updateAbout(
      uuid,
      body,
      user,
      lang,
    );
    return { message, data };
  }
}
