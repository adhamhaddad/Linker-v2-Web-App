import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { FriendRequest } from '../entities/friend-request.entity';
import { Repository } from 'typeorm';
import { Friend } from '../entities/friend.entity';
import { User } from 'src/modules/auth/entities/user.entity';
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

@Injectable()
export class FriendRequestService {
  constructor(
    @InjectRepository(FriendRequest)
    private readonly friendRequestRepository: Repository<FriendRequest>,
    @InjectRepository(Friend)
    private readonly friendRepository: Repository<Friend>,
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    private readonly i18nService: I18nService,
  ) {}

  // Helper function to check if users are already friends
  private async areUsersFriends(user1: User, user2: User): Promise<boolean> {
    const friend = await this.friendRepository.findOne({
      where: [
        { user1: { id: user1.id }, user2: { id: user2.id } },
        { user1: { id: user2.id }, user2: { id: user1.id } },
      ],
    });

    return !!friend;
  }

  // Helper function to check if a friend request is already sent
  private async isFriendRequestSent(
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

    const receiverUser = await this.userRepository.findOne({
      where: { uuid: recipientUuid },
    });
    if (!receiverUser)
      throw new HttpException(errorMessage.userNotFound, HttpStatus.NOT_FOUND);

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
      const friendCreated = this.friendRepository.create({
        user1: friendRequest.requester,
        user2: friendRequest.recipient,
      });
      const friend = await this.friendRepository.save(friendCreated);
      return {
        message: errorMessage.friendRequestAcceptedSuccessfully,
        data: this.serializeUpdateFriendRequest(updatedRequest),
      };
    }

    return {
      message: errorMessage.friendRequestUpdatedSuccessfully,
      data: this.serializeUpdateFriendRequest(updatedRequest),
    };
  }

  async getFriendRequests(user: User, lang: string, sent: boolean = false) {
    const errorMessage: ErrorMessages = this.i18nService.translate(
      'error-messages',
      {
        lang,
      },
    );

    const selectFields = sent ? ['recipient'] : ['requester'];
    const whereClause = sent
      ? {
          requester: { id: user.id },
          status: RequestStatus.PENDING,
        }
      : {
          recipient: { id: user.id },
          status: RequestStatus.PENDING,
        };

    const friendRequests = await this.friendRequestRepository.find({
      where: whereClause,
      relations: selectFields,
    });
    if (!friendRequests)
      throw new HttpException(
        errorMessage.noFriendRequestsFound,
        HttpStatus.NOT_FOUND,
      );

    return {
      message: '',
      data: this.serializeFriendRequest(friendRequests),
      total: friendRequests.length,
    };
  }

  serializeUpdateFriendRequest(updateFriendRequest) {
    return plainToClass(UpdateFriendRequestSerialization, updateFriendRequest, {
      excludeExtraneousValues: true,
      enableCircularCheck: true,
      strategy: 'excludeAll',
    });
  }
  serializeFriendRequest(friendRequest) {
    return plainToClass(FriendRequestSerialization, friendRequest, {
      excludeExtraneousValues: true,
      enableCircularCheck: true,
      strategy: 'excludeAll',
    });
  }
  serializeFriend(friend) {
    return plainToClass(FriendSerialization, friend, {
      excludeExtraneousValues: true,
      enableCircularCheck: true,
      strategy: 'excludeAll',
    });
  }
}
