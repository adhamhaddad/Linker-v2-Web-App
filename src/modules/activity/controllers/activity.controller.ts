import { Controller, Delete, Get, Param, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from 'src/modules/auth/guards/auth.guard';
import { Lang } from 'src/decorators/lang.decorator';
import { User } from 'src/decorators/user.decorator';
import { ActivityService } from '../services/activity.service';

@UseGuards(JwtAuthGuard)
@Controller('auth')
export class ActivityController {
  constructor(private readonly activityService: ActivityService) {}

  @Get('activities')
  async getUserActivities(@User() user: any, @Lang() lang: string) {
    const { message, data, total } = await this.activityService.findByUserId(
      user,
      lang,
    );
    return { message, data, total };
  }

  @Delete('activities/:id')
  async deletePhone(
    @Param('id') uuid: string,
    @User() user,
    @Lang() lang: string,
  ) {
    const { message, data } = await this.activityService.deleteActivity(
      uuid,
      user,
      lang,
    );
    return { message, data };
  }
}
