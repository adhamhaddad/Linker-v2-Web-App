import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Education } from '../entities/education.entity';
import { Repository } from 'typeorm';
import { I18nService } from 'nestjs-i18n';
import { CreateEducationDto } from '../dto/create-education.dto';
import { User } from 'src/modules/auth/entities/user.entity';
import { ErrorMessages } from 'src/interfaces/error-messages.interface';
import { UpdateEducationDto } from '../dto/update-education.dto';
import { EducationSerialization } from '../serializers/education.serialization';
import { plainToClass } from 'class-transformer';

@Injectable()
export class EducationService {
  constructor(
    @InjectRepository(Education)
    private readonly educationRepository: Repository<Education>,
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    private readonly i18nService: I18nService,
  ) {}

  async createEducation(
    createEducationDto: CreateEducationDto,
    user: User,
    lang: string,
  ) {
    const errorMessage: ErrorMessages = this.i18nService.translate(
      'error-messages',
      {
        lang,
      },
    );

    const educationCreated = this.educationRepository.create({
      user: { id: user.id },
      ...createEducationDto,
    });
    const education = await this.educationRepository.save(educationCreated);
    if (!education)
      throw new HttpException(
        errorMessage.failedToCreateEducation,
        HttpStatus.BAD_REQUEST,
      );

    return {
      message: errorMessage.educationCreatedSuccessfully,
      data: this.serializeEducation({ ...education }),
    };
  }

  async getEducationById(uuid: string, lang: string) {
    const errorMessage: ErrorMessages = this.i18nService.translate(
      'error-messages',
      {
        lang,
      },
    );

    const education = await this.educationRepository.findOne({
      where: { uuid },
    });
    if (!education)
      throw new HttpException(
        errorMessage.educationNotFound,
        HttpStatus.NOT_FOUND,
      );

    return {
      message: '',
      data: this.serializeEducation(education),
    };
  }

  async getEducationByUserId(uuid: string, lang: string) {
    const errorMessage: ErrorMessages = this.i18nService.translate(
      'error-messages',
      {
        lang,
      },
    );

    // Get user
    const user = await this.userRepository.findOne({
      where: { uuid },
    });
    if (!user)
      throw new HttpException(errorMessage.userNotFound, HttpStatus.NOT_FOUND);

    const education = await this.educationRepository.find({
      where: { user: { id: user.id } },
    });
    if (!education)
      throw new HttpException(
        errorMessage.educationNotFound,
        HttpStatus.NOT_FOUND,
      );

    return {
      message: '',
      data: this.serializeEducation(education),
    };
  }

  async updateEducation(
    uuid: string,
    updateEducationDto: UpdateEducationDto,
    user: User,
    lang: string,
  ) {
    const errorMessage: ErrorMessages = this.i18nService.translate(
      'error-messages',
      {
        lang,
      },
    );

    const education = await this.educationRepository.find({
      where: { uuid, user: { id: user.id } },
    });
    if (!education)
      throw new HttpException(
        errorMessage.educationNotFound,
        HttpStatus.NOT_FOUND,
      );

    const { affected } = await this.educationRepository.update(
      { uuid },
      updateEducationDto,
    );
    if (!affected)
      throw new HttpException(
        errorMessage.failedToUpdateEducation,
        HttpStatus.BAD_REQUEST,
      );

    const updatedEducation = await this.educationRepository.find({
      where: { uuid },
    });

    return {
      message: errorMessage.educationUpdatedSuccessfully,
      data: this.serializeEducation(updatedEducation),
    };
  }

  async deleteEducation(uuid: string, user: User, lang: string) {
    const errorMessage: ErrorMessages = this.i18nService.translate(
      'error-messages',
      {
        lang,
      },
    );

    const education = await this.educationRepository.findOne({
      where: { uuid, user: { id: user.id } },
    });
    if (!education)
      throw new HttpException(
        errorMessage.educationNotFound,
        HttpStatus.NOT_FOUND,
      );

    const { affected } = await this.educationRepository.delete({ uuid });
    if (!affected)
      throw new HttpException(
        errorMessage.failedToDeleteEducation,
        HttpStatus.BAD_REQUEST,
      );

    return {
      message: errorMessage.educationDeletedSuccessfully,
      data: this.serializeEducation(education),
    };
  }

  serializeEducation(education) {
    return plainToClass(EducationSerialization, education, {
      excludeExtraneousValues: true,
      enableCircularCheck: true,
      strategy: 'excludeAll',
    });
  }
}
