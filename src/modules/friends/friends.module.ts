import { Module } from '@nestjs/common';
import { FriendService } from './services/friend.service';
import { FriendController } from './controllers/friend.controller';
import { FriendRequestController } from './controllers/friend-request.controller';
import { FriendRequestService } from './services/friend-request.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Friend } from './entities/friend.entity';
import { FriendRequest } from './entities/friend-request.entity';
import { JwtStrategy } from '../auth/strategies/jwt.strategy';
import { Utils } from 'src/utils/utils';
import { RedisService } from '../redis/redis.service';
import { User } from '../auth/entities/user.entity';
import { ChatService } from '../chat/services/chat.service';
import { MongooseModule } from '@nestjs/mongoose';
import { ChatSchema } from '../chat/schemas/chat.schema';
import { ConversationService } from '../chat/services/conversation.service';
import { ConversationSchema } from '../chat/schemas/conversation.schema';
import { MessageSchema } from '../chat/schemas/message.schema';
import { MessageService } from '../chat/services/message.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([Friend, FriendRequest, User]),
    MongooseModule.forFeature([
      { name: 'Chat', schema: ChatSchema },
      { name: 'Conversation', schema: ConversationSchema },
      { name: 'Message', schema: MessageSchema },
    ]),
  ],
  providers: [
    FriendService,
    FriendRequestService,
    ChatService,
    ConversationService,
    MessageService,
    JwtStrategy,
    Utils,
    RedisService,
  ],
  controllers: [FriendController, FriendRequestController],
})
export class FriendsModule {}
