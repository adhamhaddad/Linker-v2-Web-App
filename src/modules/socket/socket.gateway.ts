import {
  OnGatewayConnection,
  OnGatewayDisconnect,
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { ConnectionService } from './services/connection.service';
import { RequestSocketService } from './services/request-ws.service';
import { ChatSocketService } from './services/chat-ws.service';
import { MessageSocketService } from './services/message-ws.service';
import { PreOfferSocketService } from './services/offers-ws.service';

@WebSocketGateway({ cors: { origin: ['http://localhost:3000'] } })
export class SocketGateway implements OnGatewayConnection, OnGatewayDisconnect {
  @WebSocketServer()
  server: Server;

  constructor(
    private readonly connectionService: ConnectionService,
    private readonly requestSocketService: RequestSocketService,
    private readonly chatSocketService: ChatSocketService,
    private readonly messageSocketService: MessageSocketService,
    private readonly preOfferSocketService: PreOfferSocketService,
  ) {}

  // Handle connection
  async handleConnection(client: Socket) {
    await this.connectionService.handleConnection(client);
  }

  // Handle disconnect
  async handleDisconnect(client: Socket) {
    await this.connectionService.handleDisconnect(client);
  }

  // Handle new request
  async handleNewRequest(data: any) {
    await this.requestSocketService.handleNewRequest(data);
  }

  // Handle updated request
  async handleUpdatedRequest(data: any) {
    await this.requestSocketService.handleUpdatedRequest(data);
  }

  // Handle new message
  @SubscribeMessage('newMessage')
  async handleNewMessage(data: any) {
    await this.messageSocketService.handleNewMessage(data);
  }

  // Handle update message
  async handleUpdateMessage(data: any) {
    await this.messageSocketService.handleUpdateMessage(data);
  }

  // Handle delete message
  async handleDeleteMessage(data: any) {
    await this.messageSocketService.handleDeleteMessage(data);
  }

  // Handle delete conversation
  async handleDeleteConversation(data: any) {
    await this.chatSocketService.handleDeleteConversation(data);
  }

  // Handle delete chat
  async handleDeleteChat(data: any) {
    await this.chatSocketService.handleDeleteChat(data);
  }

  // Handle typing
  @SubscribeMessage('typing')
  async handleTyping(client: Socket, data: any) {
    await this.chatSocketService.handleTyping(client, data);
  }

  // Handle pre-offer
  @SubscribeMessage('pre-offer')
  async handlePreOffer(client: Socket, data: any) {
    await this.preOfferSocketService.handlePreOffer(client, data);
  }

  // Handle close offer
  @SubscribeMessage('close-offer')
  async handleCloseOffer(client: Socket, data: any) {
    await this.preOfferSocketService.handleCloseOffer(client, data);
  }

  // Handle pre-offer-accept
  @SubscribeMessage('pre-offer-accept')
  async handleAcceptOffer(client: Socket, data: any) {
    await this.preOfferSocketService.handleAcceptOffer(client, data);
  }

  // Handle pre-offer rejected
  @SubscribeMessage('pre-offer-reject')
  async handleRejectOffer(client: Socket, data: any) {
    await this.preOfferSocketService.handleRejectOffer(client, data);
  }
}
