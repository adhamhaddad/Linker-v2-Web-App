import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import {
  Brackets,
  In,
  OrderByCondition,
  Repository,
  SelectQueryBuilder,
} from 'typeorm';
import { I18nService } from 'nestjs-i18n';
import { User } from 'src/modules/auth/entities/user.entity';
import { ErrorMessages } from 'src/interfaces/error-messages.interface';
import { plainToClass } from 'class-transformer';
import { Group } from '../entities/group.entity';
import { GroupMember } from '../entities/group-member.entity';
import { UpdateGroupMemberDto } from '../dto/update-group-member.dto';
import {
  GroupUserRole,
  IGroupMember,
} from '../interfaces/group-member.interface';
import { GroupMemberSerialization } from '../serializers/group-member.serialization';

@Injectable()
export class GroupMemberService {
  constructor(
    @InjectRepository(GroupMember)
    private readonly groupMemberRepository: Repository<GroupMember>,
    @InjectRepository(Group)
    private readonly groupRepository: Repository<Group>,
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    private readonly i18nService: I18nService,
  ) {}

  // Helper function to check if group exist
  private async isGroupExist(uuid: string) {
    const group = await this.groupRepository.findOne({
      where: { uuid },
    });

    return group || false;
  }

  // Helper function to check my authority
  async isHasAuthority(groupUuid: string, memberUuid: string) {
    const groupMember = await this.groupMemberRepository.findOne({
      where: {
        group: { uuid: groupUuid },
        member: { uuid: memberUuid },
        role: In(['owner', 'admin', 'moderator']),
      },
      relations: ['member'],
    });

    return groupMember || false;
  }

  // Helper function to check if user exist in group
  private async isGroupMemberExist(groupUuid: string, memberUuid: string) {
    const groupMember = await this.groupMemberRepository.findOne({
      where: {
        group: { uuid: groupUuid },
        member: { uuid: memberUuid },
      },
      relations: ['member'],
    });

    return groupMember || false;
  }

  async createGroupMember(group: Group, member: User, lang: string) {
    const errorMessage: ErrorMessages = this.i18nService.translate(
      'error-messages',
      {
        lang,
      },
    );

    // Create member ship
    const groupMemberCreated = this.groupMemberRepository.create({
      group,
      member,
    });
    const groupMember = await this.groupMemberRepository.save(
      groupMemberCreated,
    );
    if (!groupMember)
      throw new HttpException(
        errorMessage.failedToCreateGroupMember,
        HttpStatus.BAD_REQUEST,
      );

    return {
      message: errorMessage.groupMemberCreatedSuccessfully,
      data: this.serializeGroupMember(groupMember),
    };
  }

