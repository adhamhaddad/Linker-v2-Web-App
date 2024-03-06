import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { I18nService } from 'nestjs-i18n';
import { User } from 'src/modules/user/entities/user.entity';
import { plainToClass } from 'class-transformer';
import { IChat } from '../interfaces/chat.interface';
import { CreateGroupChatDto } from '../dto/create-group.dto';
import { UpdateGroupChatDto } from '../dto/update-group.dto';
import { FilterMessageDTO } from '../dto/filter-messages.dto';
import { ChatSerialization } from '../serializers/chat.serialization';
import { ErrorMessages } from 'src/interfaces/error-messages.interface';

@Injectable()
export class ChatGroupService {
  constructor(
    @InjectModel('Chat')
    private readonly chatModel: Model<IChat>,
    private readonly i18nService: I18nService,
  ) {}

  async createGroupChat(body: CreateGroupChatDto, user: User, lang: string) {
    const errorMessage: ErrorMessages = this.i18nService.translate(
      'error-messages',
      {
        lang,
      },
    );

    // TODO: Get all users from participants.

    const groupCreated = {
      participants: [{ _id: user.uuid }],
      type: body.type,
      groupDetails: {
        icon: body.icon,
        name: body.name,
        creatorId: user.uuid,
        status: body.status,
      },
    };

    const group = new this.chatModel(groupCreated);
    await group.save();
    if (!group)
      throw new HttpException(
        errorMessage.failedToCreateGroupChat,
        HttpStatus.BAD_REQUEST,
      );

    return {
      message: errorMessage.groupChatCreatedSuccessfully,
      data: this.serializeGroupChats(group),
    };
  }

  async getGroupChats(query: FilterMessageDTO, user: User) {
    const keyword = query.filter?.keyword;

    query.paginate = query.paginate || 15;
    query.page = query.page || 1;
    const skip = (query.page - 1) * query.paginate;

    // Sort
    let sort: any = { created_at: -1 };

    if (query.sort) {
      const orderDirection = query.sort.startsWith('-') ? -1 : 1;
      const orderKey = query.sort.replace(/^-/, '');

      const messageFieldsMap = { chat: 'chat.message' };

      if (messageFieldsMap[orderKey]) {
        sort = { [messageFieldsMap[orderKey]]: orderDirection };
      }
    }

    // Apply filters
    const filters: any = { userId: user.uuid };

    if (keyword) {
      filters['chat.message'] = new RegExp(keyword, 'i');
    }

    // Find chats
    const chats = await this.chatModel
      .find({ ...filters })
      .sort(sort)
      .skip(skip)
      .limit(query.paginate)
      .exec();

    const total = await this.chatModel.countDocuments(filters);

    const data = chats.map((chat) => this.serializeGroupChats(chat));

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

  async getGroupChatById(uuid: string, user: User, lang: string) {
    const errorMessage: ErrorMessages = this.i18nService.translate(
      'error-messages',
      {
        lang,
      },
    );

    const chat = await this.chatModel
      .findOne({ uuid, user_id: user.uuid })
      .populate('conversations');

    if (!chat)
      throw new HttpException(errorMessage.chatNotFound, HttpStatus.NOT_FOUND);

    return {
      data: this.serializeGroupChats(chat),
    };
  }

  async updateGroupChat(
    uuid: string,
    body: UpdateGroupChatDto,
    user: User,
    lang: string,
  ) {
    const errorMessage: ErrorMessages = this.i18nService.translate(
      'error-messages',
      {
        lang,
      },
    );

    const chat = await this.chatModel.findOneAndUpdate(
      { uuid, userId: user.uuid },
      {
        groupDetails: {
          icon: body.icon,
          name: body.name,
        },
        updated_at: Date.now,
      },
      { new: true },
    );

    if (!chat)
      throw new HttpException(
        errorMessage.groupChatNotFound,
        HttpStatus.NOT_FOUND,
      );

    return {
      message: errorMessage.groupChatUpdatedSuccessfully,
      data: this.serializeGroupChats(chat),
    };
  }

  async deleteGroupChat(uuid: string, user: User, lang: string) {
    const errorMessage: ErrorMessages = this.i18nService.translate(
      'error-messages',
      {
        lang,
      },
    );

    const chat = await this.chatModel.findOneAndUpdate(
      { uuid, userId: user.uuid },
      { deletedAt: Date.now() },
      { new: true },
    );

    if (!chat)
      throw new HttpException(errorMessage.chatNotFound, HttpStatus.NOT_FOUND);

    return {
      message: errorMessage.chatDeletedSuccessfully,
      data: this.serializeGroupChats(chat),
    };
  }

  serializeGroupChats(group) {
    return plainToClass(ChatSerialization, group, {
      excludeExtraneousValues: true,
      enableCircularCheck: true,
      strategy: 'excludeAll',
    });
  }
}
