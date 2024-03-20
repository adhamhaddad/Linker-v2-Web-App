import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { I18nService } from 'nestjs-i18n';
import { User } from 'src/modules/user/entities/user.entity';
import { plainToClass } from 'class-transformer';
import { CreateMessageDto } from '../dto/create-message.dto';
import { FilterMessageDTO } from '../dto/filter-messages.dto';
import { IMessage } from '../interfaces/message.interface';
import { MessageSerialization } from '../serializers/message.serialization';
import { ErrorMessages } from 'src/interfaces/error-messages.interface';
import { IConversation } from '../interfaces/conversation.interface';
import { UpdateMessageDto } from '../dto/update-message.dto';
import { DeleteMessageDto, DeleteMessageType } from '../dto/delete-message.dto';
import { IChat } from '../interfaces/chat.interface';
import { v4 as uuidV4 } from 'uuid';
import { UpdateMessageStatusDto } from '../dto/update-message-status.dto';
import { ConversationService } from './conversation.service';
import { Chat } from '../schemas/chat.schema';
import { Message } from '../schemas/message.schema';

@Injectable()
export class MessageService {
  constructor(
    @InjectModel('Chat')
    private readonly chatModel: Model<Chat>,
    @InjectModel('Message')
    private readonly messageModel: Model<IMessage>,
    private readonly conversationService: ConversationService,
    private readonly i18nService: I18nService,
  ) {}

  async createMessage(
    _id: string,
    body: CreateMessageDto,
    user: User,
    lang: string,
  ) {
    const errorMessage: ErrorMessages = this.i18nService.translate(
      'error-messages',
      {
        lang,
      },
    );

    const chat = await this.conversationService.checkConversationExist(
      _id,
      user,
    );
    if (!chat)
      throw new HttpException(errorMessage.chatNotFound, HttpStatus.NOT_FOUND);

    const messageCreated = {
      _id: uuidV4(),
      conversation: chat.conversation._id,
      senderId: user.uuid,
      message: body.message,
      attachments: body.attachments,
    };

    const message = new this.messageModel(messageCreated);
    await message.save();
    if (!message)
      throw new HttpException(
        errorMessage.failedToCreateMessage,
        HttpStatus.BAD_REQUEST,
      );

    message.chatId = chat._id;
    message.participants = chat.participants;
    const data = this.serializeMessages(message);

    return {
      message: errorMessage.messageCreatedSuccessfully,
      data,
    };
  }

  async getMessages(
    _id: string,
    query: FilterMessageDTO,
    user: User,
    lang: string,
  ) {
    const errorMessage: ErrorMessages = this.i18nService.translate(
      'error-messages',
      {
        lang,
      },
    );

    const chat = await this.conversationService.checkConversationExist(
      _id,
      user,
    );
    if (!chat)
      throw new HttpException(errorMessage.chatNotFound, HttpStatus.NOT_FOUND);

    const keyword = query.filter?.keyword;

    query.paginate = query.paginate || 15;
    query.page = query.page || 1;
    const skip = (query.page - 1) * query.paginate;

    // Sort
    let sort: any = { createdAt: -1 };

    if (query.sort) {
      const orderDirection = query.sort.startsWith('-') ? -1 : 1;
      const orderKey = query.sort.replace(/^-/, '');

      const messageFieldsMap = { message: 'message.message' };

      if (messageFieldsMap[orderKey]) {
        sort = { [messageFieldsMap[orderKey]]: orderDirection };
      }
    }

    // Apply filters
    const filters: any = { conversation: chat.conversation._id };

    // Condition to exclude messages where userId is in any deletedFrom array objects
    filters.deletedFrom = { $not: { $elemMatch: { _id: user.uuid } } };
    filters.deletedAt = null;

    if (keyword) {
      filters['message.message'] = new RegExp(keyword, 'i');
    }

    // Find messages
    const messages = await this.messageModel
      .find({ ...filters })
      .sort(sort)
      .skip(skip)
      .limit(query.paginate)
      .exec();

    const total = await this.messageModel.countDocuments(filters);

    const data = messages.map((message) => this.serializeMessages(message));

    return {
      data,
      total,
      meta: {
        total,
        currentPage: query.page,
        eachPage: query.paginate,
        lastPage: Math.ceil(total / query.paginate),
      },
    };
  }

  async updateMessage(
    _id: string,
    body: UpdateMessageDto,
    user: User,
    lang: string,
  ) {
    const errorMessage: ErrorMessages = this.i18nService.translate(
      'error-messages',
      {
        lang,
      },
    );

    const message = await this.messageModel.findOneAndUpdate(
      { _id, senderId: user.uuid },
      { message: body.message },
      { new: true },
    );

    if (!message)
      throw new HttpException(
        errorMessage.messageNotFound,
        HttpStatus.NOT_FOUND,
      );

    return {
      message: errorMessage.messageUpdatedSuccessfully,
      data: this.serializeMessages(message),
    };
  }

  async updateMessageStatus(
    chatId: string,
    body: UpdateMessageStatusDto,
    user: User,
    lang: string,
  ) {
    const errorMessage: ErrorMessages = this.i18nService.translate(
      'error-messages',
      {
        lang,
      },
    );

    const chat = await this.chatModel.findOne({ _id: chatId });
    if (!chat)
      throw new HttpException(errorMessage.chatNotFound, HttpStatus.NOT_FOUND);

    const updateQuery = {
      conversationId: chat.conversation,
      senderId: { $ne: user.uuid },
    };
    const updateFields = {};

    if (body.status === 'isSeen') {
      updateFields['status.isDelivered'] = true;
      updateFields[`status.${body.status}`] = true;
    } else {
      updateFields['status.isDelivered'] = true;
    }

    await this.messageModel.updateMany(updateQuery, updateFields);
  }

  async deleteAllMessages(_id: string, user: User, lang: string) {}

  async deleteMessage(
    _id: string,
    conversationUuid: string,
    query: DeleteMessageDto,
    user: User,
    lang: string,
  ) {
    const errorMessage: ErrorMessages = this.i18nService.translate(
      'error-messages',
      {
        lang,
      },
    );

    const condition: any = {
      _id,
      deletedFrom: { $not: { $elemMatch: { _id: user.uuid } } },
      deletedAt: null,
    };
    const filter: any = {};

    if (query.deleteFrom === DeleteMessageType.ME) {
      // Mark messages as deleted for userId
      filter.$addToSet = { deletedFrom: { _id: user.uuid } };
    } else {
      // Mark all message as deletedAt = Date.now()
      // Remove message for everyone if the message senderId = user.uuid
      const chat = await this.conversationService.checkConversationExist(
        conversationUuid,
        user,
      );
      if (!chat)
        throw new HttpException(
          errorMessage.chatNotFound,
          HttpStatus.NOT_FOUND,
        );

      const participants = chat.participants.map(
        (participant) => participant._id,
      );

      filter.$addToSet = {
        deletedFrom: participants.map((id) => ({ _id: id })),
      };
      filter.$set = { deletedAt: Date.now() };
    }

    const message = await this.messageModel.findOneAndUpdate(
      condition,
      filter,
      { new: true },
    );

    if (!message)
      throw new HttpException(
        errorMessage.messageNotFound,
        HttpStatus.NOT_FOUND,
      );

    message.participants = message.deletedFrom;
    const data = this.serializeMessages(message);

    return {
      message: errorMessage.messageDeletedSuccessfully,
      data,
    };
  }

  serializeMessages(message) {
    return plainToClass(MessageSerialization, message, {
      excludeExtraneousValues: true,
      enableCircularCheck: true,
      strategy: 'excludeAll',
    });
  }
}
