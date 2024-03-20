import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { FriendRequest } from '../entities/friend-request.entity';
import { OrderByCondition, Repository } from 'typeorm';
import { Friend } from '../entities/friend.entity';
import { User } from 'src/modules/user/entities/user.entity';
import { I18nService } from 'nestjs-i18n';
import { ErrorMessages } from 'src/interfaces/error-messages.interface';
import { RequestStatus } from 'src/constants/request-status';
import { plainToClass } from 'class-transformer';
import { FriendRequestSerialization } from '../serializers/friend-request.serialization';
import { FriendSerialization } from '../serializers/friend.serialization';
import {
  UpdateRequestStatusDto,
  UpdateRequestStatus,
} from '../dto/update-request-status.dto';
import { UpdateFriendRequestSerialization } from '../serializers/update-friend-request.serialization';
import { IFriendRequest } from '../interfaces/friend-request.interface';
import { FilterFriendRequestDTO } from '../dto/requests-filter.dto';
import { GetFriendRequestSerialization } from '../serializers/get-friend-request.serialization';
import { ChatService } from '@modules/chat/services/chat.service';
import { ChatType } from '@modules/chat/interfaces/chat.interface';
import { UserService } from '@modules/user/services/user.service';

@Injectable()
export class FriendRequestService {
  constructor(
    @InjectRepository(FriendRequest)
    private readonly friendRequestRepository: Repository<FriendRequest>,
    @InjectRepository(Friend)
    private readonly friendsRepository: Repository<Friend>,
    private readonly userService: UserService,
    private readonly chatService: ChatService,
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

  // Helper function to check if a friend request is already sent
  async isFriendRequestSent(
    requester: User,
    recipient: User,
  ): Promise<boolean> {
    const friendRequest = await this.friendRequestRepository.findOne({
      where: [
        {
          requester: { id: requester.id },
          recipient: { id: recipient.id },
          status: RequestStatus.PENDING,
        },
        {
          requester: { id: recipient.id },
          recipient: { id: requester.id },
          status: RequestStatus.PENDING,
        },
      ],
    });

    return !!friendRequest;
  }

  // Helper function to check if a friend request is already sent
  async isRequested(
    requester: User,
    recipient: User,
  ): Promise<FriendRequest | boolean> {
    const friendRequest = await this.friendRequestRepository.findOne({
      where: [
        {
          requester: { id: requester.id },
          recipient: { id: recipient.id },
          status: RequestStatus.PENDING,
        },
        {
          requester: { id: recipient.id },
          recipient: { id: requester.id },
          status: RequestStatus.PENDING,
        },
      ],
      relations: ['requester'],
    });

    return friendRequest || false;
  }

  async sendFriendRequest(recipientUuid: string, user: User, lang: string) {
    const errorMessage: ErrorMessages = this.i18nService.translate(
      'error-messages',
      {
        lang,
      },
    );
    // Check if the recipientUuid is the same as the user's UUID
    if (recipientUuid === user.uuid) {
      throw new HttpException(
        errorMessage.cannotSendRequestToYourself,
        HttpStatus.BAD_REQUEST,
      );
    }

    // Check user exist
    const receiverUser = await this.userService.findOne(recipientUuid, lang);

    // Check if it's already a friend
    const isFriend = await this.areUsersFriends(user, receiverUser);
    if (isFriend) {
      throw new HttpException(errorMessage.friendExist, HttpStatus.FOUND);
    }

    // Check if a friend request is already sent
    const isRequested = await this.isFriendRequestSent(user, receiverUser);
    if (isRequested) {
      throw new HttpException(
        errorMessage.friendAlreadyRequested,
        HttpStatus.FOUND,
      );
    }

    const friendRequestCreated = this.friendRequestRepository.create({
      requester: user,
      recipient: receiverUser,
      status: RequestStatus.PENDING,
    });
    const friendRequest = await this.friendRequestRepository.save(
      friendRequestCreated,
    );
    if (!friendRequest)
      throw new HttpException(
        errorMessage.failedToSendFriendRequest,
        HttpStatus.BAD_REQUEST,
      );

    return {
      message: errorMessage.friendRequestSent,
      data: this.serializeFriendRequest(friendRequest),
    };
  }

  async getFriendRequests(query: FilterFriendRequestDTO, user: User) {
    const selector: Partial<IFriendRequest> = { status: RequestStatus.PENDING };
    let order: OrderByCondition = {
      'request.created_at': 'DESC',
      'profilePicture.created_at': 'DESC',
    };
    const requestType = query.filter?.type || null;
    query.paginate = query.paginate || 15;
    query.page = query.page || 1;
    const skip = (query.page - 1) * query.paginate;

    // Create Query Builder
    const qb = this.friendRequestRepository.createQueryBuilder('request');

    // Apply filters
    if (Object.keys(selector).length > 0) {
      qb.where(selector);
    }

    if (requestType) {
      qb.leftJoinAndSelect('request.recipient', 'recipient')
        .leftJoinAndSelect('recipient.profilePicture', 'profilePicture')
        .andWhere('request.requester.id = :requesterId', {
          requesterId: user.id,
        });
    } else {
      qb.leftJoinAndSelect('request.requester', 'requester')
        .leftJoinAndSelect('requester.profilePicture', 'profilePicture')
        .andWhere('request.recipient.id = :recipientId', {
          recipientId: user.id,
        });
    }

    // Apply ordering, pagination
    qb.orderBy(order).skip(skip).take(query.paginate);

    const [requests, total] = await qb.getManyAndCount();

    const data = requests.map((request) =>
      this.serializeGetFriendRequests(request),
    );

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

  async updateFriendRequest(
    uuid: string,
    updateRequestStatusDto: UpdateRequestStatusDto,
    user: User,
    lang: string,
  ) {
    const errorMessage: ErrorMessages = this.i18nService.translate(
      'error-messages',
      {
        lang,
      },
    );

    const { status } = updateRequestStatusDto;

    const friendRequest = await this.friendRequestRepository.findOne({
      where: { uuid },
      relations: ['requester', 'recipient'],
    });

    if (!friendRequest)
      throw new HttpException(
        errorMessage.friendRequestNotFound,
        HttpStatus.NOT_FOUND,
      );
    if (friendRequest.status !== 'pending')
      throw new HttpException(
        errorMessage.friendRequestAlreadyUpdated,
        HttpStatus.BAD_REQUEST,
      );

    friendRequest.status = UpdateRequestStatus[status.toUpperCase()];
    const updatedRequest = await this.friendRequestRepository.save(
      friendRequest,
    );

    if (status === UpdateRequestStatus.ACCEPTED) {
      const friendCreated = this.friendsRepository.create({
        user1: friendRequest.requester,
        user2: friendRequest.recipient,
      });

      const friend = await this.friendsRepository.save(friendCreated);
      if (!friend)
        throw new HttpException(
          errorMessage.failedToUpdateRequest,
          HttpStatus.BAD_REQUEST,
        );

      await this.chatService.createChat(
        {
          userUuid: friend.user1.uuid,
          type: ChatType.CHAT,
        },
        user,
        lang,
      );

      return {
        message: errorMessage.friendRequestAcceptedSuccessfully,
        data: this.serializeUpdateFriendRequest(updatedRequest, user.uuid),
      };
    }

    return {
      message: errorMessage.friendRequestUpdatedSuccessfully,
      data: this.serializeUpdateFriendRequest(updatedRequest, user.uuid),
    };
  }

  serializeUpdateFriendRequest(updateFriendRequest, uuid: string) {
    const requestSerialization = plainToClass(
      UpdateFriendRequestSerialization,
      updateFriendRequest,
      {
        excludeExtraneousValues: true,
        enableCircularCheck: true,
        strategy: 'excludeAll',
      },
    );
    requestSerialization.user = UpdateFriendRequestSerialization.getOtherUser(
      updateFriendRequest,
      uuid,
    );

    return requestSerialization;
  }
  serializeFriendRequest(friendRequest) {
    return plainToClass(FriendRequestSerialization, friendRequest, {
      excludeExtraneousValues: true,
      enableCircularCheck: true,
      strategy: 'excludeAll',
    });
  }
  serializeGetFriendRequests(friendRequest) {
    return plainToClass(GetFriendRequestSerialization, friendRequest, {
      excludeExtraneousValues: true,
      enableCircularCheck: true,
      strategy: 'excludeAll',
    });
  }
}
