import { Controller, Get, Param, Post, UseGuards } from '@nestjs/common';
import { VisitorService } from '../services/visitor.service';
import { User } from 'src/decorators/user.decorator';
import { Lang } from 'src/decorators/lang.decorator';
import { JwtAuthGuard } from 'src/modules/auth/guards/auth.guard';

@UseGuards(JwtAuthGuard)
@Controller('users/profiles')
export class VisitorController {
  constructor(private readonly visitorService: VisitorService) {}

  @Post(':id/visitors')
  async createVisit(
    @Param('id') uuid: string,
    @User() user: any,
    @Lang() lang: string,
  ) {
    const { message, data } = await this.visitorService.createVisit(
      uuid,
      user,
      lang,
    );
    return { message, data };
  }

  @Get(':id/visitors')
  async getVisits(
    @Param('id') uuid: string,
    @User() user: any,
    @Lang() lang: string,
  ) {
    const { message, data, total, meta } = await this.visitorService.getVisits(
      uuid,
      user,
      lang,
    );
    return { message, data, total, meta };
  }
}
