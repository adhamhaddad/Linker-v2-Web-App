import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { ProfilePicture } from '../entities/profile-picture.entity';
import { OrderByCondition, Repository } from 'typeorm';
import { User } from 'src/modules/auth/entities/user.entity';
import * as fs from 'fs-extra';
import { join } from 'path';
import { ErrorMessages } from 'src/interfaces/error-messages.interface';
import { I18nService } from 'nestjs-i18n';
import { ProfilePictureSerialization } from '../serializers/profile.serialization';
import { plainToClass } from 'class-transformer';
import { v4 as uuidV4 } from 'uuid';
import { Profile } from 'src/modules/profile/entities/profile.entity';

@Injectable()
export class ProfilePictureService {
  constructor(
    @InjectRepository(ProfilePicture)
    private readonly profilePictureRepository: Repository<ProfilePicture>,
    @InjectRepository(Profile)
    private readonly profileRepository: Repository<Profile>,
    private readonly i18nService: I18nService,
  ) {}

  async uploadProfilePicture(
    uuid: string,
    file: any,
    user: User,
    lang: string,
  ) {
    const errorMessage: ErrorMessages = this.i18nService.translate(
      'error-messages',
      {
        lang,
      },
    );

    const profile = await this.profileRepository.findOne({
      where: { uuid, user: { id: user.id } },
    });
    if (!profile)
      throw new HttpException(
        errorMessage.profileNotFound,
        HttpStatus.NOT_FOUND,
      );

    // Process the uploaded file, e.g., save it to the database or move it to a specific folder
    const imageUuid = uuidV4();
    const imageUrl = `uploads/profile-pictures/${imageUuid}-${file.originalname}`;

    const uploads = join(
      __dirname,
      '..',
      '..',
      '..',
      '..',
      'uploads',
      'profile-pictures',
      `${imageUuid}-${file.originalname}`,
    );

    await fs.move(file.path, uploads);

    const profileCreated = this.profilePictureRepository.create({
      user,
      profile,
      image_url: imageUrl,
    });
    const profilePicture = await this.profilePictureRepository.save(
      profileCreated,
    );
    if (!profilePicture)
      throw new HttpException(
        errorMessage.failedToCreateProfilePicture,
        HttpStatus.BAD_REQUEST,
      );

    return {
      message: errorMessage.profilePictureCreatedSuccessfully,
      data: this.serializeProfilePicture(profilePicture),
    };
  }

  async getProfilePictures(uuid: string, lang: string) {
    const errorMessage: ErrorMessages = this.i18nService.translate(
      'error-messages',
      {
        lang,
      },
    );
    let order: OrderByCondition = { 'profile.created_at': 'DESC' };

    const profile = await this.profileRepository.findOne({ where: { uuid } });
    if (!profile)
      throw new HttpException(
        errorMessage.profileNotFound,
        HttpStatus.NOT_FOUND,
      );

    // Create Query Builder
    const qb = this.profilePictureRepository
      .createQueryBuilder('picture')
      .leftJoinAndSelect('picture.profile', 'profile')
      .where('profile.uuid = :profileId', { profileId: uuid });

    // Apply ordering, pagination
    qb.orderBy(order);

    const [pictures, total] = await qb.getManyAndCount();

    const data = pictures.map((picture) =>
      this.serializeProfilePicture(picture),
    );

    return {
      data,
      total,
    };
  }

  async getProfilePictureById(uuid: string, lang: string) {
    const errorMessage: ErrorMessages = this.i18nService.translate(
      'error-messages',
      {
        lang,
      },
    );

    const profilePicture = await this.profilePictureRepository.findOne({
      where: { uuid },
    });
    if (!profilePicture)
      throw new HttpException(
        errorMessage.profilePictureNotFound,
        HttpStatus.NOT_FOUND,
      );

    return {
      message: '',
      data: this.serializeProfilePicture(profilePicture),
    };
  }

  async deleteProfilePicture(uuid: string, user: User, lang: string) {
    const errorMessage: ErrorMessages = this.i18nService.translate(
      'error-messages',
      {
        lang,
      },
    );

    const profilePicture = await this.profilePictureRepository.findOne({
      where: { uuid, user: { id: user.id } },
    });
    if (!profilePicture)
      throw new HttpException(
        errorMessage.profilePictureNotFound,
        HttpStatus.NOT_FOUND,
      );

    const { affected } = await this.profilePictureRepository.delete({ uuid });
    if (!affected)
      throw new HttpException(
        errorMessage.failedToDeleteProfilePicture,
        HttpStatus.BAD_REQUEST,
      );

    return {
      message: errorMessage.profilePictureDeletedSuccessfully,
      data: this.serializeProfilePicture(profilePicture),
    };
  }

  serializeProfilePicture(picture) {
    return plainToClass(ProfilePictureSerialization, picture, {
      excludeExtraneousValues: true,
      enableCircularCheck: true,
      strategy: 'excludeAll',
    });
  }
}
