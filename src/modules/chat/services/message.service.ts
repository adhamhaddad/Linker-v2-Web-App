import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { I18nService } from 'nestjs-i18n';
import { User } from 'src/modules/auth/entities/user.entity';
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

@Injectable()
export class MessageService {
  constructor(
    @InjectModel('Message')
    private readonly messageModel: Model<IMessage>,
    @InjectModel('Conversation')
    private readonly conversationModel: Model<IConversation>,
    @InjectModel('Chat')
    private readonly chatModel: Model<IChat>,
    private readonly i18nService: I18nService,
  ) {}

  // Helper function to check that the conversation exist
  async checkConversation(_id: string, user: User, lang: string) {
    const errorMessage: ErrorMessages = this.i18nService.translate(
      'error-messages',
      {
        lang,
      },
    );

    const conversation = await this.conversationModel
      .findOne({ _id, participants: { $elemMatch: { _id: user.id } } })
      .populate('chat')
      .exec();

    if (!conversation)
      throw new HttpException(
        errorMessage.conversationNotFound,
        HttpStatus.NOT_FOUND,
      );

    const chat: Partial<IChat> = conversation.chat;
    if (!chat)
      throw new HttpException(errorMessage.chatNotFound, HttpStatus.NOT_FOUND);

    if (chat.deletedFrom.length)
      await this.chatModel.updateOne(
        { _id: chat._id },
        { $set: { deletedFrom: [] } },
      );

    return conversation;
  }

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

    const conversation = await this.checkConversation(_id, user, lang);

    const messageCreated = {
      _id: uuidV4(),
      conversationId: conversation._id,
      userId: user.id,
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

    return {
      message: errorMessage.messageCreatedSuccessfully,
      data: this.serializeMessages(message),
    };
  }

  async getMessages(
    _id: string,
    query: FilterMessageDTO,
    user: User,
    lang: string,
  ) {
    const conversation = await this.checkConversation(_id, user, lang);

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
    const filters: any = { conversationId: conversation._id };

    // Condition to exclude messages where userId is in any deletedFrom array objects
    filters.deletedFrom = { $not: { $elemMatch: { _id: user.id } } };
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
      { _id, userId: user.id },
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

  async deleteMessage(
    _id: string,
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
      deletedFrom: { $not: { $elemMatch: { _id: user.id } } },
      deletedAt: null,
    };
    const filter: any = {};

    if (query.deleteFrom === DeleteMessageType.ME) {
      // Mark messages as deleted for userId
      filter.$addToSet = { deletedFrom: { _id: user.id } };
    } else {
      // Mark all message as deletedAt = Date.now()
      // Remove message for everyone if the message userId = user.id
      // condition.userId = user.id;
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

    return {
      message: errorMessage.messageDeletedSuccessfully,
      data: this.serializeMessages(message),
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