import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { OrderByCondition, Repository } from 'typeorm';
import { I18nService } from 'nestjs-i18n';
import { User } from 'src/modules/user/entities/user.entity';
import { IUser } from 'src/modules/user/interfaces/user.interface';
import { ErrorMessages } from 'src/interfaces/error-messages.interface';
import { plainToClass } from 'class-transformer';
import { FilterUsersDTO } from '../dto/filter-users.dto';
import { UserProfileSerialization } from '../serializers/get-user-profile.serialization';
import { UserSerialization } from '../serializers/user.serialization';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    private readonly i18nService: I18nService,
  ) {}

  async updateActiveStatus(uuid: string, date: Date) {
    const { affected } = await this.userRepository.update(
      { uuid },
      { last_active: date },
    );
    if (!affected)
      throw new HttpException(
        'Failed to update last active status',
        HttpStatus.BAD_REQUEST,
      );

    return { message: 'Status updated successfully', status: date };
  }

  async findOne(uuid: string, lang: string) {
    const errorMessage: ErrorMessages = this.i18nService.translate(
      'error-messages',
      {
        lang,
      },
    );

    const user = await this.userRepository.findOne({ where: { uuid } });
    if (!user)
      throw new HttpException(errorMessage.userNotFound, HttpStatus.NOT_FOUND);

    return user;
  }

  async getUsers(query: FilterUsersDTO, user: User) {
    const selector: Partial<IUser> = {};
    const keyword = query.filter?.keyword;
    let order: OrderByCondition = {
      'user.created_at': 'DESC',
      'profile.created_at': 'DESC',
    };

    query.paginate = query.paginate || 15;
    query.page = query.page || 1;
    const skip = (query.page - 1) * query.paginate;

    // Sort
    if (query.sort) {
      const orderDirection = query.sort.startsWith('-') ? 'DESC' : 'ASC';
      const orderKey = query.sort.replace(/^-/, '');
      const pageFieldsMap = { firstName: 'first_name' };

      if (pageFieldsMap[orderKey])
        order = { [pageFieldsMap[orderKey]]: orderDirection };
    }

    // Create Query Builder
    const qb = this.userRepository
      .createQueryBuilder('user')
      .leftJoinAndSelect('user.profilePicture', 'profile');

    // Apply filters
    if (Object.keys(selector).length > 0) {
      qb.where(selector);
    }

    if (keyword) {
      qb.andWhere(
        "(LOWER(CONCAT(user.first_name, ' ', user.last_name)) LIKE :keyword OR user.username LIKE :keyword)",
        { keyword: `%${keyword.toLowerCase()}%` },
      );
      qb.andWhere('user.id != :userId', { userId: user.id });
    }

    // Apply ordering, pagination
    qb.orderBy(order).skip(skip).take(query.paginate);

    const [users, total] = await qb.getManyAndCount();

    const data = users.map((user) => this.serializeUsers(user));

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

  serializeUsers(user) {
    return plainToClass(UserSerialization, user, {
      excludeExtraneousValues: true,
      enableCircularCheck: true,
      strategy: 'excludeAll',
    });
  }
  serializeUserProfile(user) {
    return plainToClass(UserProfileSerialization, user, {
      excludeExtraneousValues: true,
      enableCircularCheck: true,
      strategy: 'excludeAll',
    });
  }
}
