import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { RelationshipRequest } from '../entities/relationship-request.entity';
import { OrderByCondition, Repository } from 'typeorm';
import { Relationship } from '../entities/relationship.entity';
import { User } from 'src/modules/user/entities/user.entity';
import { I18nService } from 'nestjs-i18n';
import { Friend } from 'src/modules/friends/entities/friend.entity';
import { RequestStatus } from 'src/constants/request-status';
import { ErrorMessages } from 'src/interfaces/error-messages.interface';
import { plainToClass } from 'class-transformer';
import { RelationshipRequestSerialization } from '../serializers/relationship-request.serialization';
import {
  UpdateRequestStatus,
  UpdateRequestStatusDto,
} from '../dto/update-relationship-request.dto';
import { UpdateRelationshipRequestSerialization } from '../serializers/update-relationship-request.serialization';
import { CreateRelationshipDto } from '../dto/create-relationship.dto';
import { UpdateRelationshipDto } from '../dto/update-relationship.dto';
import { FilterRelationRequestDTO } from '../dto/requests-filter.dto';
import { IRelationshipRequest } from '../interfaces/relationship-request.interface';
import { FriendService } from '@modules/friends/services/friend.service';
import { UserService } from '@modules/user/services/user.service';

@Injectable()
export class RelationshipRequestService {
  constructor(
    @InjectRepository(RelationshipRequest)
    private readonly relationshipRequestRepository: Repository<RelationshipRequest>,
    @InjectRepository(Relationship)
    private readonly relationshipRepository: Repository<Relationship>,
    private readonly userService: UserService,
    private readonly friendService: FriendService,
    private readonly i18nService: I18nService,
  ) {}

  // Helper function to check if users are already in a relation
  private async areUsersInRelation(user1: User, user2: User): Promise<boolean> {
    const relation = await this.relationshipRepository.findOne({
      where: [
        { user1: { id: user1.id }, user2: { id: user2.id } },
        { user1: { id: user2.id }, user2: { id: user1.id } },
      ],
    });

    return !!relation;
  }

