import {
  Body,
  Controller,
  Get,
  Param,
  Patch,
  Query,
  UseGuards,
} from '@nestjs/common';
import { JwtAuthGuard } from 'src/modules/auth/guards/auth.guard';
import { ProfileService } from '../services/profile.service';
import { Lang } from 'src/decorators/lang.decorator';
import { User } from 'src/decorators/user.decorator';
import { UpdateProfileDto } from '../dto/update-profile.dto';
import { FilterProfileDTO } from '../dto/filter-profile.dto';

@UseGuards(JwtAuthGuard)
@Controller('users/profiles')
export class ProfileController {
  constructor(private readonly profileService: ProfileService) {}

  @Get()
  async getProfiles(@Query() query: FilterProfileDTO) {
    const { data, total, meta } = await this.profileService.getProfiles(query);
    return { data, total, meta };
  }

  @Get(':username')
  async getProfileByUsername(
    @Param('username') username: string,
    @Lang() lang: string,
  ) {
    const { data } = await this.profileService.getProfileByUsername(
      username,
      lang,
    );
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
