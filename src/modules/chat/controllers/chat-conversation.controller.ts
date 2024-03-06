import { Controller, Delete, Param, Query, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from 'src/modules/auth/guards/auth.guard';
import { ConversationService } from '../services/conversation.service';
import { User } from 'src/decorators/user.decorator';
import { Lang } from 'src/decorators/lang.decorator';
import { DeleteConversationDto } from '../dto/delete-conversation.dto';
import { SocketGateway } from 'src/modules/socket/socket.gateway';

@UseGuards(JwtAuthGuard)
@Controller('chats/conversations')
export class ConversationController {
  constructor(
    private readonly conversationService: ConversationService,
    private readonly socketGateway: SocketGateway,
  ) {}

  @Delete(':id')
  async deleteConversation(
    @Param('id') _id: string,
    @Query() query: DeleteConversationDto,
    @User() user: any,
    @Lang() lang: string,
  ) {
    const { message, data } = await this.conversationService.deleteConversation(
      _id,
      query,
      user,
      lang,
    );
    await this.socketGateway.handleDeleteConversation(data);
    return { message, data };
  }
}