  // Helper function to check if a relationship request is already sent
  private async isRelationshipRequestSent(
    requester: User,
    recipient: User,
  ): Promise<boolean> {
    const relationshipRequest =
      await this.relationshipRequestRepository.findOne({
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

    return !!relationshipRequest;
  }

  async sendRelationshipRequest(
    createRelationshipDto: any,
    user: User,
    lang: string,
  ) {
    const errorMessage: ErrorMessages = this.i18nService.translate(
      'error-messages',
      {
        lang,
      },
    );

    console.log(createRelationshipDto);
    // Check if the recipientUuid is the same as the user's UUID
    if (createRelationshipDto.recipient_id === user.uuid) {
      throw new HttpException(
        errorMessage.cannotSendRelationRequestToYourself,
        HttpStatus.BAD_REQUEST,
      );
    }

    // Check User Exist
    const recipient = await this.userService.findOne(
      createRelationshipDto.recipient_id,
      lang,
    );

    // Check if it's not a friends
    const isFriend = await this.friendService.areUsersFriends(user, recipient);
    if (!isFriend) {
      throw new HttpException(
        errorMessage.friendNotFound,
        HttpStatus.NOT_FOUND,
      );
    }

    // Check if the users are in relation already
    const isInRelation = await this.areUsersInRelation(user, recipient);
    if (isInRelation)
      throw new HttpException(
        'You are already in a relationship with that user',
        HttpStatus.FOUND,
      );

    // Check if a relationship request is already sent
    const isRequested = await this.isRelationshipRequestSent(user, recipient);
    if (isRequested) {
      throw new HttpException(
        errorMessage.relationshipAlreadyRequested,
        HttpStatus.FOUND,
      );
    }

    // Create Relationship
    const relationshipCreated = this.relationshipRepository.create({
      relation: createRelationshipDto.relation,
      start_date: createRelationshipDto.start_date,
      end_date: createRelationshipDto.end_date,
      is_verified: false,
    });
    const relationship = await this.relationshipRepository.save(
      relationshipCreated,
    );

    // Create Relationship Request
    const relationshipRequestCreated =
      this.relationshipRequestRepository.create({
        requester: user,
        recipient: recipient,
        relation: relationship,
        status: RequestStatus.PENDING,
      });
    const relationshipRequest = await this.relationshipRequestRepository.save(
      relationshipRequestCreated,
    );
    if (!relationshipRequest)
      throw new HttpException(
        errorMessage.failedToSendRelationshipRequest,
        HttpStatus.BAD_REQUEST,
      );

    return {
      message: errorMessage.relationshipRequestSent,
      data: this.serializeRelationshipRequest(relationshipRequest),
    };
  }

  async sendUpdateRelationshipRequest(
    relationship: Relationship,
    updateRelationshipDto: UpdateRelationshipDto,
    user: User,
    lang: string,
  ) {
    const errorMessage: ErrorMessages = this.i18nService.translate(
      'error-messages',
      {
        lang,
      },
    );

    // Get the recipient user
    const recipient = [relationship.user1, relationship.user2].find(
      (relation) => relation.id !== user.id,
    );

    // Check if a relationship request is already sent
    const isRequested = await this.isRelationshipRequestSent(user, recipient);
    if (isRequested) {
      throw new HttpException(
        errorMessage.relationshipAlreadyRequested,
        HttpStatus.FOUND,
      );
    }

    const { affected } = await this.relationshipRepository.update(
      { uuid: relationship.uuid },
      {
        ...updateRelationshipDto,
        is_verified: false,
      },
    );
    if (!affected)
      throw new HttpException(
        errorMessage.failedToUpdateRelationship,
        HttpStatus.BAD_REQUEST,
      );

    const updatedRelationship = await this.relationshipRepository.findOne({
      where: { uuid: relationship.uuid },
    });

    // Create Relationship Request
    const relationshipRequestCreated =
      this.relationshipRequestRepository.create({
        requester: user,
        recipient: recipient,
        relation: updatedRelationship,
        status: RequestStatus.PENDING,
      });
    const relationshipRequest = await this.relationshipRequestRepository.save(
      relationshipRequestCreated,
    );
    if (!relationshipRequest)
      throw new HttpException(
        errorMessage.failedToSendRelationshipRequest,
        HttpStatus.BAD_REQUEST,
      );

    return {
      message: errorMessage.relationshipRequestSent,
      data: this.serializeRelationshipRequest(relationshipRequest),
    };
  }

  async updateRelationshipRequest(
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

    const relationshipRequest =
      await this.relationshipRequestRepository.findOne({
        where: { uuid },
        relations: ['requester', 'recipient', 'relation'],
      });

    if (!relationshipRequest)
      throw new HttpException(
        errorMessage.relationshipRequestNotFound,
        HttpStatus.NOT_FOUND,
      );
    if (relationshipRequest.status !== 'pending')
      throw new HttpException(
        errorMessage.relationshipRequestAlreadyUpdated,
        HttpStatus.BAD_REQUEST,
      );

    relationshipRequest.status = UpdateRequestStatus[status.toUpperCase()];
    const updatedRelationshipRequest =
      await this.relationshipRequestRepository.save(relationshipRequest);

    if (status === UpdateRequestStatus.ACCEPTED) {
      const relationshipUpdated = await this.relationshipRepository.update(
        { uuid: relationshipRequest.relation.uuid },
        {
          user1: relationshipRequest.requester,
          user2: relationshipRequest.recipient,
          is_verified: true,
        },
      );
      console.log(relationshipUpdated);

      return {
        message: errorMessage.relationshipRequestAcceptedSuccessfully,
        data: this.serializeUpdateFriendRequest(updatedRelationshipRequest),
      };
    }

    return {
      message: errorMessage.relationshipRequestUpdatedSuccessfully,
      data: this.serializeUpdateFriendRequest(updatedRelationshipRequest),
    };
  }

  async getRelationshipRequests(query: FilterRelationRequestDTO, user: User) {
    const selector: Partial<IRelationshipRequest> = {
      status: RequestStatus.PENDING,
    };
    let order: OrderByCondition = {
      'request.created_at': 'DESC',
      'profilePicture.created_at': 'DESC',
    };
    const requestType = query.filter?.type || null;
    query.paginate = query.paginate || 15;
    query.page = query.page || 1;
    const skip = (query.page - 1) * query.paginate;

    // Create Query Builder
    const qb = this.relationshipRequestRepository.createQueryBuilder('request');

    // Apply filters
    if (Object.keys(selector).length > 0) {
      qb.where(selector);
    }

    if (requestType) {
      qb.leftJoinAndSelect('request.recipient', 'recipient')
        .leftJoinAndSelect('request.relation', 'relation')
        .leftJoinAndSelect('recipient.profilePicture', 'profilePicture')
        .andWhere('request.requester.id = :requesterId', {
          requesterId: user.id,
        });
    } else {
      qb.leftJoinAndSelect('request.requester', 'requester')
        .leftJoinAndSelect('request.relation', 'relation')
        .leftJoinAndSelect('requester.profilePicture', 'profilePicture')
        .andWhere('request.recipient.id = :recipientId', {
          recipientId: user.id,
        });
    }

    // Apply ordering, pagination
    qb.orderBy(order).skip(skip).take(query.paginate);

    const [requests, total] = await qb.getManyAndCount();

    const data = requests.map((request) =>
      this.serializeRelationshipRequest(request),
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

  serializeUpdateFriendRequest(updateRelationshipRequest) {
    return plainToClass(
      UpdateRelationshipRequestSerialization,
      updateRelationshipRequest,
      {
        excludeExtraneousValues: true,
        enableCircularCheck: true,
        strategy: 'excludeAll',
      },
    );
  }
  serializeRelationshipRequest(relationshipRequest) {
    return plainToClass(RelationshipRequestSerialization, relationshipRequest, {
      excludeExtraneousValues: true,
      enableCircularCheck: true,
      strategy: 'excludeAll',
    });
  }
}
