import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Friend } from '../entities/friend.entity';
import { Repository } from 'typeorm';
import { I18nService } from 'nestjs-i18n';
import { ErrorMessages } from 'src/interfaces/error-messages.interface';
import { plainToClass } from 'class-transformer';
import { FriendSerialization } from '../serializers/friend.serialization';
import { User } from 'src/modules/auth/entities/user.entity';
import { UserSerialization } from 'src/modules/auth/serializers/user.serialization';

@Injectable()
export class FriendsService {
  constructor(
    @InjectRepository(Friend)
    private readonly friendsRepository: Repository<Friend>,
    private readonly i18nService: I18nService,
  ) {}

  async getFriends(uuid: string, lang: string) {
    const errorMessage: ErrorMessages = this.i18nService.translate(
      'error-messages',
      {
        lang,
      },
    );

    const friends = await this.friendsRepository
      .createQueryBuilder('friend')
      .leftJoinAndSelect('friend.user1', 'user1')
      .leftJoinAndSelect('friend.user2', 'user2')
      .where(
        '(user1.uuid = :uuid AND user2.uuid != :uuid) OR (user2.uuid = :uuid AND user1.uuid != :uuid)',
        { uuid },
      )
      .getMany();

    if (friends.length === 0)
      throw new HttpException(
        errorMessage.noFriendsFound,
        HttpStatus.NOT_FOUND,
      );

    return {
      message: 'Friends Received',
      data: friends.map((friend) => this.serializeFriend(friend, uuid)),
      total: friends.length,
      meta: {
        total: friends.length,
      },
    };
  }

  async deleteFriend(uuid: string, user: User, lang: string) {
    const errorMessage: ErrorMessages = this.i18nService.translate(
      'error-messages',
      {
        lang,
      },
    );

    const friend = await this.friendsRepository.findOne({ where: { uuid } });
    if (!friend)
      throw new HttpException(
        errorMessage.friendNotFound,
        HttpStatus.NOT_FOUND,
      );

    const { affected } = await this.friendsRepository.delete({ uuid });
    if (!affected)
      throw new HttpException(
        errorMessage.failedToDeleteFriend,
        HttpStatus.BAD_REQUEST,
      );

    return {
      message: errorMessage.friendDeletedSuccessfully,
      data: friend,
    };
  }

  serializeFriend(friend, uuid) {
    const friendSerialization = plainToClass(FriendSerialization, friend, {
      excludeExtraneousValues: true,
      enableCircularCheck: true,
      strategy: 'excludeAll',
    });

    friendSerialization.user = FriendSerialization.getOtherUser(friend, uuid);
    return friendSerialization;
  }

  serializeUser(user) {
    return plainToClass(UserSerialization, user, {
      excludeExtraneousValues: true,
      enableCircularCheck: true,
      strategy: 'excludeAll',
    });
  }
}
