import {
  Body,
  Controller,
  Get,
  Param,
  Patch,
  Post,
  UseGuards,
} from '@nestjs/common';
import { FriendRequestService } from '../services/friend-request.service';
import { User } from 'src/decorators/user.decorator';
import { Lang } from 'src/decorators/lang.decorator';
import { JwtAuthGuard } from 'src/modules/auth/guards/auth.guard';
import { UpdateRequestStatusDto } from '../dto/update-request-status.dto';

@UseGuards(JwtAuthGuard)
@Controller('friend-requests')
export class FriendRequestController {
  constructor(private readonly friendRequestService: FriendRequestService) {}

  @Post(':id')
  async sendRequest(
    @Param('id') uuid: string,
    @User() user,
    @Lang() lang: string,
  ) {
    const { message, data } = await this.friendRequestService.sendFriendRequest(
      uuid,
      user,
      lang,
    );
    return { message, data };
  }

  @Patch(':id')
  async updateFriendRequest(
    @Param('id') uuid: string,
    @Body() body: UpdateRequestStatusDto,
    @User() user,
    @Lang() lang: string,
  ) {
    const { message, data } =
      await this.friendRequestService.updateFriendRequest(
        uuid,
        body,
        user,
        lang,
      );
    return { message, data };
  }

  @Get()
  async getFriendRequests(@User() user, @Lang() lang: string) {
    const { message, data } = await this.friendRequestService.getFriendRequests(
      user,
      lang,
    );
    return { message, data };
  }

  @Get('sent')
  async getFriendRequestsSent(@User() user, @Lang() lang: string) {
    const { message, data } = await this.friendRequestService.getFriendRequests(
      user,
      lang,
      true,
    );
    return { message, data };
  }
}
