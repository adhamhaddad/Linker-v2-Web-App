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
import { MessageService } from '../services/message.service';
import { User } from 'src/decorators/user.decorator';
import { Lang } from 'src/decorators/lang.decorator';
import { CreateMessageDto } from '../dto/create-message.dto';
import { UpdateMessageDto } from '../dto/update-message.dto';
import { FilterMessageDTO } from '../dto/filter-messages.dto';
import { DeleteMessageDto } from '../dto/delete-message.dto';
import { SocketGateway } from '@modules/socket/socket.gateway';

@UseGuards(JwtAuthGuard)
@Controller('chats/conversations')
export class MessageController {
  constructor(
    private readonly messageService: MessageService,
    private readonly socketGateway: SocketGateway,
  ) {}

  @Post(':id/messages')
  async createMessage(
    @Param('id') _id: string,
    @Body() body: CreateMessageDto,
    @User() user,
    @Lang() lang: string,
  ) {
    const { message, data } = await this.messageService.createMessage(
      _id,
      body,
      user,
      lang,
    );
    await this.socketGateway.handleNewMessage(data);
    return { message, data };
  }

  @Get(':id/messages')
  async getMessages(
    @Param('id') _id: string,
    @Query() query: FilterMessageDTO,
    @User() user: any,
    @Lang() lang: string,
  ) {
    const { data, total, meta } = await this.messageService.getMessages(
      _id,
      query,
      user,
      lang,
    );
    return { data, total, meta };
  }

  @Patch('messages/:id')
  async updateMessage(
    @Param('id') _id: string,
    @Body() body: UpdateMessageDto,
    @User() user,
    @Lang() lang: string,
  ) {
    const { message, data } = await this.messageService.updateMessage(
      _id,
      body,
      user,
      lang,
    );
    await this.socketGateway.handleUpdateMessage(data);
    return { message, data };
  }

  @Delete(':conversationId/messages/:id')
  async deleteMessage(
    @Param('id') _id: string,
    @Param('conversationId') conversationUuid: string,
    @Query() query: DeleteMessageDto,
    @User() user: any,
    @Lang() lang: string,
  ) {
    const { message, data } = await this.messageService.deleteMessage(
      _id,
      conversationUuid,
      query,
      user,
      lang,
    );
    await this.socketGateway.handleDeleteMessage(data);
    return { message, data };
  }
}
