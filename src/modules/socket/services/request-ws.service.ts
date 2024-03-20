import { Injectable } from '@nestjs/common';
import { ConnectionService } from '@socket/services/connection.service';

@Injectable()
export class RequestSocketService {
  constructor(private readonly connectionService: ConnectionService) {}

  async handleNewRequest(data: any) {
    const { user } = data;

    const userSocket = this.connectionService.findSocketByUserId(user.id);
    if (userSocket) {
      userSocket.emit('newRequest', data);
    }
  }

  async handleUpdatedRequest(data: any) {
    const { status, user } = data;

    if (status === 'accepted') {
      const userSocket = this.connectionService.findSocketByUserId(user.id);
      if (userSocket) {
        userSocket.emit('updatedRequest', data);
      }
    }
  }
}
