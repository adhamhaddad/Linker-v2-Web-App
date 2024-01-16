import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { I18nService } from 'nestjs-i18n';
import { User } from 'src/modules/auth/entities/user.entity';
import { plainToClass } from 'class-transformer';
import { IChat } from '../interfaces/chat.interface';
import { CreateChatDto } from '../dto/create-chat.dto';
import { UpdateChatDto } from '../dto/update-chat.dto';
import { ChatSerialization } from '../serializers/chat.serialization';
import { ErrorMessages } from 'src/interfaces/error-messages.interface';
import { ConversationService } from './conversation.service';
import { DeleteChatDto, DeleteChatType } from '../dto/delete-chat.dto';
import { IMessage } from '../interfaces/message.interface';
import { v4 as uuidV4 } from 'uuid';
import { FilterChatDTO } from '../dto/filter-chats.dto';

@Injectable()
export class ChatService {
  constructor(
    @InjectModel('Chat')
    private readonly chatModel: Model<IChat>,
    @InjectModel('Message')
    private readonly messageModel: Model<IMessage>,
    private readonly conversationService: ConversationService,
    private readonly i18nService: I18nService,
  ) {}

  async checkChatExist(user_id1: number, user_id2: number) {
    const chat = await this.chatModel.findOne({
      participants: { $all: [{ _id: user_id1 }, { _id: user_id2 }] },
    });

    return chat || false;
  }

  async createChat(body: CreateChatDto, user: User, lang: string) {
    const errorMessage: ErrorMessages = this.i18nService.translate(
      'error-messages',
      {
        lang,
      },
    );

    const isChatExist = await this.checkChatExist(user.id, body.userId);
    if (isChatExist)
      return {
        message: errorMessage.chatAlreadyExist,
        data: this.serializeChats(isChatExist),
      };

    // Initial chat created with friendship creation
    const chatCreated = {
      _id: uuidV4(),
      participants: [{ _id: user.id }, { _id: body.userId }],
      type: body.type,
    };

    const chat = new this.chatModel(chatCreated);
    await chat.save();
    if (!chat)
      throw new HttpException(
        errorMessage.failedToCreateChat,
        HttpStatus.BAD_REQUEST,
      );

    await this.conversationService.createConversation(
      { chatId: chat._id, participants: chat.participants },
      lang,
    );

    return {
      message: errorMessage.chatCreatedSuccessfully,
      data: this.serializeChats(chat),
    };
  }

