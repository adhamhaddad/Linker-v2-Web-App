import { Body, Controller, Get, Param, Patch, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from 'src/modules/auth/guards/auth.guard';
import { ProfileService } from '../services/profile.service';
import { Lang } from 'src/decorators/lang.decorator';
import { User } from 'src/decorators/user.decorator';
import { UpdateProfileDto } from '../dto/update-profile.dto';

@UseGuards(JwtAuthGuard)
@Controller('profiles')
export class ProfileController {
  constructor(private readonly profileService: ProfileService) {}

  @Get(':id')
  async getProfileById(@Param('id') uuid: string, @Lang() lang: string) {
    const { data } = await this.profileService.getProfileById(uuid, lang);
    return { data };
  }

  @Patch()
  async updateProfile(
    @Body() body: UpdateProfileDto,
    @User() user,
    @Lang() lang: string,
  ) {
    const { message, data } = await this.profileService.updateProfile(
      body,
      user,
      lang,
    );
    return { message, data };
  }
}
