import { ChatService } from '@modules/chat/services/chat.service';
import { ProfileService } from '@modules/profile/services/profile.service';
import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { ConnectionService } from '@socket/services/connection.service';
import { Socket } from 'socket.io';

enum RoomStatus {
  ACTIVE = 'active',
  REQUESTING = 'requesting',
  RINGING = 'ringing',
  BUSY = 'busy',
}
enum RoomType {
  PHONE = 'PHONE_CALL',
  VIDEO = 'VIDEO_CALL',
}

@Injectable()
export class PreOfferSocketService {
  constructor(
    private readonly connectionService: ConnectionService,
    private readonly profileService: ProfileService,
    private readonly chatService: ChatService,
  ) {}

  private activePeers: {
    id: string;
    joinedParticipant: Socket[];
    sender: string;
    recipient: string;
    timer: number | null;
    type: RoomType;
    status: RoomStatus;
  }[] = [];

  async handlePreOffer(client: Socket, payload: any) {
    const userUuid = this.connectionService.getUserIdFromSocket(client);
    if (!userUuid) {
      return client.disconnect();
    }

    const data = await this.profileService.getProfileByUserId(userUuid);
    if (!data) {
      return client.disconnect();
    }

    const { type, chatUuid } = payload;

    const chat = await this.chatService.findOne(chatUuid, userUuid);
    if (!chat) return;

    // Get other participant
    const participant = chat.participants.filter(
      (participant) => participant._id !== userUuid,
    )[0]._id;

    // Check that the chat room not exist
    const isRoomExist = this.activePeers.find((room) => room.id === chatUuid);
    if (isRoomExist) return;

    // Create new chat room
    const room = {
      id: chatUuid,
      joinedParticipant: [client],
      sender: userUuid,
      recipient: participant,
      timer: null,
      type: RoomType.PHONE,
      status: RoomStatus.REQUESTING,
      createdAt: Date.now(),
    };
    this.activePeers.push(room);

    // Get other participant socket
    const socket = this.connectionService.findSocketByUserId(participant);
    if (socket) {
      // Get the chat room
      const room = this.activePeers.find((room) => room.id === chatUuid);

      // Check that the participant is idle
      const isIDLE = this.activePeers.find((room) => {
        const exist = room.joinedParticipant.find(
          (socket) => socket.id === participant,
        );
        if (exist) true;
      });
      if (isIDLE) room.status = RoomStatus.BUSY;

      if (room) {
        // Change the chat room  status to ringing
        room.status = RoomStatus.RINGING;
        socket.emit('pre-offer', {
          id: room.id,
          type: room.type,
          status: room.status,
          participant: data,
        });
        client.emit('ringing', {
          id: room.id,
          type: room.type,
          status: room.status,
        });
      }
    }
  }

  async handleAcceptOffer(client: Socket, data: any) {
    const userUuid = this.connectionService.getUserIdFromSocket(client);
    if (!userUuid) {
      return client.disconnect();
    }

    const { chatUuid } = data;

    const chat = await this.chatService.findOne(chatUuid, userUuid);
    if (!chat) return;

    // Get the chat room
    const room = this.activePeers.find((room) => room.id === chatUuid);
    if (room) {
      // Change the chat room status to active
      room.status = RoomStatus.ACTIVE;
      // Change the room timer
      room.timer = 0;
      // Change the chat room participants
      room.joinedParticipant.push(client);
    }

    // Get other participant socket
    room.joinedParticipant.forEach((socket) => {
      if (socket) {
        socket.emit('pre-offer-accepted', {
          id: room.id,
          type: room.type,
          status: room.status,
          timer: room.timer,
        });
      }
    });
  }

  async handleRejectOffer(client: Socket, data: any) {
    const { chatUuid } = data;

    // TODO
    // Get the chat room
    const room = this.activePeers.find((room) => room.id === chatUuid);
    if (room) {
      // Remove the chat room
      this.activePeers.filter((room) => room.id === chatUuid);
      this.getActiveRooms();
    }
  }

  async handleCloseOffer(client: Socket, data: any) {
    const { time, participantId } = data;

    // TODO
    const socket = this.connectionService.findSocketByUserId(participantId);
    if (socket) {
      socket.emit('close-offer', {
        time,
        userUuid: client.handshake.query.id,
        status: 'closed',
      });
    }
  }

  public getActiveRooms() {
    console.log(this.activePeers);
    return this.activePeers;
  }
}
