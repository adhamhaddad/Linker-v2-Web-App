import {
  WebSocketGateway,
  SubscribeMessage,
  WebSocketServer,
  OnGatewayInit,
  OnGatewayConnection,
  OnGatewayDisconnect,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { UserService } from '../user/services/user.service';
import { OnlineStatus } from '../auth/interfaces/user.interface';
import { FriendService } from '../friends/services/friend.service';

@WebSocketGateway({
  cors: {
    origin: ['http://localhost:3000'],
  },
})
export class SocketGateway
  implements OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect
{
  @WebSocketServer()
  server: Server;

  constructor(
    private readonly userService: UserService,
    private readonly friendService: FriendService,
  ) {}

  // Store user sockets in a Map
  userSockets = new Map<string, Socket>();

  // Initialize gateway
  afterInit(server: Server) {
    console.log('Socket gateway initialized');
  }

  async handleConnection(client: Socket, ...args: any[]) {
    const userUuid = this.getUserIdFromSocket(client);

    // Store user socket in the Map
    this.userSockets.set(userUuid, client);

    // Update user's online status when they connect
    if (userUuid) {
      const { status } = await this.userService.updateOnlineStatus(userUuid, {
        is_online: OnlineStatus.ONLINE,
      });
      // Emit event to inform specific user's friends about the online status change
      const { data } = await this.friendService.getUserFriends(userUuid);
      data.forEach((friend) => {
        const friendSocket = this.findSocketByUserId(friend.user.id);
        if (friendSocket) {
          friendSocket.emit('isFriendOnline', { userUuid, isOnline: status });
        }
      });
    }
  }

  async handleDisconnect(client: Socket) {
    const userUuid = this.getUserIdFromSocket(client);

    // Store user socket in the Map
    this.userSockets.delete(userUuid);

    // Update user's online status when they disconnect
    if (userUuid) {
      const { status } = await this.userService.updateOnlineStatus(userUuid, {
        is_online: OnlineStatus.OFFLINE,
      });
      // Emit event to inform specific user's friends about the online status change
      const { data } = await this.friendService.getUserFriends(userUuid);
      data.forEach((friend) => {
        const friendSocket = this.findSocketByUserId(friend.user.id);
        if (friendSocket) {
          friendSocket.emit('isFriendOnline', { userUuid, isOnline: status });
        }
      });
    }
  }

  @SubscribeMessage('typing')
  onTyping(client: Socket, { chatId, participantId, isTyping }) {
    const userUuid = this.getUserIdFromSocket(client);

    if (userUuid) {
      const friendSocket = this.findSocketByUserId(participantId);
      if (friendSocket) {
        friendSocket.emit('isFriendTyping', {
          userUuid,
          chatUuid: chatId,
          isTyping: isTyping,
        });
      }
    }
  }

  // @SubscribeMessage('messageDelivered')
  // onMessageDelivered(client: Socket, { chatId, msgId, isDelivered }) {
  //   const participantUuid = this.getUserIdFromSocket(client);

  //   if (participantUuid) {
  //     const friendSocket = this.findSocketByUserId(participantId);
  //     if (friendSocket) {
  //       friendSocket.emit('isMessageDelivered', {
  //         chatUuid: chatId,
  //         msgId: msgId,
  //         messageDelivered: isDelivered,
  //       });
  //     }
  //   }
  // }

  async handleNewMessage(message: any) {
    const { chatId, conversationId, participants } = message;

    participants.forEach((participant) => {
      const { id: participantId } = participant;

      const friendSocket = this.findSocketByUserId(participantId);

      if (friendSocket) {
        friendSocket.emit('newMessage', {
          chatUuid: chatId,
          conversationUuid: conversationId,
          message: message,
        });
      }
    });
  }

  private getUserIdFromSocket(client: Socket): string | null {
    // Extract user ID from socket's handshake query parameters
    const userUuid = client.handshake.query.id;
    return userUuid ? String(userUuid) : null;
  }

  // Find user socket by user ID
  private findSocketByUserId(userUuid: string): Socket | undefined {
    return this.userSockets.get(userUuid);
  }
}
