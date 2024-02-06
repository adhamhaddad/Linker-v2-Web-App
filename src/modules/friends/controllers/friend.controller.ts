import { Controller, Delete, Get, Param, Query, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from 'src/modules/auth/guards/auth.guard';
import { FriendService } from '../services/friend.service';
import { User } from 'src/decorators/user.decorator';
import { Lang } from 'src/decorators/lang.decorator';
import { FilterFriendDTO } from '../dto/friends-filter.dto';

@UseGuards(JwtAuthGuard)
@Controller('users')
export class FriendController {
  constructor(private readonly friendsService: FriendService) {}

  @Get(':id/friends')
  async getFriends(@Param('id') uuid: string, @Query() query: FilterFriendDTO) {
    const { message, data, total, meta } = await this.friendsService.getFriends(
      uuid,
      query,
    );
    return { message, data, total, meta };
  }

  @Delete('friends/:id')
  async deleteFriend(
    @Param('id') uuid: string,
    @User() user,
    @Lang() lang: string,
  ) {
    const { message, data } = await this.friendsService.deleteFriend(
      uuid,
      user,
      lang,
    );
    return { message, data };
  }
}
