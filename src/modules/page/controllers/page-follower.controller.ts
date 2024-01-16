import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Query,
  UseGuards,
} from '@nestjs/common';
import { PageFollowerService } from '../services/page-follower.service';
import { User } from 'src/decorators/user.decorator';
import { Lang } from 'src/decorators/lang.decorator';
import { JwtAuthGuard } from 'src/modules/auth/guards/auth.guard';

@UseGuards(JwtAuthGuard)
@Controller('pages')
export class PageFollowersController {
  constructor(private readonly pageFollowerService: PageFollowerService) {}

  @Post(':id/followers')
  async createPageFollower(
    @Param('id') uuid: string,
    @User() user: any,
    @Lang() lang: string,
  ) {
    const { message, data } = await this.pageFollowerService.createPageFollower(
      uuid,
      user,
      lang,
    );
    return { message, data };
  }

  @Get(':id/followers')
  async getPageFollowers(
    @Param('id') uuid: string,
    @Query() query: any,
    @User() user: any,
    @Lang() lang: string,
  ) {
    const { data, total, meta } =
      await this.pageFollowerService.getPageFollowers(uuid, query, user, lang);
    return { data, total, meta };
  }

  @Patch(':pageId/followers/:followerId')
  async updatePageFollower(
    @Param('pageId') pageUuid: string,
    @Param('followerId') followerUuid: string,
    @Body() body: any,
    @User() user: any,
    @Lang() lang: string,
  ) {
    const { message, data } = await this.pageFollowerService.updatePageFollower(
      pageUuid,
      followerUuid,
      body,
      user,
      lang,
    );
    return { message, data };
  }

  @Delete(':id/followers')
  async deletePageFollower(
    @Param('id') uuid: string,
    @User() user: any,
    @Lang() lang: string,
  ) {
    const { message, data } = await this.pageFollowerService.deletePageFollower(
      uuid,
      user,
      lang,
    );
    return { message, data };
  }
}