  async getGroupMembers(uuid: string, query: any, user: User, lang: string) {
    const errorMessage: ErrorMessages = this.i18nService.translate(
      'error-messages',
      {
        lang,
      },
    );

    // Check that group is exist
    const group = await this.groupRepository.findOne({ where: { uuid } });
    if (!group)
      throw new HttpException(errorMessage.groupNotFound, HttpStatus.NOT_FOUND);

    // Check that user is exist in group
    const isMember = await this.isGroupMemberExist(uuid, user.uuid);
    if (!isMember)
      throw new HttpException(
        errorMessage.groupMemberNotFound,
        HttpStatus.NOT_FOUND,
      );

    const selector: Partial<IGroupMember> = {};
    const keyword = query.filter?.keyword;
    let order: OrderByCondition = { 'groupMember.created_at': 'DESC' };
    query.paginate = query.paginate ? query.paginate : 15;
    query.page = query.page ? query.page : 1;
    const skip = (query.page - 1) * query.paginate;

    // Sort
    if (query.sort) {
      const orderDirection = query.sort.startsWith('-') ? 'DESC' : 'ASC';
      const orderKey = query.sort.replace(/^-/, '');
      const groupMemberFieldsMap = { role: 'role' };

      if (groupMemberFieldsMap[orderKey])
        order = { [groupMemberFieldsMap[orderKey]]: orderDirection };
    }

    // Create Query Builder
    const qb = this.groupMemberRepository
      .createQueryBuilder('groupMember')
      .leftJoinAndSelect('groupMember.member', 'member')
      .where('groupMember.group = :groupId', { groupId: group.id });

    // Apply filters
    if (Object.keys(selector).length > 0) {
      qb.where(selector);
    }

    if (keyword) {
      qb.andWhere(
        'groupMember.title LIKE :keyword OR groupMember.author LIKE :keyword',
        { keyword: `%${keyword}%` },
      );
    }

    // Apply ordering, pagination
    qb.orderBy(order).skip(skip).take(query.paginate).relation('member');

    const [members, total] = await qb.getManyAndCount();

    const data = members.map((member) => this.serializeGroupMember(member));

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

  async updateGroupMember(
    groupUuid: string,
    memberUuid: string,
    body: UpdateGroupMemberDto,
    user: User,
    lang: string,
  ) {
    const errorMessage: ErrorMessages = this.i18nService.translate(
      'error-messages',
      {
        lang,
      },
    );

    // Check that group is exist
    const isGroupExist = await this.isGroupExist(groupUuid);
    if (!isGroupExist)
      throw new HttpException(errorMessage.groupNotFound, HttpStatus.NOT_FOUND);

    // Check that user is exist in group
    const isGroupMember = await this.isGroupMemberExist(groupUuid, memberUuid);
    if (!isGroupMember)
      throw new HttpException(
        errorMessage.groupMemberNotFound,
        HttpStatus.NOT_FOUND,
      );

    // Check that member has authority to delete
    const authorityMember = await this.isHasAuthority(groupUuid, user.uuid);
    if (!authorityMember)
      throw new HttpException(
        errorMessage.notAuthorized,
        HttpStatus.UNAUTHORIZED,
      );

    // Check that user is not has higher authority
    if (isGroupMember.role !== GroupUserRole.MEMBER)
      throw new HttpException(
        errorMessage.failedToDeleteGroupMember,
        HttpStatus.BAD_REQUEST,
      );
    // Update member
    /*
      1- Ban
      2- Authority
      3- Mute
    */

    isGroupMember.role = body.role;
    const updatedGroupMember = await this.groupMemberRepository.save(
      isGroupMember,
    );
    if (!updatedGroupMember)
      throw new HttpException(
        errorMessage.failedToUpdateGroupMember,
        HttpStatus.BAD_REQUEST,
      );

    return {
      message: errorMessage.groupMemberUpdatedSuccessfully,
      data: updatedGroupMember,
    };
  }

  async deleteGroupMember(
    groupUuid: string,
    memberUuid: string,
    user: User,
    lang: string,
  ) {
    const errorMessage: ErrorMessages = this.i18nService.translate(
      'error-messages',
      {
        lang,
      },
    );

    // Check that member has authority to delete
    const authorityMember = await this.isHasAuthority(groupUuid, user.uuid);
    if (!authorityMember)
      throw new HttpException(
        errorMessage.failedToDeleteGroupMember,
        HttpStatus.UNAUTHORIZED,
      );

    // Check that user exist in group
    const member = await this.isGroupMemberExist(groupUuid, memberUuid);
    if (!member)
      throw new HttpException(
        errorMessage.groupMemberNotFound,
        HttpStatus.NOT_FOUND,
      );

    // Check that user is not has higher authority
    if (member.role !== GroupUserRole.MEMBER)
      throw new HttpException(
        errorMessage.failedToDeleteGroupMember,
        HttpStatus.BAD_REQUEST,
      );

    // Delete member
    const { affected } = await this.groupMemberRepository.delete({
      uuid: memberUuid,
    });
    if (!affected)
      throw new HttpException(
        errorMessage.failedToDeleteGroupMember,
        HttpStatus.BAD_REQUEST,
      );

    return {
      message: errorMessage.groupMemberDeletedSuccessfully,
      data: { id: memberUuid },
    };
  }

  serializeGroupMember(group) {
    return plainToClass(GroupMemberSerialization, group, {
      excludeExtraneousValues: true,
      enableCircularCheck: true,
      strategy: 'excludeAll',
    });
  }
}