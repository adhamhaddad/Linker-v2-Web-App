import { Injectable } from '@nestjs/common';
import { ConnectionService } from '@socket/services/connection.service';

@Injectable()
export class MessageSocketService {
  constructor(private readonly connectionService: ConnectionService) {}

  async handleNewMessage(message: any) {
    const { chatId, conversationId, participants } = message;

    participants.forEach((participant) => {
      const { id: participantId } = participant;

      const friendSocket =
        this.connectionService.findSocketByUserId(participantId);

      if (friendSocket) {
        friendSocket.emit('newMessage', {
          chatUuid: chatId,
          conversationUuid: conversationId,
          message: message,
        });
      }
    });
  }

  async handleUpdateMessage(message: any) {
    const { chatId, conversationId, participants } = message;

    participants.forEach((participant) => {
      const { id: participantId } = participant;

      const friendSocket =
        this.connectionService.findSocketByUserId(participantId);

      if (friendSocket) {
        friendSocket.emit('updatedMessage', {
          chatUuid: chatId,
          conversationUuid: conversationId,
          message: message,
        });
      }
    });
  }

  async handleDeleteMessage(message: any) {
    const { conversationId, participants } = message;

    participants.forEach((participant) => {
      const { id: participantId } = participant;

      const friendSocket =
        this.connectionService.findSocketByUserId(participantId);

      if (friendSocket) {
        friendSocket.emit('deletedMessage', {
          conversationUuid: conversationId,
          message: message,
        });
      }
    });
  }
}
