import {
  Body,
  Controller,
  Get,
  Param,
  Patch,
  Post,
  Query,
  UseGuards,
} from '@nestjs/common';
import { FriendRequestService } from '../services/friend-request.service';
import { User } from 'src/decorators/user.decorator';
import { Lang } from 'src/decorators/lang.decorator';
import { JwtAuthGuard } from 'src/modules/auth/guards/auth.guard';
import { UpdateRequestStatusDto } from '../dto/update-request-status.dto';
import { FilterFriendRequestDTO } from '../dto/requests-filter.dto';
import { ChatService } from 'src/modules/chat/services/chat.service';
import { ChatType } from 'src/modules/chat/interfaces/chat.interface';

@UseGuards(JwtAuthGuard)
@Controller('friend-requests')
export class FriendRequestController {
  constructor(
    private readonly friendRequestService: FriendRequestService,
    private readonly chatService: ChatService,
  ) {}

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
    const { message, data, friend } =
      await this.friendRequestService.updateFriendRequest(
        uuid,
        body,
        user,
        lang,
      );
    if (data) {
      await this.chatService.createChat(
        {
          userId: friend.user1.uuid,
          type: ChatType.CHAT,
        },
        user,
        lang,
      );
    }
    return { message, data };
  }

  @Get()
  async getFriendRequests(
    @Query() query: FilterFriendRequestDTO,
    @User() user: any,
  ) {
    const { data, total, meta } =
      await this.friendRequestService.getFriendRequests(query, user);
    return { data, total, meta };
  }
}
