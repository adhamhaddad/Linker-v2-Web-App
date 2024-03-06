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
import { TypeOrmModule } from '@nestjs/typeorm';
import { Profile } from '../profile/entities/profile.entity';
import { SocketGateway } from '../socket/socket.gateway';
import { User } from '../user/entities/user.entity';
import { UserService } from '../user/services/user.service';
import { FriendsModule } from '../friends/friends.module';
import { FriendService } from '../friends/services/friend.service';
import { Friend } from '../friends/entities/friend.entity';
import { ConversationController } from './controllers/chat-conversation.controller';

@Module({
  imports: [
    TypeOrmModule.forFeature([Profile, User, Friend]),
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
    SocketGateway,
    UserService,
    FriendService,
  ],
  controllers: [
    ChatController,
    ChatGroupController,
    ChatArchiveController,
    ConversationController,
    MessageController,
  ],
  exports: [
    MongooseModule.forFeature([
      { name: 'Chat', schema: ChatSchema },
      { name: 'Conversation', schema: ConversationSchema },
      { name: 'Message', schema: MessageSchema },
    ]),
    ChatService,
    ConversationService,
    MessageService,
  ],
})
export class ChatModule {}
