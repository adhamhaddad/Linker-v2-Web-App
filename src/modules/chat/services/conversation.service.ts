import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { I18nService } from 'nestjs-i18n';
import { plainToClass } from 'class-transformer';
import { IConversation } from '../interfaces/conversation.interface';
import { CreateConversationDto } from '../dto/create-conversation.dto';
import { ConversationSerialization } from '../serializers/conversation.serialization';
import { ErrorMessages } from 'src/interfaces/error-messages.interface';
import { Types } from 'mongoose';
import { v4 as uuidV4 } from 'uuid';
import { User } from 'src/modules/auth/entities/user.entity';
import { IMessage } from '../interfaces/message.interface';

@Injectable()
export class ConversationService {
  constructor(
    @InjectModel('Conversation')
    private readonly conversationModel: Model<IConversation>,
    @InjectModel('Chat')
    private readonly chatModel: Model<IConversation>,
    @InjectModel('Message')
    private readonly messageModel: Model<IMessage>,
    private readonly i18nService: I18nService,
  ) {}

  async createConversation(body: CreateConversationDto, lang: string) {
    const errorMessage: ErrorMessages = this.i18nService.translate(
      'error-messages',
      {
        lang,
      },
    );

    const participants = body.participants.map((participant) => ({
      _id: participant._id,
    }));

    // Initial conversation created with chat creation
    const conversationCreated = {
      _id: uuidV4(),
      chat: body.chatId,
      participants: new Types.DocumentArray(participants),
    };

    const conversation = new this.conversationModel(conversationCreated);
    await conversation.save();
    if (!conversation)
      throw new HttpException(
        errorMessage.failedToCreateConversation,
        HttpStatus.BAD_REQUEST,
      );

    const chat = await this.chatModel.findOneAndUpdate(
      { _id: body.chatId },
      { conversation: conversation._id },
      { new: true },
    );

    return {
      message: errorMessage.conversationCreatedSuccessfully,
      data: this.serializeConversations(conversation),
    };
  }

  async ReadConversationMessages(_id: string, user: User, lang: string) {
    const errorMessage: ErrorMessages = this.i18nService.translate(
      'error-messages',
      {
        lang,
      },
    );

    const conversation = await this.conversationModel.findById({ _id });
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

  serializeConversations(conversation) {
    return plainToClass(ConversationSerialization, conversation, {
      excludeExtraneousValues: true,
      enableCircularCheck: true,
      strategy: 'excludeAll',
    });
  }
}
