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
import { ChatService } from '../services/chat.service';
import { User } from 'src/decorators/user.decorator';
import { Lang } from 'src/decorators/lang.decorator';
import { UpdateChatDto } from '../dto/update-chat.dto';
import { FilterChatDTO } from '../dto/filter-chats.dto';
import { DeleteChatDto } from '../dto/delete-chat.dto';
import { SocketGateway } from 'src/modules/socket/socket.gateway';

@UseGuards(JwtAuthGuard)
@Controller('chats')
export class ChatController {
  constructor(
    private readonly chatService: ChatService,
    private readonly socketGateway: SocketGateway,
  ) {}

  @Get()
  async getChats(@Query() query: FilterChatDTO, @User() user: any) {
    const { data, total, meta } = await this.chatService.getChats(query, user);
    return { data, total, meta };
  }

  @Get(':id')
  async getChatById(
    @Param('id') _id: string,
    @User() user: any,
    @Lang() lang: string,
  ) {
    const { data } = await this.chatService.getChatById(_id, user, lang);
    return { data };
  }

  @Patch(':id')
  async updateChat(
    @Param('id') _id: string,
    @Body() body: UpdateChatDto,
    @User() user,
    @Lang() lang: string,
  ) {
    const { message, data } = await this.chatService.updateChat(
      _id,
      body,
      user,
      lang,
    );
    return { message, data };
  }

  @Delete(':id')
  async deleteChat(
    @Param('id') _id: string,
    @Query() query: DeleteChatDto,
    @User() user: any,
    @Lang() lang: string,
  ) {
    const { message, data } = await this.chatService.deleteChat(
      _id,
      query,
      user,
      lang,
    );
    console.log(data);
    await this.socketGateway.handleDeleteChat(data);
    return { message, data };
  }
}
