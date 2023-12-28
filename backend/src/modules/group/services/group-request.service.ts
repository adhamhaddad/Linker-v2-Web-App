import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { OrderByCondition, Repository } from 'typeorm';
import { GroupRequest } from '../entities/group-request.entity';
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
import { GroupMember } from '../entities/group-member.entity';
import { GroupRequestSerialization } from '../serializers/group-request.serialization';
import { IGroupRequest } from '../interfaces/group-request.interface';
import { FilterGroupRequestDTO } from '../dto/filter-group-request.dto';

@Injectable()
export class GroupRequestService {
  constructor(
    @InjectRepository(GroupRequest)
    private readonly groupRequestRepository: Repository<GroupRequest>,
    @InjectRepository(Group)
    private readonly groupRepository: Repository<Group>,
    @InjectRepository(GroupMember)
    private readonly groupMemberRepository: Repository<GroupMember>,
    private readonly groupMemberService: GroupMemberService,
    private readonly i18nService: I18nService,
  ) {}

  // Helper function to check if user are already in the group
  private async areUserInGroup(group: Group, member: User): Promise<boolean> {
    const inGroup = await this.groupMemberRepository.findOne({
      where: { group: { id: group.id }, member: { id: member.id } },
    });

    return !!inGroup;
  }

  // Helper function to check if a group member request is already sent
  private async isGroupRequestSent(
    group: Group,
    requester: User,
  ): Promise<boolean> {
    const groupRequest = await this.groupRequestRepository.findOne({
      where: {
        group: { id: group.id },
        requester: { id: requester.id },
        status: RequestStatus.PENDING,
      },
    });

    return !!groupRequest;
  }

  async createGroupRequest(uuid: string, user: User, lang: string) {
    const errorMessage: ErrorMessages = this.i18nService.translate(
      'error-messages',
      {
        lang,
      },
    );

    // Check group exist
    const group = await this.groupRepository.findOne({ where: { uuid } });
    if (!group)
      throw new HttpException(errorMessage.groupNotFound, HttpStatus.NOT_FOUND);

    const isInGroup = await this.areUserInGroup(group, user);
    if (isInGroup)
      throw new HttpException(
        errorMessage.memberAlreadyExistInGroup,
        HttpStatus.FOUND,
      );

    // Check if a group member request is already sent
    const isRequested = await this.isGroupRequestSent(group, user);
    if (isRequested) {
      throw new HttpException(
        errorMessage.groupRequestAlreadySent,
        HttpStatus.FOUND,
      );
    }

    // Create group request
    const groupRequestCreated = this.groupRequestRepository.create({
      requester: user,
      group: group,
    });
    const groupRequest = await this.groupRequestRepository.save(
      groupRequestCreated,
    );
    if (!groupRequest)
      throw new HttpException(
        errorMessage.failedToSendGroupRequest,
        HttpStatus.BAD_REQUEST,
      );

    return {
      message: errorMessage.groupRequestSentSuccessfully,
      data: this.serializeGroupRequest(groupRequest),
    };
  }

  async getGroupRequests(
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

    const authorityMember = await this.groupMemberService.isHasAuthority(
      uuid,
      user.uuid,
    );
    if (!authorityMember)
      throw new HttpException(
        errorMessage.notAuthorized,
        HttpStatus.UNAUTHORIZED,
      );

    const selector: Partial<IGroupRequest> = {
      status: RequestStatus.PENDING,
      //@ts-ignore
      group: { uuid },
    };
    let order: OrderByCondition = { 'groupRequest.created_at': 'DESC' };
    query.paginate = query.paginate || 15;
    query.page = query.page || 1;
    const skip = (query.page - 1) * query.paginate;

    const qb = this.groupRequestRepository
      .createQueryBuilder('groupRequest')
      .leftJoinAndSelect('groupRequest.requester', 'requester')
      .leftJoinAndSelect('groupRequest.group', 'group')
      .andWhere('groupRequest.group = :groupUuid', { groupUuid: uuid })
      .where(selector)
      .orderBy(order)
      .skip(skip)
      .take(query.paginate);

    const [requests, total] = await qb.getManyAndCount();

    const data = requests.map((request) => this.serializeGroupRequest(request));

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

  async updateGroupRequest(
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

    const groupRequest = await this.groupRequestRepository.findOne({
      where: {
        uuid: requestUuid,
        group: { uuid: groupUuid, creator: { id: user.id } },
      },
      relations: ['group', 'requester'],
    });
    if (!groupRequest)
      throw new HttpException(errorMessage.groupNotFound, HttpStatus.NOT_FOUND);

    if (groupRequest.status !== RequestStatus.PENDING)
      throw new HttpException(
        errorMessage.groupRequestAlreadyUpdated,
        HttpStatus.BAD_REQUEST,
      );

    groupRequest.status = UpdateRequestStatus[status.toUpperCase()];
    const updatedGroupRequest = await this.groupRequestRepository.save(
      groupRequest,
    );

    if (status === UpdateRequestStatus.ACCEPTED) {
      // Create Member
      await this.groupMemberService.createGroupMember(
        groupRequest.group,
        groupRequest.requester,
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
      data: this.serializeGroupRequest(updatedGroupRequest),
    };
  }

  serializeGroupRequest(groupRequest) {
    return plainToClass(GroupRequestSerialization, groupRequest, {
      excludeExtraneousValues: true,
      enableCircularCheck: true,
      strategy: 'excludeAll',
    });
  }
}
