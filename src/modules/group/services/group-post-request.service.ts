import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { OrderByCondition, Repository } from 'typeorm';
import { GroupPostRequest } from '../entities/group-post-request.entity';
import { I18nService } from 'nestjs-i18n';
import { User } from 'src/modules/auth/entities/user.entity';
import { ErrorMessages } from 'src/interfaces/error-messages.interface';
import { plainToClass } from 'class-transformer';
import { Group } from '../entities/group.entity';
import {
  UpdateRequestStatus,
  UpdateRequestStatusDto,
} from '../dto/update-group-status.dto';
import { RequestStatus } from 'src/constants/request-status';
import { GroupMemberService } from './group-member.service';
import { IGroupRequest } from '../interfaces/group-request.interface';
import { FilterGroupRequestDTO } from '../dto/filter-group-request.dto';
import { GroupPermissions } from 'src/constants';
import { Post } from 'src/modules/post/entities/post.entity';
import { GroupPostRequestSerialization } from '../serializers/group-post-request.serialization';
import { PostService } from 'src/modules/post/services/post.service';
import { PostStatus } from 'src/modules/post/interfaces/post.interface';

@Injectable()
export class GroupPostRequestService {
  constructor(
    @InjectRepository(GroupPostRequest)
    private readonly groupPostRequestRepository: Repository<GroupPostRequest>,
    private readonly groupMemberService: GroupMemberService,
    @InjectRepository(Group)
    private readonly groupRepository: Repository<Group>,
    @InjectRepository(Post)
    private readonly postRepository: Repository<Post>,
    private readonly postService: PostService,
    private readonly i18nService: I18nService,
  ) {}

  // Helper function to check if a group member request is already sent
  private async isGroupPostRequestSent(
    group: Group,
    requester: User,
    post: Post,
  ): Promise<boolean> {
    const groupRequest = await this.groupPostRequestRepository.findOne({
      where: {
        group: { id: group.id },
        requester: { id: requester.id },
        post: { id: post.id },
        status: RequestStatus.PENDING,
      },
    });

    return !!groupRequest;
  }

  async createGroupPostRequest(
    groupUuid: string,
    postUuid: string,
    user: User,
    lang: string,
  ) {
    const errorMessage: ErrorMessages = this.i18nService.translate(
      'error-messages',
      {
        lang,
      },
    );

    // Check group exist
    const group = await this.groupRepository.findOne({
      where: { uuid: groupUuid },
    });
    if (!group)
      throw new HttpException(errorMessage.groupNotFound, HttpStatus.NOT_FOUND);

    const post = await this.postRepository.findOne({
      where: { uuid: postUuid },
    });
    if (!post)
      throw new HttpException(errorMessage.postNotFound, HttpStatus.NOT_FOUND);

    // Check if a post request is already sent
    const isRequested = await this.isGroupPostRequestSent(group, user, post);
    if (isRequested) {
      throw new HttpException(
        errorMessage.groupRequestAlreadySent,
        HttpStatus.FOUND,
      );
    }

    // Create post request
    const groupRequestCreated = this.groupPostRequestRepository.create({
      requester: user,
      group: group,
    });
    const groupRequest = await this.groupPostRequestRepository.save(
      groupRequestCreated,
    );
    if (!groupRequest)
      throw new HttpException(
        errorMessage.failedToSendGroupRequest,
        HttpStatus.BAD_REQUEST,
      );

    return {
      message: errorMessage.groupRequestSentSuccessfully,
      data: this.serializeGroupPostRequest(groupRequest),
    };
  }

  async getGroupPostRequests(
    uuid: string,
    query: FilterGroupRequestDTO,
    user: User,
    lang: string,
  ) {
    const errorMessage: ErrorMessages = this.i18nService.translate(
      'error-messages',
      {
        lang,
      },
    );

    const isAuthority = await this.groupMemberService.isHasAuthority(
      uuid,
      user.uuid,
      GroupPermissions.AdminPermission,
    );
    if (!isAuthority)
      throw new HttpException(
        errorMessage.notAuthorized,
        HttpStatus.UNAUTHORIZED,
      );

    const selector: Partial<IGroupRequest> = {
      status: RequestStatus.PENDING,
      //@ts-ignore
      group: { uuid },
    };
    const order: OrderByCondition = { 'groupRequest.created_at': 'DESC' };
    query.paginate = query.paginate || 15;
    query.page = query.page || 1;
    const skip = (query.page - 1) * query.paginate;

    const qb = this.groupPostRequestRepository
      .createQueryBuilder('groupRequest')
      .leftJoinAndSelect('groupRequest.requester', 'requester')
      .leftJoinAndSelect('groupRequest.group', 'group')
      .andWhere('groupRequest.group = :groupUuid', { groupUuid: uuid })
      .where(selector)
      .orderBy(order)
      .skip(skip)
      .take(query.paginate);

    const [requests, total] = await qb.getManyAndCount();

    const data = requests.map((request) =>
      this.serializeGroupPostRequest(request),
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

  async updateGroupPostRequest(
    groupUuid: string,
    requestUuid: string,
    body: UpdateRequestStatusDto,
    user: User,
    lang: string,
  ) {
    const errorMessage: ErrorMessages = this.i18nService.translate(
      'error-messages',
      {
        lang,
      },
    );

    const { status } = body;

    const groupPostRequest = await this.groupPostRequestRepository.findOne({
      where: {
        uuid: requestUuid,
        group: { uuid: groupUuid },
      },
      relations: ['requester', 'post'],
    });
    if (!groupPostRequest)
      throw new HttpException(errorMessage.groupNotFound, HttpStatus.NOT_FOUND);

    if (groupPostRequest.status !== RequestStatus.PENDING)
      throw new HttpException(
        errorMessage.groupRequestAlreadyUpdated,
        HttpStatus.BAD_REQUEST,
      );

    // Is user has authority to update request
    const isAuthority = await this.groupMemberService.isHasAuthority(
      groupUuid,
      user.uuid,
      GroupPermissions.AdminPermission,
    );
    if (!isAuthority)
      throw new HttpException(
        errorMessage.notAuthorized,
        HttpStatus.UNAUTHORIZED,
      );

    groupPostRequest.status = UpdateRequestStatus[status.toUpperCase()];
    const updatedGroupRequest = await this.groupPostRequestRepository.save(
      groupPostRequest,
    );

    if (status === UpdateRequestStatus.ACCEPTED) {
      // Publish Post
      await this.postService.updatePost(
        groupPostRequest.post.uuid,
        {
          status: PostStatus.PUBLIC,
          created_at: new Date(),
        },
        user,
        lang,
      );
    }

    if (!updatedGroupRequest)
      throw new HttpException(
        errorMessage.failedToUpdateGroupRequest,
        HttpStatus.BAD_REQUEST,
      );

    return {
      message: errorMessage.groupRequestUpdatedSuccessfully,
      data: this.serializeGroupPostRequest(updatedGroupRequest),
    };
  }

  serializeGroupPostRequest(groupPostRequest) {
    return plainToClass(GroupPostRequestSerialization, groupPostRequest, {
      excludeExtraneousValues: true,
      enableCircularCheck: true,
      strategy: 'excludeAll',
    });
  }
}
