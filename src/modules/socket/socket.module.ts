import { Module, forwardRef } from '@nestjs/common';
import { SocketGateway } from './socket.gateway';
import { ConnectionService } from './services/connection.service';
import { RequestSocketService } from './services/request-ws.service';
import { ChatSocketService } from './services/chat-ws.service';
import { MessageSocketService } from './services/message-ws.service';
import { PreOfferSocketService } from './services/offers-ws.service';
import { UserModule } from '@modules/user/user.module';
import { ProfileModule } from '@modules/profile/profile.module';
import { FriendsModule } from '@modules/friends/friends.module';
import { ChatModule } from '@modules/chat/chat.module';

@Module({
  imports: [
    forwardRef(() => UserModule),
    forwardRef(() => ProfileModule),
    forwardRef(() => FriendsModule),
    forwardRef(() => ChatModule),
  ],
  providers: [
    SocketGateway,
    ConnectionService,
    RequestSocketService,
    ChatSocketService,
    MessageSocketService,
    PreOfferSocketService,
  ],
  exports: [SocketGateway],
})
export class SocketModule {}
