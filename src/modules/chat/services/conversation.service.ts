import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { I18nService } from 'nestjs-i18n';
import { plainToClass } from 'class-transformer';
import { ConversationSerialization } from '../serializers/conversation.serialization';
import { ErrorMessages } from 'src/interfaces/error-messages.interface';
import { User } from 'src/modules/user/entities/user.entity';
import { IMessage } from '../interfaces/message.interface';
import { GetConversationSerialization } from '../serializers/get-conversation.serialization';
import { Chat } from '../schemas/chat.schema';

@Injectable()
export class ConversationService {
  constructor(
    @InjectModel('Chat')
    private readonly chatModel: Model<Chat>,
    @InjectModel('Message')
    private readonly messageModel: Model<IMessage>,
    private readonly i18nService: I18nService,
  ) {}

  async checkConversationExist(_id: string, user: User) {
    const chatConversation = await this.chatModel.findOne({
      participants: { $eleMatch: { _id: user.uuid } },
      conversation: _id,
    });

    return chatConversation || false;
  }

  async ReadConversationMessages(_id: string, user: User, lang: string) {
    const errorMessage: ErrorMessages = this.i18nService.translate(
      'error-messages',
      {
        lang,
      },
    );

    const conversation = await this.chatModel.findById({ _id });
    if (!conversation)
      throw new HttpException(
        errorMessage.conversationNotFound,
        HttpStatus.NOT_FOUND,
      );

    const updateMessages = await this.messageModel.updateMany(
      {
        conversationId: _id,
        senderId: { $ne: user.uuid },
        'status.isSeen': false,
      },
      { 'status.isSeen': true },
    );

    const data = this.serializeConversations(updateMessages);
    return {
      data,
    };
  }

  serializeGetConversation(conversation) {
    return plainToClass(GetConversationSerialization, conversation, {
      excludeExtraneousValues: true,
      enableCircularCheck: true,
      strategy: 'excludeAll',
    });
  }

  serializeConversations(conversation) {
    return plainToClass(ConversationSerialization, conversation, {
      excludeExtraneousValues: true,
      enableCircularCheck: true,
      strategy: 'excludeAll',
    });
  }
}
