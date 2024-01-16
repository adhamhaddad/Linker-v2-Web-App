import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { ChatSchema } from './schemas/chat.schema';
import { ConversationSchema } from './schemas/conversation.schema';
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
import { JwtStrategy } from '../auth/strategies/jwt.strategy';
import { Utils } from 'src/utils/utils';
import { RedisService } from '../redis/redis.service';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: 'Chat', schema: ChatSchema },
      { name: 'Conversation', schema: ConversationSchema },
      { name: 'Message', schema: MessageSchema },
    ]),
  ],
  providers: [
    ChatService,
    ConversationService,
    ChatGroupService,
    ChatArchiveService,
    MessageService,
    JwtStrategy,
    Utils,
    RedisService,
  ],
  controllers: [
    ChatController,
    ChatGroupController,
    ChatArchiveController,
    MessageController,
  ],
})
export class ChatModule {}
