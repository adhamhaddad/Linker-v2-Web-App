import { Module } from '@nestjs/common';
import { FriendService } from './services/friend.service';
import { FriendController } from './controllers/friend.controller';
import { FriendRequestController } from './controllers/friend-request.controller';
import { FriendRequestService } from './services/friend-request.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Friend } from './entities/friend.entity';
import { FriendRequest } from './entities/friend-request.entity';
import { ChatModule } from '../chat/chat.module';
import { SocketModule } from '@modules/socket/socket.module';
import { UserModule } from '@modules/user/user.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([Friend, FriendRequest]),
    ChatModule,
    UserModule,
    SocketModule,
  ],
  providers: [FriendService, FriendRequestService],
  controllers: [FriendController, FriendRequestController],
  exports: [FriendService, FriendRequestService],
})
export class FriendsModule {}
