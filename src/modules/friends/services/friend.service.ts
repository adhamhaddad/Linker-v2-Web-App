import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Friend } from '../entities/friend.entity';
import { OrderByCondition, Repository } from 'typeorm';
import { I18nService } from 'nestjs-i18n';
import { ErrorMessages } from 'src/interfaces/error-messages.interface';
import { plainToClass } from 'class-transformer';
import { FriendSerialization } from '../serializers/friend.serialization';
import { User } from 'src/modules/user/entities/user.entity';
import { UserSerialization } from 'src/modules/auth/serializers/user.serialization';
import { IFriend } from '../interfaces/friend.interface';
import { FilterFriendDTO } from '../dto/friends-filter.dto';
import { UserFriendsSerialization } from '../serializers/get-user-friends.serialization';

@Injectable()
export class FriendService {
  constructor(
    @InjectRepository(Friend)
    private readonly friendsRepository: Repository<Friend>,
    private readonly i18nService: I18nService,
  ) {}

  // Helper function to check if users are already friends
  async areUsersFriends(user1: User, user2: User): Promise<boolean> {
    const friend = await this.friendsRepository.findOne({
      where: [
        { user1: { id: user1.id }, user2: { id: user2.id } },
        { user1: { id: user2.id }, user2: { id: user1.id } },
      ],
    });

    return !!friend;
  }

  async getUserFriends(uuid: string) {
    let order: OrderByCondition = {
      'friend.created_at': 'DESC',
    };

    // Create Query Builder
    const qb = this.friendsRepository.createQueryBuilder('friend');

    qb.leftJoinAndSelect('friend.user1', 'user1')
      .leftJoinAndSelect('friend.user2', 'user2')
      .where(
        '((user1.uuid = :uuid AND user2.uuid != :uuid) OR (user2.uuid = :uuid AND user1.uuid != :uuid)) AND (user1.is_online = :online OR user2.is_online = :online)',
        { uuid, online: 'online' },
      );

    // Apply ordering, pagination
    qb.orderBy(order);

    const friends = await qb.getMany();

    const data = friends.map((friend) =>
      this.serializeUserFriends(friend, uuid),
    );

    return { data };
  }

  async getFriends(uuid: string, query: FilterFriendDTO) {
    const selector: Partial<IFriend> = {};
    let order: OrderByCondition = {
      'friend.created_at': 'DESC',
      'profilePicture1.created_at': 'DESC',
      'profilePicture2.created_at': 'DESC',
    };
    query.paginate = query.paginate || 15;
    query.page = query.page || 1;
    const skip = (query.page - 1) * query.paginate;

    // Create Query Builder
    const qb = this.friendsRepository.createQueryBuilder('friend');

    // Apply filters
    if (Object.keys(selector).length > 0) {
      qb.where(selector);
    }

    qb.leftJoinAndSelect('friend.user1', 'user1')
      .leftJoinAndSelect('friend.user2', 'user2')
      .leftJoinAndSelect('user1.profilePicture', 'profilePicture1')
      .leftJoinAndSelect('user2.profilePicture', 'profilePicture2')
      .where(
        '(user1.uuid = :uuid AND user2.uuid != :uuid) OR (user2.uuid = :uuid AND user1.uuid != :uuid)',
        { uuid },
      );

    // Apply ordering, pagination
    qb.orderBy(order).skip(skip).take(query.paginate);

    const [friends, total] = await qb.getManyAndCount();

    const data = friends.map((friend) => this.serializeFriend(friend, uuid));

    return {
      message: total === 0 ? 'No friends found' : 'Friends Received',
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

  serializeUserFriends(friend, uuid) {
    const friendSerialization = plainToClass(UserFriendsSerialization, friend, {
      excludeExtraneousValues: true,
      enableCircularCheck: true,
      strategy: 'excludeAll',
    });

    friendSerialization.user = UserFriendsSerialization.getOtherUser(
      friend,
      uuid,
    );
    return friendSerialization;
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
