import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { ProfilePicture } from '../entities/profile-picture.entity';
import { Repository } from 'typeorm';
import { User } from 'src/modules/auth/entities/user.entity';
import * as fs from 'fs-extra';
import { ErrorMessages } from 'src/interfaces/error-messages.interface';
import { I18nService } from 'nestjs-i18n';
import { ProfilePictureSerialization } from '../serializers/profile.serialization';
import { plainToClass } from 'class-transformer';

@Injectable()
export class ProfilePictureService {
  constructor(
    @InjectRepository(ProfilePicture)
    private readonly profilePictureRepository: Repository<ProfilePicture>,
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    private readonly i18nService: I18nService,
  ) {}

  async uploadProfilePicture(file, user: User, lang: string) {
    const errorMessage: ErrorMessages = this.i18nService.translate(
      'error-messages',
      {
        lang,
      },
    );

    // Process the uploaded file, e.g., save it to the database or move it to a specific folder
    const newPath = `./uploads/profile-pictures/${file.filename}`;
    await fs.move(file.path, newPath);

    const profileCreated = this.profilePictureRepository.create({
      user_id: user.id,
      image_url: newPath,
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

  async getProfilePictureByUserId(uuid: string, lang: string) {
    const errorMessage: ErrorMessages = this.i18nService.translate(
      'error-messages',
      {
        lang,
      },
    );

    const user = await this.userRepository.findOne({ where: { uuid } });
    if (!user)
      throw new HttpException(errorMessage.userNotFound, HttpStatus.NOT_FOUND);

    const profilePicture = await this.profilePictureRepository.find({
      where: { user_id: user.id },
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
      where: { uuid, user_id: user.id },
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
