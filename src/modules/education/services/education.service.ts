import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Education } from '../entities/education.entity';
import { OrderByCondition, Repository } from 'typeorm';
import { I18nService } from 'nestjs-i18n';
import { CreateEducationDto } from '../dto/create-education.dto';
import { User } from 'src/modules/user/entities/user.entity';
import { ErrorMessages } from 'src/interfaces/error-messages.interface';
import { UpdateEducationDto } from '../dto/update-education.dto';
import { EducationSerialization } from '../serializers/education.serialization';
import { plainToClass } from 'class-transformer';
import { Profile } from 'src/modules/profile/entities/profile.entity';
import { FilterEducationDTO } from '../dto/filter-education.dto';

@Injectable()
export class EducationService {
  constructor(
    @InjectRepository(Education)
    private readonly educationRepository: Repository<Education>,
    @InjectRepository(Profile)
    private readonly profileRepository: Repository<Profile>,
    private readonly i18nService: I18nService,
  ) {}

  async createEducation(
    uuid: string,
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

    const profile = await this.profileRepository.findOne({
      where: { uuid, user: { id: user.id } },
    });
    if (!profile)
      throw new HttpException(
        errorMessage.profileNotFound,
        HttpStatus.NOT_FOUND,
      );

    const educationCreated = this.educationRepository.create({
      user,
      profile,
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

  async getEducation(uuid: string, query: FilterEducationDTO, lang: string) {
    const errorMessage: ErrorMessages = this.i18nService.translate(
      'error-messages',
      {
        lang,
      },
    );
    let order: OrderByCondition = { 'education.start_date': 'DESC' };

    query.paginate = query.paginate || 15;
    query.page = query.page || 1;
    const skip = (query.page - 1) * query.paginate;

    // Get Profile
    const profile = await this.profileRepository.findOne({
      where: { uuid },
    });
    if (!profile)
      throw new HttpException(
        errorMessage.profileNotFound,
        HttpStatus.NOT_FOUND,
      );

    // Create Query Builder
    const qb = this.educationRepository
      .createQueryBuilder('education')
      .leftJoinAndSelect('education.profile', 'profile')
      .where('profile.uuid = :profileId', { profileId: uuid });

    // Apply ordering, pagination
    qb.orderBy(order).skip(skip).take(query.paginate);

    const [education, total] = await qb.getManyAndCount();

    const data = education.map((education) =>
      this.serializeEducation(education),
    );

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

    const updatedEducation = await this.educationRepository.save({
      ...education,
      ...updateEducationDto,
    });
    if (!updatedEducation)
      throw new HttpException(
        errorMessage.failedToUpdateEducation,
        HttpStatus.BAD_REQUEST,
      );

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
