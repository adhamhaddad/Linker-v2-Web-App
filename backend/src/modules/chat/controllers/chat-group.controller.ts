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
import { JwtAuthGuard } from 'src/modules/auth/guards/auth.guard';
import { ChatGroupService } from '../services/chat-group.service';
import { User } from 'src/decorators/user.decorator';
import { Lang } from 'src/decorators/lang.decorator';
import { CreateGroupChatDto } from '../dto/create-group.dto';
import { UpdateGroupChatDto } from '../dto/update-group.dto';
import { FilterMessageDTO } from '../dto/filter-messages.dto';

@UseGuards(JwtAuthGuard)
@Controller('chats/groups')
export class ChatGroupController {
  constructor(private readonly chatGroupService: ChatGroupService) {}

  @Post()
  async createGroupChat(
    @Body() body: CreateGroupChatDto,
    @User() user,
    @Lang() lang: string,
  ) {
    const { message, data } = await this.chatGroupService.createGroupChat(
      body,
      user,
      lang,
    );
    return { message, data };
  }

  @Get()
  async getGroupChats(@Query() query: FilterMessageDTO, @User() user: any) {
    const { data, total, meta } = await this.chatGroupService.getGroupChats(
      query,
      user,
    );
    return { data, total, meta };
  }

  @Get(':id')
  async getGroupChatById(
    @Param('id') uuid: string,
    @User() user: any,
    @Lang() lang: string,
  ) {
    const { data } = await this.chatGroupService.getGroupChatById(
      uuid,
      user,
      lang,
    );
    return { data };
  }

  @Patch(':id')
  async updateChat(
    @Param('id') uuid: string,
    @Body() body: UpdateGroupChatDto,
    @User() user,
    @Lang() lang: string,
  ) {
    const { message, data } = await this.chatGroupService.updateGroupChat(
      uuid,
      body,
      user,
      lang,
    );
    return { message, data };
  }

  @Delete(':id')
  async deleteGroupChat(
    @Param('id') uuid: string,
    @User() user: any,
    @Lang() lang: string,
  ) {
    const { message, data } = await this.chatGroupService.deleteGroupChat(
      uuid,
      user,
      lang,
    );
    return { message, data };
  }
}
