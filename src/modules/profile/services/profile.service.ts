import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Profile } from '../entities/profile.entity';
import { OrderByCondition, Repository } from 'typeorm';
import { UpdateProfileDto } from '../dto/update-profile.dto';
import { User } from 'src/modules/user/entities/user.entity';
import { I18nService } from 'nestjs-i18n';
import { ErrorMessages } from 'src/interfaces/error-messages.interface';
import { plainToClass } from 'class-transformer';
import { ProfileSerialization } from '../serializers/profile.serialization';
import { GetProfilesSerialization } from '../serializers/get-profiles.serialization';
import { FilterProfileDTO } from '../dto/filter-profile.dto';
import { IProfile } from '../interfaces/profile.interface';
import { IProfileSettings } from '../interfaces/profile-settings.interface';
import { FriendRequestService } from 'src/modules/friends/services/friend-request.service';
import { FriendService } from 'src/modules/friends/services/friend.service';

@Injectable()
export class ProfileService {
  constructor(
    @InjectRepository(Profile)
    private readonly profileRepository: Repository<Profile>,
    private readonly friendsService: FriendService,
    private readonly friendRequestService: FriendRequestService,
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

  async getProfileByUserId(uuid: string) {
    let order: OrderByCondition = {
      'profilePicture.created_at': 'DESC',
    };

    // Create Query Builder
    const qb = this.profileRepository
      .createQueryBuilder('profile')
      .leftJoinAndSelect('profile.user', 'user')
      .leftJoinAndSelect('profile.profilePicture', 'profilePicture')
      .where('user.uuid = :uuid', { uuid });

    // Apply ordering, pagination
    qb.orderBy(order).take(1);

    const profile = await qb.getOneOrFail();
    if (!profile) {
      return false;
    }

    const data = {
      fullName: `${profile.user.first_name} ${profile.user.last_name}`,
      profile: profile.profilePicture[0].image_url || null,
    };

    return data || false;
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
      const [firstName, ...lastNameParts] = keyword
        .toLowerCase()
        .trim()
        .split(' ');

      let lastNameCondition = '';
      if (lastNameParts.length > 0) {
        const lastName = lastNameParts.join(' ');
        lastNameCondition = `AND LOWER(user.last_name) LIKE :lastName`;
        qb.andWhere(
          `(LOWER(user.first_name) = :firstName ${lastNameCondition})`,
          { firstName, lastName: `${lastName}%` },
        );
      } else {
        qb.andWhere(`(LOWER(user.first_name) LIKE :firstName)`, {
          firstName: `${firstName}%`,
        });
      }
    }

    // Apply ordering, pagination
    qb.orderBy(order).skip(skip).take(query.paginate);

    const [profiles, total] = await qb.getManyAndCount();

    const data = profiles.map((profile) => this.serializeGetProfiles(profile));

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

  async getProfileByUsername(username: string, user: User, lang: string) {
    const errorMessage: ErrorMessages = this.i18nService.translate(
      'error-messages',
      {
        lang,
      },
    );
    let order: OrderByCondition = {
      'profilePicture.created_at': 'DESC',
      'coverPicture.created_at': 'DESC',
    };

    // Create Query Builder
    const qb = this.profileRepository
      .createQueryBuilder('profile')
      .leftJoinAndSelect('profile.user', 'user')
      .leftJoinAndSelect('profile.profilePicture', 'profilePicture')
      .leftJoinAndSelect('profile.coverPicture', 'coverPicture')
      .leftJoinAndSelect('profile.about', 'about')
      .leftJoinAndSelect('profile.address', 'address')
      .where('user.username = :username', { username });

    // Apply ordering, pagination
    qb.orderBy(order).take(1);

    const profile = await qb.getOneOrFail();

    if (!profile)
      throw new HttpException(
        errorMessage.profileNotFound,
        HttpStatus.NOT_FOUND,
      );

    const settings: IProfileSettings = {
      posts_status: profile.posts_status,
      friends_status: profile.friends_status,
      pages_status: profile.pages_status,
      groups_status: profile.groups_status,
    };

    const isMe = profile.user.uuid === user.uuid;

    const connection = {
      isConnected: false,
      isRequested: null,
    };

    if (!isMe) {
      const connected = await this.friendsService.areUsersFriends(
        user,
        profile.user,
      );
      const requested = await this.friendRequestService.isRequested(
        user,
        profile.user,
      );

      connection.isConnected = connected;
      connection.isRequested = requested;
    }

    console.log(connection);

    const profileWithExtra: IProfile = {
      ...profile,
      settings,
      connection,
      isMe,
    };

    const data = this.serializeProfile(profileWithExtra);

    return { data };
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
