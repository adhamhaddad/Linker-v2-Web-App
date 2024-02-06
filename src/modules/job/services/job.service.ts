import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Job } from '../entities/job.entity';
import { OrderByCondition, Repository } from 'typeorm';
import { I18nService } from 'nestjs-i18n';
import { CreateJobDto } from '../dto/create-job.dto';
import { UpdateJobDto } from '../dto/update-job.dto';
import { User } from 'src/modules/auth/entities/user.entity';
import { ErrorMessages } from 'src/interfaces/error-messages.interface';
import { JobSerialization } from '../serializers/job.serialization';
import { plainToClass } from 'class-transformer';
import { Profile } from 'src/modules/profile/entities/profile.entity';

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

  async getProfileJobs(username: string, lang: string) {
    const errorMessage: ErrorMessages = this.i18nService.translate(
      'error-messages',
      {
        lang,
      },
    );

    let order: OrderByCondition = { 'jobs.start_date': 'DESC' };

    // Get Profile
    const profile = await this.profileRepository.findOne({
      where: { user: { username } },
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
      .where('profile.uuid = :profileId', { profileId: profile.uuid });

    // Apply ordering, pagination
    qb.orderBy(order);

    const [jobs, total] = await qb.getManyAndCount();

    const data = jobs.map((job) => this.serializeJob(job));

    return {
      data,
      total,
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

    const job = await this.jobRepository.find({
      where: { uuid, user: { id: user.id } },
    });
    if (!job)
      throw new HttpException(errorMessage.jobNotFound, HttpStatus.NOT_FOUND);

    const { affected } = await this.jobRepository.update(
      { uuid },
      updateJobDto,
    );
    if (!affected)
      throw new HttpException(
        errorMessage.failedToUpdateJob,
        HttpStatus.BAD_REQUEST,
      );

    const updatedJob = await this.jobRepository.find({
      where: { uuid },
    });

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
