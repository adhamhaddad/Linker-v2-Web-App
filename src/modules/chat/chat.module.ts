import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { ChatSchema } from './schemas/chat.schema';
import { MessageSchema } from './schemas/message.schema';
import { ChatService } from './services/chat.service';
import { ConversationService } from './services/conversation.service';
import { ChatGroupService } from './services/chat-group.service';
import { ChatArchiveService } from './services/chat-archive.service';
import { MessageService } from './services/message.service';
import { ChatController } from './controllers/chat.controller';
import { ChatGroupController } from './controllers/chat-group.controller';
import { ChatArchiveController } from './controllers/chat-archive.controller';
import { MessageController } from './controllers/message.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Profile } from '../profile/entities/profile.entity';
import { SocketModule } from '@modules/socket/socket.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([Profile]),
    MongooseModule.forFeature([
      { name: 'Chat', schema: ChatSchema },
      { name: 'Message', schema: MessageSchema },
    ]),
    SocketModule,
  ],
  providers: [
    ChatService,
    ChatGroupService,
    ChatArchiveService,
    ConversationService,
    MessageService,
  ],
  controllers: [
    ChatController,
    ChatGroupController,
    ChatArchiveController,
    MessageController,
  ],
  exports: [ChatService],
})
export class ChatModule {}
