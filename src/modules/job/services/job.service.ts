import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Job } from '../entities/job.entity';
import { OrderByCondition, Repository } from 'typeorm';
import { I18nService } from 'nestjs-i18n';
import { CreateJobDto } from '../dto/create-job.dto';
import { UpdateJobDto } from '../dto/update-job.dto';
import { User } from 'src/modules/user/entities/user.entity';
import { ErrorMessages } from 'src/interfaces/error-messages.interface';
import { JobSerialization } from '../serializers/job.serialization';
import { plainToClass } from 'class-transformer';
import { Profile } from 'src/modules/profile/entities/profile.entity';
import { FilterJobsDTO } from '../dto/filter-jobs.dto';

@Injectable()
export class JobService {
  constructor(
    @InjectRepository(Job)
    private readonly jobRepository: Repository<Job>,
    @InjectRepository(Profile)
    private readonly profileRepository: Repository<Profile>,
    private readonly i18nService: I18nService,
  ) {}

  async createJob(uuid, body: CreateJobDto, user: User, lang: string) {
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

    const jobCreated = this.jobRepository.create({
      user,
      profile,
      ...body,
    });
    const job = await this.jobRepository.save(jobCreated);
    if (!job)
      throw new HttpException(
        errorMessage.failedToCreateJob,
        HttpStatus.BAD_REQUEST,
      );

    return {
      message: errorMessage.jobCreatedSuccessfully,
      data: this.serializeJob({ ...job }),
    };
  }

  async getJobs(uuid: string, query: FilterJobsDTO, lang: string) {
    const errorMessage: ErrorMessages = this.i18nService.translate(
      'error-messages',
      {
        lang,
      },
    );

    let order: OrderByCondition = { 'jobs.start_date': 'DESC' };

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
    const qb = this.jobRepository
      .createQueryBuilder('jobs')
      .leftJoinAndSelect('jobs.profile', 'profile')
      .where('profile.uuid = :profileId', { profileId: uuid });

    // Apply ordering, pagination
    qb.orderBy(order).skip(skip).take(query.paginate);

    const [jobs, total] = await qb.getManyAndCount();

    const data = jobs.map((job) => this.serializeJob(job));

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

  async getJobById(uuid: string, lang: string) {
    const errorMessage: ErrorMessages = this.i18nService.translate(
      'error-messages',
      {
        lang,
      },
    );

    const job = await this.jobRepository.findOne({
      where: { uuid },
    });
    if (!job)
      throw new HttpException(errorMessage.jobNotFound, HttpStatus.NOT_FOUND);

    return {
      message: '',
      data: this.serializeJob(job),
    };
  }

  async updateJob(
    uuid: string,
    updateJobDto: UpdateJobDto,
    user: User,
    lang: string,
  ) {
    const errorMessage: ErrorMessages = this.i18nService.translate(
      'error-messages',
      {
        lang,
      },
    );

    const job = await this.jobRepository.findOne({
      where: { uuid, user: { id: user.id } },
    });
    if (!job)
      throw new HttpException(errorMessage.jobNotFound, HttpStatus.NOT_FOUND);

    const updatedJob = await this.jobRepository.save({
      ...job,
      ...updateJobDto,
    });
    if (!updatedJob)
      throw new HttpException(
        errorMessage.failedToUpdateJob,
        HttpStatus.BAD_REQUEST,
      );

    return {
      message: errorMessage.jobUpdatedSuccessfully,
      data: this.serializeJob(updatedJob),
    };
  }

  async deleteJob(uuid: string, user: User, lang: string) {
    const errorMessage: ErrorMessages = this.i18nService.translate(
      'error-messages',
      {
        lang,
      },
    );

    const job = await this.jobRepository.findOne({
      where: { uuid, user: { id: user.id } },
    });
    if (!job)
      throw new HttpException(errorMessage.jobNotFound, HttpStatus.NOT_FOUND);

    const { affected } = await this.jobRepository.delete({ uuid });
    if (!affected)
      throw new HttpException(
        errorMessage.failedToDeleteJob,
        HttpStatus.BAD_REQUEST,
      );

    return {
      message: errorMessage.jobDeletedSuccessfully,
      data: this.serializeJob(job),
    };
  }

  serializeJob(job) {
    return plainToClass(JobSerialization, job, {
      excludeExtraneousValues: true,
      enableCircularCheck: true,
      strategy: 'excludeAll',
    });
  }
}
