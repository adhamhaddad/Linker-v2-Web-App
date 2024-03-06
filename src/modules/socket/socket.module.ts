import { Module } from '@nestjs/common';
import { SocketGateway } from './socket.gateway';
import { UserService } from '../user/services/user.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from '../user/entities/user.entity';
import { UserModule } from '../user/user.module';
import { ChatModule } from '../chat/chat.module';
import { FriendsModule } from '../friends/friends.module';
import { FriendService } from '../friends/services/friend.service';
import { Friend } from '../friends/entities/friend.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([User, Friend]),
    UserModule,
    ChatModule,
    FriendsModule,
  ],
  providers: [SocketGateway, UserService, FriendService],
  exports: [SocketGateway],
})
export class SocketModule {}
