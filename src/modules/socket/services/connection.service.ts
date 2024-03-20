// connection.service.ts
import { Injectable } from '@nestjs/common';
import { Socket } from 'socket.io';
import { UserService } from '@modules/user/services/user.service';
import { FriendService } from '@modules/friends/services/friend.service';
import { AuthService } from '@modules/auth/services/auth.service';

@Injectable()
export class ConnectionService {
  // Store user sockets in a Map
  public userSockets = new Map<string, Socket>();

  constructor(
    private readonly userService: UserService,
    private readonly friendService: FriendService,
  ) {}

  async handleConnection(client: Socket) {
    const userUuid = this.getUserIdFromSocket(client);

    // Store user socket in the Map
    this.userSockets.set(userUuid, client);

    this.getConnectedSockets();
    // Update user's online status when they connect
    if (userUuid) {
      // Check for pending messages
      // Update any message that status.isDelivered is false to true
      const messages = [];
      // Emit event to inform specific user's friends about the online status change
      const { data } = await this.friendService.getUserFriends(userUuid);
      data.forEach((friend) => {
        const socket = this.findSocketByUserId(friend.user.id);
        if (socket) {
          socket.emit('isFriendOnline', { userUuid, isOnline: 'online' });
        }
      });
    }
  }

  async handleDisconnect(client: Socket) {
    const userUuid = this.getUserIdFromSocket(client);

    // Store user socket in the Map
    this.userSockets.delete(userUuid);

    this.getConnectedSockets();

    // Update user's online status when they disconnect
    if (userUuid) {
      const { status } = await this.userService.updateActiveStatus(
        userUuid,
        new Date(),
      );

      // Emit event to inform specific user's friends about the online status change
      const { data } = await this.friendService.getUserFriends(userUuid);
      data.forEach((friend) => {
        const socket = this.findSocketByUserId(friend.user.id);
        if (socket) {
          socket.emit('isFriendOnline', {
            userUuid,
            isOnline: status,
          });
        }
      });
    }
  }

  public getUserIdFromSocket(client: Socket): string | null {
    // Extract user ID from socket's handshake query parameters
    const userUuid = client.handshake.query.id;
    return userUuid ? String(userUuid) : null;
  }

  // Find user socket by user ID
  public findSocketByUserId(userUuid: string): Socket | undefined {
    const socket = this.userSockets.get(userUuid);
    // console.log(socket);

    return socket;
  }

  public getConnectedSockets() {
    const sockets = [];
    this.userSockets.forEach((socket) =>
      sockets.push(socket.handshake.query.id),
    );
    console.log('Connected sockets', sockets);
    return sockets;
  }
}
