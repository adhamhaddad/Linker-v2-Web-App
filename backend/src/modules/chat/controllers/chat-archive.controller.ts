import { Controller, Delete, Param, Post, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from 'src/modules/auth/guards/auth.guard';
import { ChatArchiveService } from '../services/chat-archive.service';
import { User } from 'src/decorators/user.decorator';
import { Lang } from 'src/decorators/lang.decorator';

@UseGuards(JwtAuthGuard)
@Controller('chats')
export class ChatArchiveController {
  constructor(private readonly chatArchiveService: ChatArchiveService) {}

  @Post(':id/archives/archive')
  async archiveChat(
    @Param('id') _id: string,
    @User() user,
    @Lang() lang: string,
  ) {
    const { message, data } = await this.chatArchiveService.archiveChat(
      _id,
      user,
      lang,
    );
    return { message, data };
  }

  @Post(':id/archives/un-archive')
  async unArchiveChat(
    @Param('id') _id: string,
    @User() user: any,
    @Lang() lang: string,
  ) {
    const { message, data } = await this.chatArchiveService.unArchiveChat(
      _id,
      user,
      lang,
    );
    return { message, data };
  }
}
