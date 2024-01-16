import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Profile } from '../entities/profile.entity';
import { OrderByCondition, Repository } from 'typeorm';
import { UpdateProfileDto } from '../dto/update-profile.dto';
import { User } from 'src/modules/auth/entities/user.entity';
import { I18nService } from 'nestjs-i18n';
import { ErrorMessages } from 'src/interfaces/error-messages.interface';
import { plainToClass } from 'class-transformer';
import { ProfileSerialization } from '../serializers/profile.serialization';
import { GetProfilesSerialization } from '../serializers/get-profiles.serialization';
import { FilterProfileDTO } from '../dto/filter-profile.dto';
import { IProfile } from '../interfaces/profile.interface';

@Injectable()
export class ProfileService {
  constructor(
    @InjectRepository(Profile)
    private readonly profileRepository: Repository<Profile>,
    private readonly i18nService: I18nService,
  ) {}

  async checkProfile(uuid: string, lang: string) {
    const errorMessage: ErrorMessages = this.i18nService.translate(
      'error-messages',
      {
        lang,
      },
    );

    const profile = await this.profileRepository.findOne({
      where: { uuid },
    });
    if (!profile)
      throw new HttpException(
        errorMessage.profileNotFound,
        HttpStatus.NOT_FOUND,
      );

    return profile;
  }

  async createProfile(user: User, lang: string) {
    const errorMessage: ErrorMessages = this.i18nService.translate(
      'error-messages',
      {
        lang,
      },
    );

    const profileCreated = this.profileRepository.create({ user });
    const profile = await this.profileRepository.save(profileCreated);

    if (!profile)
      throw new HttpException(
        errorMessage.failedToCreateProfile,
        HttpStatus.BAD_REQUEST,
      );

    return {
      message: errorMessage.profileCreatedSuccessfully,
      data: this.serializeProfile(profile),
    };
  }

  async getProfiles(query: FilterProfileDTO) {
    const selector: Partial<IProfile> = {};
    const keyword = query.filter?.keyword;
    let order: OrderByCondition = { 'profile.created_at': 'DESC' };

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
    const qb = this.profileRepository
      .createQueryBuilder('profile')
      .leftJoinAndSelect('profile.user', 'user');

    // Apply filters
    if (Object.keys(selector).length > 0) {
      qb.where(selector);
    }

    if (keyword) {
      qb.andWhere(
        '(user.first_name LIKE :keyword OR user.last_name LIKE :keyword)',
        { keyword: `%${keyword}%` },
      );
    }

    // Apply ordering, pagination
    qb.orderBy(order).skip(skip).take(query.paginate);

    const [profiles, total] = await qb.getManyAndCount();

    const data = profiles.map((page) => this.serializeGetProfiles(page));

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

  async getProfileById(uuid: string, lang: string) {
    const errorMessage: ErrorMessages = this.i18nService.translate(
      'error-messages',
      {
        lang,
      },
    );

    const profile = await this.profileRepository.findOne({
      where: { uuid },
      relations: ['user'],
    });
    if (!profile)
      throw new HttpException(
        errorMessage.profileNotFound,
        HttpStatus.NOT_FOUND,
      );

    return { data: this.serializeProfile(profile) };
  }

  async updateProfile(body: UpdateProfileDto, user: User, lang: string) {
    const errorMessage: ErrorMessages = this.i18nService.translate(
      'error-messages',
      {
        lang,
      },
    );

    const profile = await this.profileRepository.findOne({
      where: { user: { id: user.id } },
    });
    if (!profile)
      throw new HttpException(
        errorMessage.profileNotFound,
        HttpStatus.NOT_FOUND,
      );

    const updatedProfile = await this.profileRepository.save({
      ...profile,
      ...body,
    });
    if (!updatedProfile)
      throw new HttpException(
        errorMessage.failedToUpdateProfile,
        HttpStatus.BAD_REQUEST,
      );

    return {
      message: errorMessage.profileUpdatedSuccessfully,
      data: this.serializeProfile(updatedProfile),
    };
  }

  serializeProfile(profile) {
    return plainToClass(ProfileSerialization, profile, {
      excludeExtraneousValues: true,
      enableCircularCheck: true,
      strategy: 'excludeAll',
    });
  }

  serializeGetProfiles(profile) {
    return plainToClass(GetProfilesSerialization, profile, {
      excludeExtraneousValues: true,
      enableCircularCheck: true,
      strategy: 'excludeAll',
    });
  }
}