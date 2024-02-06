import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { CoverPicture } from '../entities/cover-picture.entity';
import { OrderByCondition, Repository } from 'typeorm';
import { User } from 'src/modules/auth/entities/user.entity';
import * as fs from 'fs-extra';
import { join } from 'path';
import { ErrorMessages } from 'src/interfaces/error-messages.interface';
import { I18nService } from 'nestjs-i18n';
import { CoverPictureSerialization } from '../serializers/cover.serialization';
import { plainToClass } from 'class-transformer';
import { v4 as uuidV4 } from 'uuid';
import { Profile } from 'src/modules/profile/entities/profile.entity';

@Injectable()
export class CoverPictureService {
  constructor(
    @InjectRepository(CoverPicture)
    private readonly coverPictureRepository: Repository<CoverPicture>,
    @InjectRepository(Profile)
    private readonly profileRepository: Repository<Profile>,
    private readonly i18nService: I18nService,
  ) {}

  async uploadCoverPicture(uuid: string, file: any, user: User, lang: string) {
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
    const imageUrl = `uploads/cover-pictures/${imageUuid}-${file.originalname}`;

    const uploads = join(
      __dirname,
      '..',
      '..',
      '..',
      '..',
      'uploads',
      'cover-pictures',
      `${imageUuid}-${file.originalname}`,
    );

    await fs.move(file.path, uploads);

    const coverCreated = this.coverPictureRepository.create({
      user,
      profile,
      image_url: imageUrl,
    });
    const coverPicture = await this.coverPictureRepository.save(coverCreated);
    if (!coverPicture)
      throw new HttpException(
        errorMessage.failedToCreateCoverPicture,
        HttpStatus.BAD_REQUEST,
      );

    return {
      message: errorMessage.coverPictureCreatedSuccessfully,
      data: this.serializeCoverPicture(coverPicture),
    };
  }

  async getProfileCovers(uuid: string, lang: string) {
    const errorMessage: ErrorMessages = this.i18nService.translate(
      'error-messages',
      {
        lang,
      },
    );
    let order: OrderByCondition = { 'cover.created_at': 'DESC' };

    const profile = await this.profileRepository.findOne({ where: { uuid } });
    if (!profile)
      throw new HttpException(
        errorMessage.profileNotFound,
        HttpStatus.NOT_FOUND,
      );

    // Create Query Builder
    const qb = this.coverPictureRepository
      .createQueryBuilder('cover')
      .leftJoinAndSelect('cover.profile', 'profile')
      .where('profile.uuid = :profileId', { profileId: uuid });

    // Apply ordering, pagination
    qb.orderBy(order);

    const [covers, total] = await qb.getManyAndCount();

    const data = covers.map((cover) => this.serializeCoverPicture(cover));

    return {
      data,
      total,
    };
  }

  async getCoverPictureById(uuid: string, lang: string) {
    const errorMessage: ErrorMessages = this.i18nService.translate(
      'error-messages',
      {
        lang,
      },
    );

    const coverPicture = await this.coverPictureRepository.findOne({
      where: { uuid },
    });
    if (!coverPicture)
      throw new HttpException(
        errorMessage.coverPictureNotFound,
        HttpStatus.NOT_FOUND,
      );

    return {
      message: '',
      data: this.serializeCoverPicture(coverPicture),
    };
  }

  async deleteCoverPicture(uuid: string, user: User, lang: string) {
    const errorMessage: ErrorMessages = this.i18nService.translate(
      'error-messages',
      {
        lang,
      },
    );

    const coverPicture = await this.coverPictureRepository.findOne({
      where: { uuid, user: { id: user.id } },
    });
    if (!coverPicture)
      throw new HttpException(
        errorMessage.coverPictureNotFound,
        HttpStatus.NOT_FOUND,
      );

    const { affected } = await this.coverPictureRepository.delete({ uuid });
    if (!affected)
      throw new HttpException(
        errorMessage.failedToDeleteCoverPicture,
        HttpStatus.BAD_REQUEST,
      );

    return {
      message: errorMessage.coverPictureDeletedSuccessfully,
      data: this.serializeCoverPicture(coverPicture),
    };
  }

  serializeCoverPicture(picture) {
    return plainToClass(CoverPictureSerialization, picture, {
      excludeExtraneousValues: true,
      enableCircularCheck: true,
      strategy: 'excludeAll',
    });
  }
}
