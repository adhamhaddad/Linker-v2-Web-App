import { Body, Controller, Get, Patch, UseGuards } from '@nestjs/common';
import { SettingService } from '../services/setting.service';
import { User } from 'src/decorators/user.decorator';
import { Lang } from 'src/decorators/lang.decorator';
import { UpdateSettingsDto } from '../dto/update-settings.dto';
import { JwtAuthGuard } from 'src/modules/auth/guards/auth.guard';

@UseGuards(JwtAuthGuard)
@Controller('users/settings')
export class SettingController {
  constructor(private readonly settingService: SettingService) {}

  @Get()
  async getSettings(@User() user: any, @Lang() lang: string) {
    const { data } = await this.settingService.getSettings(user, lang);
    return { data };
  }

  @Patch()
  async updateSettings(
    @Body() body: UpdateSettingsDto,
    @User() user: any,
    @Lang() lang: string,
  ) {
    const { message, data } = await this.settingService.updateSetting(
      body,
      user,
      lang,
    );
    return { message, data };
  }
}
