import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { I18nService } from 'nestjs-i18n';
import { User } from 'src/modules/auth/entities/user.entity';
import { plainToClass } from 'class-transformer';
import { IChat } from '../interfaces/chat.interface';
import { ChatSerialization } from '../serializers/chat.serialization';
import { ErrorMessages } from 'src/interfaces/error-messages.interface';

@Injectable()
export class ChatArchiveService {
  constructor(
    @InjectModel('Chat')
    private readonly chatModel: Model<IChat>,
    private readonly i18nService: I18nService,
  ) {}

  async archiveChat(_id: string, user: User, lang: string) {
    const errorMessage: ErrorMessages = this.i18nService.translate(
      'error-messages',
      {
        lang,
      },
    );

    const archivedChat = await this.chatModel.findOneAndUpdate(
      { _id, 'participants._id': user.uuid },
      { $set: { 'participants.$.isArchived': true } },
      { new: true },
    );

    if (!archivedChat)
      throw new HttpException(
        errorMessage.failedToArchiveChat,
        HttpStatus.BAD_REQUEST,
      );

    return {
      message: errorMessage.chatArchivedSuccessfully,
      data: this.serializeArchivedChats(archivedChat),
    };
  }

  async unArchiveChat(_id: string, user: User, lang: string) {
    const errorMessage: ErrorMessages = this.i18nService.translate(
      'error-messages',
      {
        lang,
      },
    );

    const archivedChat = await this.chatModel.findOneAndUpdate(
      { _id, 'participants._id': user.uuid },
      { $set: { 'participants.$.isArchived': false } },
      { new: true },
    );

    if (!archivedChat)
      throw new HttpException(errorMessage.chatNotFound, HttpStatus.NOT_FOUND);

    return {
      message: errorMessage.chatUnArchivedSuccessfully,
      data: this.serializeArchivedChats(archivedChat),
    };
  }

  serializeArchivedChats(chat) {
    return plainToClass(ChatSerialization, chat, {
      excludeExtraneousValues: true,
      enableCircularCheck: true,
      strategy: 'excludeAll',
    });
  }
}
