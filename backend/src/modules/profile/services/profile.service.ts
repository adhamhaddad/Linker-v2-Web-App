import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Profile } from '../entities/profile.entity';
import { Repository } from 'typeorm';
import { UpdateProfileDto } from '../dto/update-profile.dto';
import { User } from 'src/modules/auth/entities/user.entity';
import { I18nService } from 'nestjs-i18n';
import { ErrorMessages } from 'src/interfaces/error-messages.interface';
import { plainToClass } from 'class-transformer';
import { ProfileSerialization } from '../serializers/profile.serialization';

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

  async createProfile(user, lang: string) {
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

  async getProfileById(uuid: string, lang: string) {
    const errorMessage: ErrorMessages = this.i18nService.translate(
      'error-messages',
      {
        lang,
      },
    );

    const profile = await this.profileRepository.findOne({
      where: { user: { uuid } },
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
}
