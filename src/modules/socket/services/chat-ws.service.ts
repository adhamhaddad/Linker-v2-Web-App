import { Injectable } from '@nestjs/common';
import { ConnectionService } from '@socket/services/connection.service';
import { Socket } from 'socket.io';

@Injectable()
export class ChatSocketService {
  constructor(private readonly connectionService: ConnectionService) {}

  async handleDeleteConversation(conversation: any) {
    const { id, participants } = conversation;

    participants.forEach((participant) => {
      const { id: participantId } = participant;
      const socket = this.connectionService.findSocketByUserId(participantId);
      if (socket) {
        socket.emit('deletedConversation', {
          conversationUuid: id,
        });
      }
    });
  }

  async handleDeleteChat(chat: any) {
    const { id, participants } = chat;

    participants.forEach((participant) => {
      const { id: participantId } = participant;
      const socket = this.connectionService.findSocketByUserId(participantId);
      if (socket) {
        socket.emit('deletedChat', {
          chatUuid: id,
        });
      }
    });
  }

  async handleTyping(client: Socket, { chatId, participantId, isTyping }) {
    const userUuid = this.connectionService.getUserIdFromSocket(client);
    if (userUuid) {
      const socket = this.connectionService.findSocketByUserId(participantId);
      if (socket) {
        socket.emit('isFriendTyping', {
          userUuid,
          chatUuid: chatId,
          isTyping: isTyping,
        });
      }
    }
  }
}