  async getChats(query: FilterChatDTO, user: User) {
    const keyword = query.filter?.keyword;
    const archived = query.filter?.archived || false;

    query.paginate = query.paginate || 15;
    query.page = query.page || 1;
    const skip = (query.page - 1) * query.paginate;

    // Sort
    let sort: any = { 'messages.createdAt': -1 };

    if (query.sort) {
      const orderDirection = query.sort.startsWith('-') ? -1 : 1;
      const orderKey = query.sort.replace(/^-/, '');

      const chatFieldsMap = { createdAt: 'messages.createdAt' };

      if (chatFieldsMap[orderKey]) {
        sort = { [chatFieldsMap[orderKey]]: orderDirection };
      }
    }

    // Apply filters
    const filters: any = {
      participants: {
        $elemMatch: {
          _id: user.id,
          isArchived: archived,
        },
      },
      deletedFrom: { $not: { $elemMatch: { _id: user.id } } },
    };

    if (keyword) {
      filters['$or'] = [
        { 'groupDetails.name': new RegExp(keyword, 'i') },
        { 'groupDetails.creatorId': new RegExp(keyword, 'i') },
      ];
    }

    // Find chats
    const chats = await this.chatModel
      .aggregate([
        {
          $match: filters,
        },
        {
          $lookup: {
            from: 'messages',
            localField: 'conversation',
            foreignField: 'conversationId',
            as: 'messages',
          },
        },
        {
          $addFields: {
            messages: {
              $cond: {
                if: { $eq: [{ $size: '$messages' }, 0] },
                then: [],
                else: {
                  $slice: [
                    {
                      $filter: {
                        input: '$messages',
                        as: 'message',
                        cond: {
                          $and: [
                            {
                              $eq: [
                                '$$message.conversationId',
                                '$conversation',
                              ],
                            },
                            {
                              $not: {
                                $in: [user.id, '$$message.deletedFrom._id'],
                              },
                            },
                            {
                              $eq: ['$$message.deletedAt', null],
                            },
                          ],
                        },
                      },
                    },
                    -1,
                  ],
                },
              },
            },
          },
        },
        {
          $sort: { 'messages.createdAt': -1 },
        },
        {
          $project: {
            type: 1,
            groupDetails: 1,
            participants: 1,
            conversation: 1,
            wallpaper: 1,
            deletedFrom: 1,
            messages: 1,
          },
        },
      ])
      .sort(sort)
      .skip(skip)
      .limit(query.paginate)
      .exec();

    const total = await this.chatModel.countDocuments(filters);

    const data = chats.map((chat) => this.serializeChats(chat));

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

  async getChatById(_id: string, user: User, lang: string) {
    const errorMessage: ErrorMessages = this.i18nService.translate(
      'error-messages',
      {
        lang,
      },
    );

    const chat = await this.chatModel
      .findById(_id)
      .populate('conversation')
      .select({
        deletedFrom: 0,
        updatedAt: 0,
        __v: 0,
      });

    if (!chat)
      throw new HttpException(errorMessage.chatNotFound, HttpStatus.NOT_FOUND);

    return { data: this.serializeChats(chat) };
  }

  async updateChat(_id: string, body: UpdateChatDto, user: User, lang: string) {
    const errorMessage: ErrorMessages = this.i18nService.translate(
      'error-messages',
      {
        lang,
      },
    );

    const chat = await this.chatModel.findOneAndUpdate(
      { _id, participants: { $elemMatch: { _id: user.id } } },
      { participants: { isMuted: body.isMuted } },
      { new: true },
    );

    if (!chat)
      throw new HttpException(errorMessage.chatNotFound, HttpStatus.NOT_FOUND);

    return {
      message: errorMessage.chatUpdatedSuccessfully,
      data: this.serializeChats(chat),
    };
  }

  async deleteChat(
    _id: string,
    query: DeleteChatDto,
    user: User,
    lang: string,
  ) {
    const errorMessage: ErrorMessages = this.i18nService.translate(
      'error-messages',
      {
        lang,
      },
    );
    const chat = await this.chatModel
      .findById({ _id })
      .populate('conversation');
    if (!chat)
      throw new HttpException(errorMessage.chatNotFound, HttpStatus.NOT_FOUND);

    const filter: any = {};

    if (query.deleteFrom === DeleteChatType.ME) {
      // Mark all messages as deleted for userId
      await this.messageModel.updateMany(
        { conversationId: chat.conversation._id },
        { $addToSet: { deletedFrom: { _id: user.id } } },
      );
      filter.$addToSet = { deletedFrom: { _id: user.id } };
    } else {
      // Mark all message as deletedAt = Date.now()
      await this.messageModel.updateMany(
        { conversationId: chat.conversation._id },
        { $set: { deletedAt: Date.now() } },
      );
      filter.$set = {
        deletedFrom: chat.participants.map((participant) => ({
          _id: participant._id,
        })),
      };
    }

    const deletedChat = await this.chatModel.updateOne(
      {
        _id,
        deletedFrom: { $not: { $elemMatch: { _id: user.id } } },
      },
      filter,
      { new: true },
    );
    if (!deletedChat)
      throw new HttpException(
        errorMessage.failedToDeleteChat,
        HttpStatus.NOT_FOUND,
      );

    return {
      message: errorMessage.chatDeletedSuccessfully,
      data: this.serializeChats(deletedChat),
    };
  }

  serializeChats(chat) {
    return plainToClass(ChatSerialization, chat, {
      excludeExtraneousValues: true,
      enableCircularCheck: true,
      strategy: 'excludeAll',
    });
  }
}
