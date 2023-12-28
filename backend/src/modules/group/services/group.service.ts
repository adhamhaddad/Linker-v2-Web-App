import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { OrderByCondition, Repository } from 'typeorm';
import { Group } from '../entities/group.entity';
import { I18nService } from 'nestjs-i18n';
import { CreateGroupDto } from '../dto/create-group.dto';
import { User } from 'src/modules/auth/entities/user.entity';
import { ErrorMessages } from 'src/interfaces/error-messages.interface';
import { UpdateGroupDto } from '../dto/update-group.dto';
import { plainToClass } from 'class-transformer';
import { GroupSerialization } from '../serializers/group.serialization';
import { IGroup } from '../interfaces/group.interface';
import { FilterGroupDTO } from '../dto/filter-group.dto';
import { GroupMemberService } from './group-member.service';

@Injectable()
export class GroupService {
  constructor(
    @InjectRepository(Group)
    private readonly groupRepository: Repository<Group>,
    private readonly groupMemberService: GroupMemberService,
    private readonly i18nService: I18nService,
  ) {}

  async createGroup(createGroupDto: CreateGroupDto, user: User, lang: string) {
    const errorMessage: ErrorMessages = this.i18nService.translate(
      'error-messages',
      {
        lang,
      },
    );

    const groupCreated = this.groupRepository.create({
      creator: user,
      ...createGroupDto,
    });
    const group = await this.groupRepository.save(groupCreated);
    if (!group)
      throw new HttpException(
        errorMessage.failedToCreateGroup,
        HttpStatus.BAD_REQUEST,
      );

    await this.groupMemberService.createGroupMember(group, user, lang);

    return {
      message: errorMessage.groupCreatedSuccessfully,
      data: this.serializeGroup(group),
    };
  }

  async getGroups(query: FilterGroupDTO) {
    const selector: Partial<IGroup> = query.status
      ? { status: query.status }
      : {};
    const keyword = query.filter?.keyword;
    let order: OrderByCondition = { 'group.created_at': 'DESC' };

    query.paginate = query.paginate || 15;
    query.page = query.page || 1;
    const skip = (query.page - 1) * query.paginate;

    // Sort
    if (query.sort) {
      const orderDirection = query.sort.startsWith('-') ? 'DESC' : 'ASC';
      const orderKey = query.sort.replace(/^-/, '');
      const groupFieldsMap = { name: 'name', status: 'status' };

      if (groupFieldsMap[orderKey])
        order = { [groupFieldsMap[orderKey]]: orderDirection };
    }

    // Create Query Builder
    const qb = this.groupRepository
      .createQueryBuilder('group')
      .leftJoinAndSelect('group.creator', 'creator');

    // Apply filters
    if (Object.keys(selector).length > 0) {
      qb.where(selector);
    }

    if (keyword) {
      qb.andWhere(
        '(group.name LIKE :keyword OR group.description LIKE :keyword)',
        { keyword: `%${keyword}%` },
      );
    }

    // Apply ordering, pagination
    qb.orderBy(order).skip(skip).take(query.paginate);

    const [groups, total] = await qb.getManyAndCount();

    const data = groups.map((group) => this.serializeGroup(group));

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

  async getGroupById(uuid: string, lang: string) {
    const errorMessage: ErrorMessages = this.i18nService.translate(
      'error-messages',
      {
        lang,
      },
    );

    const group = await this.groupRepository.findOne({
      where: { uuid },
      relations: ['creator', 'members'],
    });
    if (!group)
      throw new HttpException(errorMessage.groupNotFound, HttpStatus.NOT_FOUND);

    const memberCount = group.members.length || 0;
    return {
      data: {
        ...this.serializeGroup(group),
        memberCount,
      },
    };
  }

  async updateGroup(
    uuid: string,
    body: UpdateGroupDto,
    user: User,
    lang: string,
  ) {
    const errorMessage: ErrorMessages = this.i18nService.translate(
      'error-messages',
      {
        lang,
      },
    );

    const group = await this.groupRepository.findOne({
      where: { uuid, creator: { id: user.id } },
      relations: ['creator'],
    });
    if (!group)
      throw new HttpException(errorMessage.groupNotFound, HttpStatus.NOT_FOUND);

    const { affected } = await this.groupRepository.update({ uuid }, body);
    if (!affected)
      throw new HttpException(
        errorMessage.failedToUpdateGroup,
        HttpStatus.BAD_REQUEST,
      );

    const updatedGroup = await this.groupRepository.findOne({
      where: { uuid, creator: { id: user.id } },
      relations: ['creator'],
    });

    return {
      message: errorMessage.groupUpdatedSuccessfully,
      data: this.serializeGroup(updatedGroup),
    };
  }

  async deleteGroup(uuid: string, user: User, lang: string) {
    const errorMessage: ErrorMessages = this.i18nService.translate(
      'error-messages',
      {
        lang,
      },
    );

    const group = await this.groupRepository.findOne({
      where: { uuid, creator: { id: user.id } },
    });
    if (!group)
      throw new HttpException(errorMessage.groupNotFound, HttpStatus.NOT_FOUND);

    const { affected } = await this.groupRepository.delete({ uuid });
    if (!affected)
      throw new HttpException(
        errorMessage.failedToDeleteGroup,
        HttpStatus.BAD_REQUEST,
      );

    return {
      message: errorMessage.groupDeletedSuccessfully,
      data: this.serializeGroup(group),
    };
  }

  serializeGroup(group) {
    return plainToClass(GroupSerialization, group, {
      excludeExtraneousValues: true,
      enableCircularCheck: true,
      strategy: 'excludeAll',
    });
  }
}
